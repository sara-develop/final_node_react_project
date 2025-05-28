const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({ message: 'ID and password are required' });
        }

        const foundUser = await User.findOne({ id }).lean();
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isManager = id === process.env.MANAGER_ID;

        const userInfo = {
            _id: foundUser._id,
            name: foundUser.name,
            role: foundUser.role,
            id: foundUser.id,
            isManager
        };

        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(500).json({ message: 'Login failed', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
};

const register = async (req, res) => {
    try {
        const { name, id, password } = req.body;

        if (!name || !id || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const duplicate = await User.findOne({ id }).lean();
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userObject = { name, id, password: hashedPassword };
        const user = await User.create(userObject);

        return res.status(201).json({ message: `New user ${user.name} created` });
    } catch (err) {
        return res.status(500).json({ message: 'Registration failed', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, name, password } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        return res.status(200).json({ message: `User ${id} updated` });
    } catch (err) {
        return res.status(500).json({ message: 'Update failed', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        return res.status(200).json({ message: `User ${id} deleted` });
    } catch (err) {
        return res.status(500).json({ message: 'Deletion failed', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
};

module.exports = {
    login,
    register,
    updateUser,
    deleteUser
};
