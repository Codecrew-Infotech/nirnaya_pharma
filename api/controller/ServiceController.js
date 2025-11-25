const Service = require('../model/Service');

const ServiceController = {}

// Get all services
ServiceController.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error });
    }
}

// Create a new service
ServiceController.createService = async (req, res) => {
    try {
        // Handle file upload (if using multipart/form-data)
        let imageName = req.body.image || null;

        const { name, slug, content, description, visible, metaTitle, metaDescription, metaKeywords, canonicalUrl, publishDate } = req.body;

        // metaKeywords may be sent as comma-separated string or as array
        let keywords = [];
        if (Array.isArray(metaKeywords)) keywords = metaKeywords;
        else if (typeof metaKeywords === 'string' && metaKeywords.trim()) keywords = metaKeywords.split(',').map(k => k.trim()).filter(Boolean);

        const newService = new Service({
            name,
            slug,
            description,
            content,
            visible,
            image: imageName,
            metaTitle,
            metaDescription,
            metaKeywords: keywords,
            canonicalUrl,
            publishDate: publishDate ? new Date(publishDate) : undefined
        });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Error creating service', error });
    }
}

// Edit a service (get by id)
ServiceController.editService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service', error });
    }
}

// Update a service
ServiceController.updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        // Handle file upload if present
        let imageName = req.body.image || null;

        const { name, slug, description, content, visible, metaTitle, metaDescription, metaKeywords, canonicalUrl, publishDate } = req.body;

        let keywords = [];
        if (Array.isArray(metaKeywords)) keywords = metaKeywords;
        else if (typeof metaKeywords === 'string' && metaKeywords.trim()) keywords = metaKeywords.split(',').map(k => k.trim()).filter(Boolean);

        let updatedData = { name, slug, content, description, visible, metaTitle, metaDescription, metaKeywords: keywords, canonicalUrl };
        if (imageName) updatedData.image = imageName;
        if (publishDate) updatedData.publishDate = new Date(publishDate);

        const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error });
    }
};

// Delete a service
ServiceController.deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
}

module.exports = ServiceController;
