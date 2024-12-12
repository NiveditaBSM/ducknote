const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendVerificationEmail } = require('../services/emailService');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}/users/verify/`

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password_hash: hashedPassword,
            is_verified: false,
        });

        const token = jwt.sign({ user_id: user.user_id, type: 'verification token' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const verificationLink = `${baseUrl}${token}`

        await sendVerificationEmail(user, verificationLink);

        return res.status(201).json({ message: 'User registered successfully, check your email for verification.' });

    } catch (error) {
        console.error(error);
        const newUser = await User.findOne({ where: { email, name } });
        if (newUser) {
            await User.destroy({ where: { email, name } });
        }
        return res.status(500).json({ internalError: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        if (!user.is_verified) {
            return res.status(400).json({ error: 'Account not verified' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ internalError: 'Error logging in' });
    }
};

const handleExpiredToken = async (baseUrl, expiredToken, res) => {
    try {

        const { user_id } = jwt.decode(expiredToken);

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'User is already verified.' });
        }

        const newToken = jwt.sign(
            { user_id: user.user_id, type: 'verification token' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const verificationLink = `${baseUrl}${newToken}`;

        await sendVerificationEmail(user, verificationLink);

        return res.status(200).json({
            message: 'Your verification link has expired. A new link has been sent to your email.',
        });

    } catch (error) {
        console.error('Error handling expired token:', error);
        return res.status(500).json({ internalError: 'Internal server error.' });
    }
};

exports.verifyUser = async (req, res) => {
    const { token } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}/users/verify/`

    try {
        console.log('Before decoding, the token: ', token)

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { user_id: decoded.user_id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.is_verified = true;
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully!' });

    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return handleExpiredToken(token, baseUrl, res);
        }

        return res.status(400).json({ error: 'Invalid or malformed token.' });
    }
};
