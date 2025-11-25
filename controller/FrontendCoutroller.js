const Slider = require('../api/model/Slider');
const Service = require('../api/model/Service');

const FrontendCoutroller = {};

FrontendCoutroller.getHome = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ order: 1 });

        res.render('frontend/index', {
            title: 'Home',
            layout: false,
            sliders: sliders
        });
    } catch (error) {

        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getAbout = async (req, res) => {
    try {
        res.render('frontend/about', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getBlog = async (req, res) => {
    try {
        res.render('frontend/blog', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getCareer = async (req, res) => {
    try {
        res.render('frontend/career', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getContact = async (req, res) => {
    try {
        res.render('frontend/contact', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getWork = async (req, res) => {
    try {
        res.render('frontend/how-it-work', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getPost = async (req, res) => {
    try {
        res.render('frontend/post', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getProject = async (req, res) => {
    try {
        res.render('frontend/projects', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getProjectDetails = async (req, res) => {
    try {
        res.render('frontend/project-detail', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getService = async (req, res) => {
    try {
        const services = await Service.find({ visible: true });
        res.render('frontend/services', {
            title: 'Services',
            layout: false,
            services
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getServiceDetails = async (req, res) => {
    try {
        const slug = req.params.slug;
        const services = await Service.find({ visible: true }).select('name slug');
        const service = await Service.findOne({ slug: slug, visible: true });
        if(!service) return res.render('frontend/404', { title: 'Page not found', layout: false });
        res.render('frontend/service-detail', {
            title: 'Service Details',
            layout: false,
            service, services
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getTeam = async (req, res) => {
    try {
        res.render('frontend/team', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getTestimonial = async (req, res) => {
    try {
        res.render('frontend/testimonials', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = FrontendCoutroller;