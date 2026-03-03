const axios = require('axios');
const { toNestedObject } = require('../utils/helper');
const path = require('path');
const fs = require('fs');

const AboutUsController = {};

// Get AboutUs page (for rendering)
AboutUsController.getAboutUsPage = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/aboutus`);
        const aboutUsData = response.data.length > 0 ? response.data : null;
        res.render('aboutus', { aboutUs: aboutUsData, title: 'About Us', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error('Error fetching AboutUs:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Add AboutUs form page
AboutUsController.addAboutUs = async (req, res) => {
    res.render('add-aboutus', { title: 'Add About Us', layout: 'partials/layout-vertical' });
};

// Create AboutUs
AboutUsController.createAboutUs = async (req, res) => {
    try {
        const { ownerDetail, sections, visible } = toNestedObject(req.body);
        const imageFile = req.files?.image || null;

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

        await axios.post(`${process.env.API_URL}/api/aboutus`, {
            ownerDetail: {
                ...ownerDetail,
                image: finalImageName
            },
            sections,
            visible
        });

        res.redirect('/admin/aboutus');

    } catch (error) {
        console.error('Error creating AboutUs:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Edit AboutUs form page
AboutUsController.editAboutUs = async (req, res) => {
    try {
        const aboutUs = await axios.get(`${process.env.API_URL}/api/aboutus/${req.params.id}`);
        res.render('edit-aboutus', { aboutUs: aboutUs.data, title: 'Edit About Us', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error('Error fetching AboutUs:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update AboutUs
AboutUsController.updateAboutUs = async (req, res) => {
    try {
        const { ownerDetail, sections, visible } = toNestedObject(req.body);
        const imageFile = req.files?.image || null;

        const uploadDir = path.join(__dirname, '../uploads');
        let finalImageName = ownerDetail?.oldImage || null;

        if (imageFile) {

            const ext = path.extname(imageFile.name);
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = path.join(uploadDir, uniqueName);

            await imageFile.mv(uploadPath);

            // 🔥 Delete old image if exists
            if (ownerDetail?.oldImage) {
                const oldPath = path.join(uploadDir, ownerDetail.oldImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            finalImageName = uniqueName;
        }

        await axios.put(
            `${process.env.API_URL}/api/aboutus/${req.params.id}`,
            {
                ownerDetail: {
                    ...ownerDetail,
                    image: finalImageName
                },
                sections,
                visible
            }
        );

        res.redirect('/admin/aboutus');

    } catch (error) {
        console.error('Error updating AboutUs:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete AboutUs
AboutUsController.deleteAboutUs = async (req, res) => {
    try {
        await axios.delete(`${process.env.API_URL}/api/aboutus/${req.params.id}`);
        res.redirect('/admin/aboutus');
    } catch (error) {
        console.error('Error deleting AboutUs:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = AboutUsController;
