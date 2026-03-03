const express = require('express');
const route = express.Router();
const FrontendCoutroller = require('../controller/FrontendCoutroller');
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


route.get('/', FrontendCoutroller.getHome);
route.get('/about', FrontendCoutroller.getAbout);
route.post('/about', FrontendCoutroller.postFormData);
route.post('/callback', FrontendCoutroller.postCallback);
route.get('/blogs', FrontendCoutroller.getBlog);
route.get('/career', FrontendCoutroller.getCareer);
route.get('/contact', FrontendCoutroller.getContact);
route.post('/contact', FrontendCoutroller.postContact);
route.post('/createContact', FrontendCoutroller.createContact);
route.get('/how-it-work', FrontendCoutroller.getWork);
route.get('/blog/:slug', FrontendCoutroller.getPostDetails);
route.get('/category/:slug', FrontendCoutroller.getCategoryPost);
route.get('/projects', FrontendCoutroller.getProject);
route.get('/project-detail', FrontendCoutroller.getProjectDetails);
route.get('/services', FrontendCoutroller.getService);
route.get('/services/:slug', FrontendCoutroller.getServiceDetails);
route.post('/services/:slug', FrontendCoutroller.postContactDetails);
route.get('/teams', FrontendCoutroller.getTeam);
route.get('/testimonials', FrontendCoutroller.getTestimonial);
route.get('/xyz', (req, res, next) => {
    res.render('frontend/404', { title: 'Page not found', layout: false });
})

// router.post('/createContact', UserController.createContact);

module.exports = route;