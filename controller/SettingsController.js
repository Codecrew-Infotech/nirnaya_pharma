const axios = require('axios');
const path = require('path');
const fs = require('fs');

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
        let finalImageName = null;

        if (imageFile) {

            // 1️⃣ Get file extension
            const ext = path.extname(imageFile.name);

            // 2️⃣ Create unique filename
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

            // 3️⃣ Upload directory
            const uploadDir = path.join(__dirname, '../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = path.join(uploadDir, uniqueName);

            // 4️⃣ Move file
            await imageFile.mv(uploadPath);

            finalImageName = uniqueName;
        }

        const { key, type, settingValue } = req.body;

        let value;

        if (type === 'image') {
            value = finalImageName ? finalImageName : null;
        } else {
            value = settingValue;
        }

        await axios.post(
            `${process.env.API_URL}/api/createSettings`,
            { key, type, value },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.redirect('/admin/settings');

    } catch (error) {
        console.error('Error creating settings:', error);
        return res.status(500).render('error', {
            title: "Error",
            message: "Error creating settings",
            error: error.response?.data || error.message
        });
    }
};

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

        let finalImageName = null;

        if (imageFile) {

            const ext = path.extname(imageFile.name);

            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

            const uploadDir = path.join(__dirname, '../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = path.join(uploadDir, uniqueName);

            await imageFile.mv(uploadPath);

            finalImageName = uniqueName;
        }

        const { key, type, settingValue, oldImage } = req.body;

        let value;

        if (type === 'image') {
            value = finalImageName ? finalImageName : oldImage;
        } else {
            value = settingValue;
        }

        await axios.put(
            `${process.env.API_URL}/api/updateSettings/${settingId}`,
            { key, type, value },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

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

