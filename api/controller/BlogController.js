const Blog = require('../model/Blog');
const Category = require('../model/Category');
const User = require('../model/User');
const fs = require('fs');
const path = require('path');

const BlogController = {}

// Get all blogs
BlogController.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error });
    }
}
// Create a new blog
BlogController.createBlog = async (req, res) => {
    try {
        const { title, slug, isPublished, content, categories, metaTitle, metaDescription, metaKeywords, canonicalUrl, featuredImage } = req.body;
        const newBlog = new Blog({
            title, slug, isPublished, content, categories, metaTitle, metaDescription, metaKeywords, canonicalUrl, featuredImage
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Error creating blog', error });
    }
}

// Edit a blog
BlogController.editBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error });
    }
}
// Update a blog

BlogController.updateBlog = async (req, res) => {
    console.log("========== UPDATE BLOG START ==========");
    console.log("req.body:", req.body);
    console.log("req.body.removeImage:", req.body.removeImage);
    console.log("req.body.oldImage:", req.body.oldImage);
    console.log("req.body.featuredImage:", req.body.featuredImage);
    console.log("=======================================");

    try {
        const blogId = req.params.id;

        // 1. Get existing blog
        const currentBlog = await Blog.findById(blogId);
        if (!currentBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        console.log("Current blog featuredImage:", currentBlog.featuredImage);

        // 2. Default: keep old image
        let featuredImage = currentBlog.featuredImage;

        const removeImage =
            req.body.removeImage === 'true' || req.body.removeImage === true;

        console.log("removeImage flag:", removeImage);

        // =========================
        // 3. HANDLE IMAGE REMOVAL
        // =========================
        if (removeImage) {
            console.log("CASE: Image removal requested");
            if (currentBlog.featuredImage) {
                const oldImagePath = path.join(
                    __dirname,
                    '../../uploads',
                    currentBlog.featuredImage
                );

                console.log("Attempting to delete:", oldImagePath);

                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("✓ Old image deleted from disk");
                    } catch (err) {
                        console.error("✗ Error deleting old image:", err);
                    }
                } else {
                    console.log("✗ Old image file not found at:", oldImagePath);
                }
            }

            featuredImage = null; // ✅ IMPORTANT
            console.log("featuredImage set to null");
        }

        // =========================
        // 4. HANDLE NEW IMAGE UPLOAD (from FormData)
        // =========================
        else if (req.files?.featuredImage) {
            console.log("CASE: New image file uploaded from FormData");
            
            const imageFile = req.files.featuredImage;
            const uploadDir = path.join(__dirname, '../../uploads');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log("Created upload directory:", uploadDir);
            }
            
            // Generate unique filename
            const ext = path.extname(imageFile.name);
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
            const uploadPath = path.join(uploadDir, uniqueName);
            
            try {
                // Save new file
                await imageFile.mv(uploadPath);
                console.log("✓ New image saved:", uniqueName);
                
                // Delete old image if exists
                if (currentBlog.featuredImage) {
                    const oldImagePath = path.join(uploadDir, currentBlog.featuredImage);
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                            console.log("✓ Old image deleted");
                        } catch (err) {
                            console.error("✗ Error deleting old image:", err);
                        }
                    }
                }
                
                featuredImage = uniqueName;
                console.log("featuredImage set to:", uniqueName);
            } catch (err) {
                console.error("✗ Error uploading new image:", err);
                throw new Error("Failed to upload image");
            }
        }

        // =========================
        // 5. HANDLE MULTER FILE UPLOAD
        // =========================
        else if (req.file) {
            console.log("CASE: New image file uploaded via multer");
            // multer case (BEST PRACTICE)
            if (currentBlog.featuredImage) {
                const oldImagePath = path.join(
                    __dirname,
                    '../../uploads',
                    currentBlog.featuredImage
                );

                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("Old image replaced");
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
            }

            featuredImage = req.file.filename;
        }

        // =========================
        // 6. HANDLE STRING IMAGE (fallback)
        // =========================
        else if (req.body.featuredImage && req.body.featuredImage !== currentBlog.featuredImage && req.body.featuredImage !== '') {
            console.log("CASE: String image reference (existing image path)");
            if (currentBlog.featuredImage && req.body.oldImage && req.body.oldImage !== req.body.featuredImage) {
                const oldImagePath = path.join(
                    __dirname,
                    '../../uploads',
                    req.body.oldImage
                );

                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("Old image replaced with new one");
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
            }


            featuredImage = req.body.featuredImage;
            console.log("New image set:", featuredImage);
        }
        
        // =========================
        // 5b. HANDLE NULL IMAGE FROM FRONTEND
        // =========================
        else if (req.body.featuredImage === null || req.body.featuredImage === '') {
            console.log("Frontend sent null/empty image. removeImage flag:", removeImage);
            if (removeImage && currentBlog.featuredImage) {
                // Frontend already tried to delete, but ensure null is set
                featuredImage = null;
                console.log("Setting image to null (removal confirmed)");
            }
        }

        // =========================
        // 6. UPDATE BLOG DATA
        // =========================
        const {
            title,
            content,
            metaTitle,
            metaDescription,
            metaKeywords,
            slug,
            isPublished,
            categories
        } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                content,
                featuredImage,
                metaTitle,
                metaDescription,
                metaKeywords,
                slug,
                isPublished,
                categories
            },
            { new: true }
        );

        return res.status(200).json(updatedBlog);

    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            message: "Error updating blog",
            error: error.message
        });
    }
};

// Delete a blog
BlogController.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error });
    }
}

module.exports = BlogController;
