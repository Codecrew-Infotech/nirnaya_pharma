const axios = require('axios');
const ServiceController = {}

ServiceController.getServices = async (req, res) => {
    try {
        const services = await axios.get(`${process.env.API_URL}/api/services`);
        res.render('services', { services: services.data, title: 'Services', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

ServiceController.addService = async (req, res) => {
    res.render('add-service', { title: 'Add Service', layout: 'partials/layout-vertical' });
}
ServiceController.createService = async (req, res) => {
    try {
        const { name, content, description, visible } = req.body;
        const imageFile = req.files?.image || null;
        
        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }
        
        const newService = await axios.post(`${process.env.API_URL}/api/services/add`, {
            name,
            content,
            description,
            visible,
            image: imageFile ? imageFile.name : null
        });
        console.log("Created service:", newService.data);
        res.redirect('/admin/services');
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

ServiceController.addService = async (req, res) => {
    res.render('add-service', { title: 'Add Service', layout: 'partials/layout-vertical' });
}

ServiceController.editServices = async (req, res) => {
    try {
        const service = await axios.get(`${process.env.API_URL}/api/services/${req.params.id}`);
        res.render('edit-service', { service: service.data, title: 'Edit Services', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

ServiceController.updateServices = async (req, res) => {
    try {
        const { name, content, description, visible } = req.body;
        const imageFile = req.files?.image || null;
        
        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }
        
        const newService = await axios.post(`${process.env.API_URL}/api/services/${req.params.id}`, {
            name,
            content,
            description,
            visible,
            image: imageFile ? imageFile.name : null
        });
        console.log("Created service:", newService.data);
        res.redirect('/admin/services');
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = ServiceController;