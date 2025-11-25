const axios = require('axios');
const UserController = {};



UserController.login = (req, res) => {
    res.render('auth-login', { title: 'Login', layout: 'partials/layout-auth' });
};

UserController.verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await axios.post(`${process.env.API_URL}/api/login`, { email, password });

        if (response.data && response.data.token) {
            req.session.token = response.data.token;

            res.cookie('token', response.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000 // 1 hour
            });

            return res.redirect('/admin');
        } else {
            return res.status(401).render('auth-login', {
                title: 'Login',
                layout: 'partials/layout-auth',
                error: 'Invalid email or password. Please try again.'
            });
        }
    } catch (error) {
        console.error('Login error from API:', error.response?.data || error.message);

        let errorMsg = 'User not found. Please try again later.';
        if (error.response?.status === 401) {
            errorMsg = 'Invalid email or password.';
        } else if (error.code === 'ECONNREFUSED') {
            errorMsg = 'Unable to connect to authentication server.';
        }

        return res.status(500).render('auth-login', {
            title: 'Login',
            layout: 'partials/layout-auth',
            error: errorMsg
        });
    }
};


UserController.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/login');
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
        res.render('add-user', { title: 'Add User', layout: 'partials/layout-vertical',roles:roles.data });
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
        res.render('edit-user', { title: 'Edit User', layout: 'partials/layout-vertical', user: response.data , roles: roles.data });
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

module.exports = UserController;