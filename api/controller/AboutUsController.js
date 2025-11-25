const AboutUs = require('../model/AboutUs');

const AboutUsController = {};

// Get all AboutUs (typically just one)
AboutUsController.getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.find();
        res.status(200).json(aboutUs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching AboutUs data', error });
    }
};

// Get AboutUs by ID
AboutUsController.getAboutUsById = async (req, res) => {
    try {
        const aboutUsId = req.params.id;
        const aboutUs = await AboutUs.findById(aboutUsId);
        if (!aboutUs) {
            return res.status(404).json({ message: 'AboutUs not found' });
        }
        res.status(200).json(aboutUs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching AboutUs', error });
    }
};

// Create AboutUs
AboutUsController.createAboutUs = async (req, res) => {
    try {
        const { ownerDetail, sections, visible, image } = req.body;

        const newAboutUs = new AboutUs({
            ownerDetail: {
                image: image,
                content: ownerDetail?.content,
                name: ownerDetail?.name,
                educationInfo: ownerDetail?.educationInfo
            },
            sections: sections || [],
            visible: visible !== undefined ? visible : true
        });

        await newAboutUs.save();
        res.status(201).json(newAboutUs);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Error creating AboutUs', error });
    }
};

// Update AboutUs
AboutUsController.updateAboutUs = async (req, res) => {
    try {
        const aboutUsId = req.params.id;
        const { ownerDetail, sections, visible, image } = req.body;

        let updatedData = {
            ownerDetail: {
                content: ownerDetail?.content,
                name: ownerDetail?.name,
                educationInfo: ownerDetail?.educationInfo
            },
            sections: sections || [],
            visible: visible !== undefined ? visible : true
        };

        if(image) updatedData.ownerDetail.image = image

        const updatedAboutUs = await AboutUs.findByIdAndUpdate(aboutUsId, updatedData, { new: true });
        if (!updatedAboutUs) {
            return res.status(404).json({ message: 'AboutUs not found' });
        }
        res.status(200).json(updatedAboutUs);
    } catch (error) {
        res.status(500).json({ message: 'Error updating AboutUs', error });
    }
};

// Delete AboutUs
AboutUsController.deleteAboutUs = async (req, res) => {
    try {
        const aboutUsId = req.params.id;
        const deletedAboutUs = await AboutUs.findByIdAndDelete(aboutUsId);
        if (!deletedAboutUs) {
            return res.status(404).json({ message: 'AboutUs not found' });
        }
        res.status(200).json({ message: 'AboutUs deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting AboutUs', error });
    }
};

module.exports = AboutUsController;
