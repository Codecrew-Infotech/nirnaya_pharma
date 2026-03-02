const express = require('express');
const route = express.Router();
const MediaController = require('../controller/FrontendCoutroller');
const HeaderModel = require('../api/model/Header');
const FooterModel = require('../api/model/Footer');
const Settings = require('../api/model/Settings');


route.use(async (req, res, next) => {
    try {
        const headerData = await HeaderModel.findOne({ visible: true });
        const footerData = await FooterModel.findOne({ visible: true });
        const settingsArr = await Settings.find({ deleted_at: null });
        const settings = {};
        settingsArr.forEach(item => {
            settings[item.key] = item.value;
        });

        res.locals.settings = settings;
        res.locals.settings = settings;
        res.locals.header = headerData;
        res.locals.footer = footerData;
    } catch (err) {
        console.log(err);
        res.locals.header = null;
    }

    next();
});


route.get('/', MediaController.getHome);
route.get('/about', MediaController.getAbout);
route.get('/blogs', MediaController.getBlog);
route.get('/career', MediaController.getCareer);
route.get('/contact', MediaController.getContact);
route.post('/contact', MediaController.postContact);
route.get('/how-it-work', MediaController.getWork);
route.get('/blog/:slug', MediaController.getPostDetails);
route.get('/category/:slug', MediaController.getCategoryPost);
route.get('/projects', MediaController.getProject);
route.get('/project-detail', MediaController.getProjectDetails);
route.get('/services', MediaController.getService);
route.get('/services/:slug', MediaController.getServiceDetails);
route.post('/services/:slug', MediaController.postContactDetails);
route.get('/teams', MediaController.getTeam);
route.get('/testimonials', MediaController.getTestimonial);
route.get('/xyz', (req, res, next) => {
    res.render('frontend/404', { title: 'Page not found', layout: false });
})

// router.post('/createContact', UserController.createContact);

module.exports = route;