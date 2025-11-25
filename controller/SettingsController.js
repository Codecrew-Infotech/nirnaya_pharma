const axios = require('axios');

const SettingsController = {};

SettingsController.getSettings = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const response = await axios.get(`${process.env.API_URL}/api/settings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.render('settings', { title: 'Settings', layout: 'partials/layout-vertical', settings: response.data });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error",
            error: error.response?.data || error.message
        });
    }
}

SettingsController.addSettings = (req, res) => {
    res.render('add-settings', { title: 'Add Settings', layout: 'partials/layout-vertical' });
}

SettingsController.createSettings = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const imageFile = req.files?.settingFile || null;

        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }
        const { key, type, settingValue } = req.body;
        const value = type === 'image' ? (imageFile ? imageFile.name : null) : settingValue;
        await axios.post(`${process.env.API_URL}/api/createSettings`, { key, type, value }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Error creating settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error creating settings",
            error: error.response?.data || error.message
        });
    }
}

SettingsController.editSettings = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const response = await axios.get(`${process.env.API_URL}/api/editSettings/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.render('edit-settings', { title: 'Edit Settings', layout: 'partials/layout-vertical', setting: response.data });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error fetching settings",
            error: error.response?.data || error.message
        });
    }
}

SettingsController.updateSettings = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const settingId = req.params.id;
        const imageFile = req.files?.settingFile || null;

        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }
        const { key, type, settingValue } = req.body;
        const value = type === 'image' ? (imageFile ? imageFile.name : null) : settingValue;
        await axios.put(`${process.env.API_URL}/api/updateSettings/${settingId}`, { key, type, value }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Error updating settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error updating settings",
            error: error.response?.data || error.message
        });
    }
}

SettingsController.deleteSettings = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const settingId = req.params.id;
        await axios.delete(`${process.env.API_URL}/api/deleteSettings/${settingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Error deleting settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error deleting settings",
            error: error.response?.data || error.message
        });
    }
}



module.exports = SettingsController;

