const Blog = require('../api/model/Blog');
const Slider = require('../api/model/Slider');

const FrontendCoutroller = {};

FrontendCoutroller.getHome = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ order: 1 });
        console.log(sliders, "sliders")
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

function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '');
}

function shortContent(html, length = 150) {
    const text = stripHtml(html);
    return text.length > length
        ? text.substring(0, length) + "..."
        : text;
}

FrontendCoutroller.getBlog = async (req, res) => {
    try {
        let blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .select('title slug content featuredImage categories createdAt')
            .populate('categories', 'name slug');

        blogs = blogs.map(b => {
            return {
                ...b._doc,   // Important: convert Mongo doc to plain object
                createdAt: formatDate(b.createdAt),
                content: shortContent(b.content, 200)
            };
        });
        console.log(blogs, "blogs");
        res.render('frontend/blog', {
            title: 'Blog',
            layout: false,
            blogs: blogs
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
        res.render('frontend/services', {
            title: 'Home',
            layout: false,
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getServiceDetails = async (req, res) => {
    try {
        res.render('frontend/service-detail', {
            title: 'Home',
            layout: false,
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