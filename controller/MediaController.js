const axios = require('axios');

const MediaController = {};

MediaController.getMedia = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/media`);
        console.log(response.data, "Media data fetched successfully");
        res.render('media', { title: 'Media', layout: 'partials/layout-vertical', media: response.data });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
MediaController.getFront = async (req, res) => {
    try {
        res.render('frontend/index', { 
            title: 'Pages',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = MediaController;