const user = require('../model/User');
const bcrypt = require('bcrypt');

const UserController = {};

// Get all users
UserController.getUsers = async (req, res) => {
    try {
        const users = await user.find().select('-password'); // Exclude password from results
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}
// Create a new user
UserController.createUser = async (req, res) => {
    try {
        const { name, username, email, password, profileImage, role } = req.body;
        const newUser = new user({
            name,
            username,
            email,
            password, // Ensure to hash the password before saving in production
            profileImage,
            role
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}
// Edit a user
UserController.editUser = async (req, res) => { 
    try {
        const userId = req.params.id;
        const userData = await user.findById(userId).select('-password'); // Exclude password
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
}
// Update a user
UserController.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, profileImage, role } = req.body;
        const updatedUser = await user.findByIdAndUpdate(userId, {
            name,
            username,
            email,
            profileImage,
            role
        }, { new: true }).select('-password'); // Exclude password
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}
// Delete a user
UserController.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}  
// User login
UserController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', user: { ...foundUser.toObject(), password: undefined } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
}

// User registration
UserController.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const newUser = new user({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}

module.exports = UserController;