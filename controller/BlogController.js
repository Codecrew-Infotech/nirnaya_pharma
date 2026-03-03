const axios = require('axios');
const blogController = {}

const path = require('path');
const fs = require('fs');

blogController.getBlogs = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/blogs`);
        res.render('blogs', { title: 'Blogs', layout: 'partials/layout-vertical', blogs: response.data });
    } catch (error) {
        next(error);
    }
}

blogController.getBlogById = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const response = await axios.get(`${process.env.API_URL}/api/editBlog/${blogId}`);
        if (!response.data) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.render('blog-details', { title: 'Blog Details', layout: 'partials/layout-vertical', blog: response.data });
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
blogController.addBlog = async (req, res, next) => {
    try {
        const categories = await axios.get(`${process.env.API_URL}/api/blogCategories`);
        res.render('add-blog', { title: 'Add Blog', layout: 'partials/layout-vertical', categories: categories.data });
    } catch (error) {
        next(error);
    }
}

blogController.createBlog = async (req, res, next) => {
    try {
        const image = req.files?.featuredImage || null;
        let finalImageName = null;

        if (image) {

            const ext = path.extname(image.name);
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

            const uploadDir = path.join(__dirname, '../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = path.join(uploadDir, uniqueName);

            await image.mv(uploadPath);

            finalImageName = uniqueName;
        }

        const {
            title,
            slug,
            isPublished,
            content,
            categories,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
        } = req.body;

        await axios.post(`${process.env.API_URL}/api/createBlog`, {
            title,
            slug,
            isPublished,
            content,
            categories,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            featuredImage: finalImageName
        });

        res.redirect('/admin/blogs');

    } catch (error) {
        console.error('Error creating blog:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};

blogController.editBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const response = await axios.get(`${process.env.API_URL}/api/editBlog/${blogId}`);
        if (!response.data) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.render('edit-blog', { title: 'Edit Blog', layout: 'partials/layout-vertical', blog: response.data });
    } catch (error) {
        console.error('Error fetching blog for edit:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

blogController.updateBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        const image = req.files?.featuredImage || null;
        const uploadDir = path.join(__dirname, '../uploads/blog');

        let finalImageName = req.body.oldImage || null;

        if (image) {

            const ext = path.extname(image.name);
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = path.join(uploadDir, uniqueName);

            await image.mv(uploadPath);

            // 🔥 Delete old image
            if (req.body.oldImage) {
                const oldPath = path.join(uploadDir, req.body.oldImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            finalImageName = uniqueName;
        }

        const {
            title,
            slug,
            isPublished,
            content,
            categories,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl
        } = req.body;

        await axios.put(
            `${process.env.API_URL}/api/blogs/${blogId}`,
            {
                title,
                slug,
                isPublished,
                content,
                categories,
                metaTitle,
                metaDescription,
                metaKeywords,
                canonicalUrl,
                featuredImage: finalImageName
            }
        );

        res.redirect('/admin/blogs');

    } catch (error) {
        console.error('Error updating blog:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};


module.exports = blogController;