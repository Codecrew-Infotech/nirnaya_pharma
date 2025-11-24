const axios = require('axios');
const UserController = {};

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
        res.render('add-user', { title: 'Add User', layout: 'partials/layout-vertical' });
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
        console.log(response.data);
        res.render('edit-user', { title: 'Edit User', layout: 'partials/layout-vertical', user: response.data });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Error fetching user for edit');
    }
}

UserController.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, existingImage, role } = req.body;
        const image = req.files?.profileImage || null;

        let profileImage;
        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            console.log('File moved successfully');
            profileImage = image.name;
        } else {
            profileImage = existingImage || null;
        }

        const updatedUser = {
            name,
            username,
            email,
            profileImage,
            role
        };

        await axios.put(`${process.env.API_URL}/api/updateUser/${userId}`, updatedUser);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
}
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

module.exports = UserController;