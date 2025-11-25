const Blog = require('../api/model/Blog');
const Slider = require('../api/model/Slider');
const Service = require('../api/model/Service');
const category = require('../api/model/Category');
const Settings = require('../api/model/Settings');
const AboutUs = require('../api/model/AboutUs');

const FrontendCoutroller = {};

FrontendCoutroller.getHome = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ order: 1 });
        console.log(sliders,"sliders");

        let blogs = await Blog.find({ isPublished: true }).select('title slug content featuredImage createdAt').populate('categories', 'name slug');
        blogs = blogs.map(b => {
            return {
                ...b._doc,
                createdAt: formatDate(b.createdAt),
                content: shortContent(b.content, 200)
            };
        });
        const services = await Service.find();
        console.log(blogs, "blogs");
        res.render('frontend/index', {
            title: 'Home',
            layout: false,
            sliders: sliders,
            blogs: blogs,
            services: services,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
        });
    } catch (error) {

        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getAbout = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne({visible:true})
        res.render('frontend/about', {
            title: 'Home',
            layout: false,
            aboutUs,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
        const latestPosts = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title slug createdAt featuredImage');
        const categories = await category.find();
        res.render('frontend/blog', {
            title: 'Blog',
            layout: false,
            blogs: blogs,
            latestPosts,
            categories,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []

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
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getContact = async (req, res) => {
    try {
        const settingsData = await Settings.find()
        console.log(settingsData);
        const settingsMap = {};
        settingsData.forEach(item => {
            settingsMap[item.key] = item.value;
        });
        res.render('frontend/contact', {
            title: 'Home',
            layout: false,
            settings: settingsMap,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getPostDetails = async (req, res) => {
    try {
        const slug = req.params.slug;
        const blog = await Blog.findOne({ slug }).populate('categories', 'name slug');
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        const latestPosts = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title slug createdAt featuredImage');
        const categories = await category.find();


        res.render('frontend/post', {
            title: 'Home',
            layout: false,
            blog,
            categories,
            latestPosts,
            metaTitle: blog.metaTitle,
            metaDescription: blog.metaDescription,
            metaKeywords: blog.metaTitle || []
        });

    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
FrontendCoutroller.getCategoryPost = async (req, res) => {
    try {
        const slug = req.params.slug;
        const categoryData = await category.findOne({ slug });

        // Handle category not found
        if (!categoryData) {
            return res.status(404).render('frontend/404', {
                title: 'Category Not Found',
                layout: false
            });
        }

        // Fetch posts for this category
        let latestPosts = await Blog.find({
            categories: categoryData._id,
            isPublished: true
        })
            .populate('categories', 'name slug')
            .sort({ createdAt: -1 })
            .select('title slug createdAt featuredImage content');

        // Format the posts
        latestPosts = latestPosts.map(b => {
            return {
                ...b._doc,
                createdAt: formatDate(b.createdAt),
                content: shortContent(b.content, 200)
            };
        });

        res.render('frontend/categorypost', {
            title: categoryData.name + ' - Posts',
            metaTitle: categoryData.metaTitle || categoryData.name,
            metaDescription: categoryData.metaDescription || categoryData.description,
            metaKeywords: categoryData.metaKeywords || [],
            layout: false,
            categoryData,
            latestPosts
        });
    } catch (error) {
        console.error('Error fetching category posts:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Helper functions (if not already defined)
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function shortContent(htmlContent, maxLength = 200) {
    // Remove HTML tags
    const plainText = htmlContent.replace(/<[^>]*>/g, '');

    // Trim to maxLength
    if (plainText.length > maxLength) {
        return plainText.substring(0, maxLength).trim() + '...';
    }

    return plainText;
}
FrontendCoutroller.getProject = async (req, res) => {
    try {
        res.render('frontend/projects', {
            title: 'Home',
            layout: false,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
            services,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
        if (!service) return res.render('frontend/404', { title: 'Page not found', layout: false });
        res.render('frontend/service-detail', {
            title: 'Service Details',
            layout: false,
            service, services,
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
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
            metaTitle: "",
            metaDescription: "",
            metaKeywords: []
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = FrontendCoutroller;