const axios = require('axios');
const { toNestedObject } = require('../utils/helper');

const AboutUsController = {};

// Get AboutUs page (for rendering)
AboutUsController.getAboutUsPage = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/aboutus`);
        console.log(response,"response")
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
        
        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }

        const newAboutUs = await axios.post(`${process.env.API_URL}/api/aboutus`, {
            ownerDetail: {
                ...ownerDetail,
                image: imageFile ? imageFile.name : null
            },
            sections,
            visible
        });

        console.log('Created AboutUs:', newAboutUs.data);
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
        
        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }

        const updatedAboutUs = await axios.put(`${process.env.API_URL}/api/aboutus/${req.params.id}`, {
            ownerDetail: {
                ...ownerDetail,
            },
            image: imageFile ? imageFile.name : ownerDetail?.image,
            sections,
            visible
        });

        console.log('Updated AboutUs:', updatedAboutUs.data);
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
