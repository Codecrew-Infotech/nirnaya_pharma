const Blog = require('../api/model/Blog');
const Slider = require('../api/model/Slider');
const Service = require('../api/model/Service');
const category = require('../api/model/Category');
const Settings = require('../api/model/Settings');
const AboutUs = require('../api/model/AboutUs');
const Contact = require('../api/model/contact');
const sendMail = require('../utils/sendMail');
const ejs = require('ejs');
const path = require('path');

const FrontendCoutroller = {};

FrontendCoutroller.getHome = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ order: 1 });


        let blogs = await Blog.find({ isPublished: true }).select('title slug content featuredImage createdAt').populate('categories', 'name slug');
        blogs = blogs.map(b => {
            return {
                ...b._doc,
                createdAt: formatDate(b.createdAt),
                content: shortContent(b.content, 200)
            };
        });
        const services = await Service.find();
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
        const aboutUs = await AboutUs.findOne({ visible: true })
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


FrontendCoutroller.postFormData = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1️⃣ Save in DB first
         await Contact.create({
            firstName: name,
            subject: "Service Inquiry",
            email,
            message: `Inquiry for service: ${message}`
        });

        // 2️⃣ Try sending mail (do not break flow if fails)
        try {

            const html = await ejs.renderFile(
                path.join(__dirname, '../views/emails/service-inquiry.ejs'),
                {
                    companyName: "Nirnaya Pharma",
                    serviceName: name,
                    email,
                    phone: "",
                    adminUrl: "https://yourdomain.com/admin/contacts"
                }
            );

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Service Inquiry - ${name}`,
                html
            });
            console.log("mail send in searvice inquiry");
        } catch (mailError) {
            console.error("Service mail failed:", mailError);
        }

        // 3️⃣ Flash success message
        req.flash('success', 'Your service inquiry has been submitted successfully.');
        res.redirect('/about?success=true');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
};
FrontendCoutroller.postCallback = async (req, res) => {
    try {
        const { name, service, email, phone } = req.body;

        // 1️⃣ Save in DB first
         await Contact.create({
            firstName: name,
            subject: service,
            email,
            phone,
            message: `Inquiry for service: ${service}, Phone: ${phone}`
        });

        // 2️⃣ Try sending mail (do not break flow if fails)
        try {

            const html = await ejs.renderFile(
                path.join(__dirname, '../views/emails/service-inquiry.ejs'),
                {
                    companyName: "Nirnaya Pharma",
                    serviceName: name,
                    email,
                    phone: phone || "N/A",
                    adminUrl: "https://yourdomain.com/admin/contacts"
                }
            );

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Service Inquiry - ${name}`,
                html
            });
            console.log("mail send in searvice inquiry");
        } catch (mailError) {
            console.error("Service mail failed:", mailError);
        }

        // 3️⃣ Flash success message
        req.flash('success', 'Your service inquiry has been submitted successfully.');
        res.redirect('/?success=true');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
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

FrontendCoutroller.postContact = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, company, subject, message } = req.body;

        const newContact = await Contact.create({
            firstName,
            lastName,
            phone,
            email,
            company,
            subject,
            message
        });

        try {
            const html = await ejs.renderFile(
                path.join(__dirname, '../views/emails/contact-notification.ejs'),
                {
                    companyName: "Nirnaya Pharma",
                    firstName,
                    lastName,
                    email,
                    phone,
                    company,
                    subject,
                    message,
                    adminUrl: "https://yourdomain.com/admin/contacts"
                }
            );

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Contact Inquiry - ${subject}`,
                html
            });
            console.log("mail send");
        } catch (mailError) {
            console.error("Mail sending failed:", mailError);
        }

        // 3️⃣ Always redirect success
        req.flash('success', 'Thank you! Your message has been sent successfully.');
        res.redirect('/contact?success=true');

    } catch (error) {
        console.error('Error submitting contact form:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/contact');
    }
};
FrontendCoutroller.createContact = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, company, subject, message } = req.body;

        const newContact = await Contact.create({
            firstName,
            lastName,
            phone,
            email,
            company,
            subject,
            message
        });

        try {
            const html = await ejs.renderFile(
                path.join(__dirname, '../views/emails/contact-notification.ejs'),
                {
                    companyName: "Nirnaya Pharma",
                    firstName,
                    lastName,
                    email,
                    phone,
                    company,
                    subject,
                    message,
                    adminUrl: "https://yourdomain.com/admin/contacts"
                }
            );

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Contact Inquiry - ${subject}`,
                html
            });
            console.log("mail send");
        } catch (mailError) {
            console.error("Mail sending failed:", mailError);
        }

        // 3️⃣ Always redirect success
        res.status(200).json({ success: true, message: 'Contact inquiry submitted successfully' });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
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
        const settingsData = await Settings.find()
        const settingsMap = {};
        settingsData.forEach(item => {
            settingsMap[item.key] = item.value;
        });
        const services = await Service.find({ visible: true }).select('name slug');
        const service = await Service.findOne({ slug: slug, visible: true });
        if (!service) return res.render('frontend/404', { title: 'Page not found', layout: false });
        res.render('frontend/service-detail', {
            title: 'Service Details',
            layout: false,
            service, services,
            metaTitle: service.metaTitle || service.name,
            settings: settingsMap,
            metaDescription: service.metaDescription || "",
            metaKeywords: service.metaKeywords || []
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

FrontendCoutroller.postContactDetails = async (req, res) => {
    try {
        const slug = req.params.slug;

        const service = await Service.findOne({ slug: slug, visible: true });
        if (!service) {
            return res.render('frontend/404', { title: 'Page not found', layout: false });
        }

        const { phone, email } = req.body;

        // 1️⃣ Save in DB first
        const newContact = await Contact.create({
            firstName: service.name,   // storing service name
            lastName: "",
            phone,
            email,
            company: "",
            subject: "Service Inquiry",
            message: `Inquiry for service: ${service.name}`
        });

        // 2️⃣ Try sending mail (do not break flow if fails)
        try {

            const html = await ejs.renderFile(
                path.join(__dirname, '../views/emails/service-inquiry.ejs'),
                {
                    companyName: "Nirnaya Pharma",
                    serviceName: service.name,
                    email,
                    phone,
                    adminUrl: "https://yourdomain.com/admin/contacts"
                }
            );

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Service Inquiry - ${service.name}`,
                html
            });
            console.log("mail send in searvice inquiry");
        } catch (mailError) {
            console.error("Service mail failed:", mailError);
        }

        // 3️⃣ Flash success message
        req.flash('success', 'Your service inquiry has been submitted successfully.');
        res.redirect('/services/' + slug + '?success=true');

    } catch (error) {
        console.error('Error saving contact:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/services/' + req.params.slug);
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