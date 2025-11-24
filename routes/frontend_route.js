const express = require('express');
const route = express.Router();
const MediaController = require('../controller/FrontendCoutroller');
const HeaderModel = require('../api/model/Header');


route.use(async (req, res, next) => {
    try {
        const headerData = await HeaderModel.find();
        // console.log(headerData,"headerData")
        res.locals.header = headerData;
    } catch (err) {
        console.log(err);
        res.locals.header = null;
    }

    next();
});


route.get('/', MediaController.getHome);
route.get('/about', MediaController.getAbout);
route.get('/blog', MediaController.getBlog);
route.get('/career', MediaController.getCareer);
route.get('/contact', MediaController.getContact);
route.get('/how-it-work', MediaController.getWork);
route.get('/post', MediaController.getPost);
route.get('/projects', MediaController.getProject);
route.get('/project-detail', MediaController.getProjectDetails);
route.get('/services', MediaController.getService);
route.get('/service-detail', MediaController.getServiceDetails);
route.get('/teams', MediaController.getTeam);
route.get('/testimonials', MediaController.getTestimonial);


module.exports = route;