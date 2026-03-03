const axios = require('axios');
const contact = require('../api/model/contact');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../api/model/User');
const UserController = {};



UserController.login = (req, res) => {
    res.render('auth-login', { title: 'Login', layout: 'partials/layout-auth' });
};

UserController.verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
            .select('+password')
            .populate("role_id");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).render('auth-login', {
                title: 'Login',
                layout: 'partials/layout-auth',
                error: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).render('auth-login', {
                title: 'Login',
                layout: 'partials/layout-auth',
                error: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role_id?.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        req.session.token = token;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000
        });

        return res.redirect('/admin');

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).render('auth-login', {
            title: 'Login',
            layout: 'partials/layout-auth',
            error: 'Something went wrong. Please try again.'
        });
    }
};

UserController.logout = (req, res) => {
    try {
        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.log("Session destroy error:", err);
            }
        });

        // Clear cookie
        res.clearCookie('token');

        // Remove axios default auth header
        delete axios.defaults.headers.common['authorization'];

        return res.redirect('/admin/login');
    } catch (error) {
        console.log("Logout error:", error);
        return res.redirect('/admin/login');
    }
};


UserController.getUsers = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/users`);
        res.render('users', { title: 'Users', layout: 'partials/layout-vertical', users: response.data });
    } catch (error) {
        console.log(error, "Error fetching users");
        res.status(500).send('Error fetching users');
    }
}

UserController.addUser = async (req, res) => {
    try {
        const roles = await axios.get(`${process.env.API_URL}/api/roles`);
        res.render('add-user', { title: 'Add User', layout: 'partials/layout-vertical', roles: roles.data });
    } catch (error) {
        console.error('Error rendering add user page:', error);
        res.status(500).send('Error rendering add user page');
    }
}

UserController.createUser = async (req, res) => {
    try {
        const { name, username, email, password, profileImage, role } = req.body;
        const image = req.files?.profileImage || null;

        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            console.log('File moved successfully');
        }

        const newUser = {
            name,
            username,
            email,
            password, // Ensure to hash the password before saving in production
            profileImage: image ? image.name : null,
            role
        };

        await axios.post(`${process.env.API_URL}/api/createUser`, newUser);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
}

UserController.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await axios.get(`${process.env.API_URL}/api/editUser/${userId}`);
        const roles = await axios.get(`${process.env.API_URL}/api/roles`);
        console.log(response.data);
        console.log(roles.data);
        res.render('edit-user', { title: 'Edit User', layout: 'partials/layout-vertical', user: response.data, roles: roles.data });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Error fetching user for edit');
    }
}

UserController.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, existingImage, role_id } = req.body;
        const image = req.files?.profileImage || null;

        let profileImage;

        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            profileImage = `uploads/${image.name}`;
        } else {
            profileImage = existingImage || null;
        }

        const updatedUser = {
            name,
            username,
            email,
            profileImage,
            role_id
        };

        await axios.put(`${process.env.API_URL}/api/updateUser/${userId}`, updatedUser);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
};


UserController.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await axios.delete(`${process.env.API_URL}/api/deleteUser/${userId}`);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}



UserController.getContacts = async (req, res) => {
    try {
        const contacts = await contact.find().sort({ createdAt: -1 });
        res.render('contacts', { title: 'Contact Messages', layout: 'partials/layout-vertical', contacts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};



UserController.getContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactData = await contact.findById(contactId);
        if (!contactData) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.status(200).json(contactData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact message', error });
    }
};

UserController.deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.redirect('/admin/contacts');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact message', error });
    }
};

module.exports = UserController;