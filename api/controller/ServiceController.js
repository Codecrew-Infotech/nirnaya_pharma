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
        const { name, content, description, visible, image } = req.body;
        const newService = new Service({
            name,
            description,
            content,
            visible,
            image
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

        const { title, content, visible, image } = req.body;
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { title, content, image, visible },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Error updating service', error });
    }
}

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
