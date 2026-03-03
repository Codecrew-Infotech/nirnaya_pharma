const express = require('express');
const route = express.Router();
const pageController = require('../controller/pageController');
const BlogController = require('../controller/BlogController');
const SliderController = require('../controller/SliderController');
const FooterController = require('../controller/FooterController');
const MediaController = require('../controller/MediaController');
const HeaderController = require('../controller/HeaderController');
const UserController = require('../controller/UserController');
const RolePermissionController = require('../controller/RolePermissionController');
const ServiceController = require('../controller/ServiceController');
const SettingsController = require('../controller/SettingsController');
const AboutUsController = require('../controller/AboutUsController');

const { requireAuth, requireAuthAPI, redirectIfAuthenticated } = require('../middlewere/auth');
const checkPermission = require('../middlewere/checkPermission');



route.get('/', requireAuth, (req, res, next) => {
  res.render('index', { title: 'Index' });
})

// route.get('/auth-login', (req, res, next) => {
//   res.render('auth-login', {title: 'Auth Login', layout: 'partials/layout-auth'});
// })


route.get('/login', redirectIfAuthenticated, UserController.login);
route.post('/login', redirectIfAuthenticated, UserController.verifyLogin);
route.get('/logout', UserController.logout);

route.get('/pages',requireAuth, checkPermission('view_pages'), pageController.getPage);
route.get('/pages/add',requireAuth, checkPermission('create_pages'), pageController.addPage);
// route.get('/add-page', pageController.addPage);
route.post('/add-page',requireAuth, checkPermission('create_pages'), pageController.addpageData);
route.get('/set-page-section',requireAuth, checkPermission('edit_pages'), pageController.setPageSection);
route.get('/sections', requireAuth, checkPermission('view_pages'), pageController.addsection);
route.get('/add-page-section', requireAuth, checkPermission('create_pages'), pageController.addPagesection);
route.post('/add-page-section',requireAuth, checkPermission('create_pages'), pageController.createPagesection);
route.get('/edit-section/:id',requireAuth, checkPermission('edit_pages'), pageController.editSection);
route.post('/edit-section/:id',requireAuth, checkPermission('edit_pages'), pageController.updateSection);

route.get('/page-section',requireAuth, checkPermission('view_pages'), pageController.pageSection);

route.get('/add-section',requireAuth, checkPermission('view_pages'), pageController.addsection);
route.get('/add-page-section/:id',requireAuth, checkPermission('create_pages'), pageController.getAddPageSection);
route.post('/set-page-section',requireAuth, checkPermission('edit_pages'), pageController.setAddPageSection);
route.get('/add-new-page', requireAuth,checkPermission('create_pages'), pageController.newPageSection);
// blog routes
route.get('/blogs',requireAuth, checkPermission('view_blogs'), BlogController.getBlogs);
route.get('/blogs/:id', requireAuth,checkPermission('view_blogs'), BlogController.getBlogById);
route.get('/blog/add',requireAuth, checkPermission('create_blogs'), BlogController.addBlog);
route.post('/blog/add',requireAuth, checkPermission('create_blogs'), BlogController.createBlog);
route.get('/edit-blog/:id', requireAuth, checkPermission('edit_blogs'), BlogController.editBlog);
route.post('/edit-blog/:id', requireAuth, checkPermission('edit_blogs'), BlogController.updateBlog);

// Slider routes
route.get('/sliders',requireAuth,checkPermission('view_sliders'), SliderController.getSliders);
route.get('/sliders/:id', requireAuth,checkPermission('view_sliders'), SliderController.getSliderById);
route.get('/slider/add', requireAuth, checkPermission('create_sliders'), SliderController.addSlider);
route.post('/slider/add', requireAuth, checkPermission('create_sliders'), SliderController.createSlider);

// Service routes
// route.get('/service', SliderController.getSliders);
// route.get('/service/add', SliderController.addSlider);
// route.post('/service/add', SliderController.createSlider);
// route.get('/service/:id', SliderController.getSliderById);

// Define route for footer
route.get('/footer/add',requireAuth, checkPermission('create_footers'), FooterController.addFooter);
route.post('/footer/add', requireAuth, checkPermission('create_footers'), FooterController.createFooter);
route.get('/footers', requireAuth, checkPermission('view_footers'), FooterController.getFooter);
route.get('/edit-footer/:id', requireAuth, checkPermission('edit_footers'), FooterController.editFooter);
route.post('/edit-footer/:id', requireAuth, checkPermission('edit_footers'), FooterController.updateFooter);

// Define route for header
route.get('/header/add', requireAuth, checkPermission('create_headers'), HeaderController.addHeader);
route.post('/header/add', requireAuth, checkPermission('create_headers'), HeaderController.createHeader);
route.get('/headers', requireAuth, checkPermission('view_headers'), HeaderController.getHeader);
route.get('/edit-header/:id', requireAuth, checkPermission('edit_headers'), HeaderController.editHeader);
route.post('/edit-header/:id', requireAuth, checkPermission('edit_headers'), HeaderController.updateHeader);

route.get('/media',requireAuth, MediaController.getMedia);
route.get('/front', requireAuth,MediaController.getFront);



//  define routes for user
route.get('/users',requireAuth, checkPermission('view_users'), UserController.getUsers);
route.get('/user/add',requireAuth, checkPermission('create_users'), UserController.addUser);
route.post('/user/add',requireAuth, checkPermission('create_users'), UserController.createUser);
route.get('/edit-user/:id',requireAuth, checkPermission('edit_users'), UserController.editUser);
route.post('/edit-user/:id',requireAuth, checkPermission('edit_users'), UserController.updateUser);

// define routes for user roles
route.get('/roles',requireAuth, checkPermission('view_roles'), RolePermissionController.getRoles);
route.get('/role/add', requireAuth, checkPermission('create_roles'), RolePermissionController.addRole);
route.post('/role/add', requireAuth, checkPermission('create_roles'), RolePermissionController.createRole);
route.get('/edit-role/:id', requireAuth, checkPermission('edit_roles'), RolePermissionController.editRole);
route.post('/edit-role/:id', requireAuth, checkPermission('edit_roles'), RolePermissionController.updateRole);

// define routes for user permissions
route.get('/permissions', requireAuth, checkPermission('view_permissions'), RolePermissionController.getPermissions);
route.get('/permission/add', requireAuth, checkPermission('create_permissions'), RolePermissionController.addPermission);
route.post('/permission/add', requireAuth, checkPermission('create_permissions'), RolePermissionController.createPermission);
route.get('/edit-permission/:id', requireAuth, checkPermission('edit_permissions'), RolePermissionController.editPermission);
route.post('/edit-permission/:id', requireAuth, checkPermission('edit_permissions'), RolePermissionController.updatePermission);

route.get('/role-permission/:id', requireAuth, checkPermission('view_role_permissions'), RolePermissionController.getRolePermissions);
route.post('/role-permission/:id', requireAuth, checkPermission('create_role_permissions'), RolePermissionController.createRolePermission);

// define routes for services
route.get('/services', requireAuth, checkPermission('view_services'), ServiceController.getServices);
route.get('/services/add', requireAuth, checkPermission('create_services'), ServiceController.addService);
route.post('/services/add', requireAuth, checkPermission('create_services'), ServiceController.createService);
route.get('/services/:id', requireAuth, checkPermission('edit_services'), ServiceController.editServices);
route.post('/services/:id', requireAuth, checkPermission('edit_services'), ServiceController.updateServices);
route.get('/services/:id/delete', requireAuth, checkPermission('delete_services'), ServiceController.deleteServices);

// define routes for AboutUs
route.get('/aboutus', requireAuth, checkPermission('view_aboutus'), AboutUsController.getAboutUsPage);
route.get('/aboutus/add', requireAuth, checkPermission('create_aboutus'), AboutUsController.addAboutUs);
route.post('/aboutus/add', requireAuth, checkPermission('create_aboutus'), AboutUsController.createAboutUs);
route.get('/aboutus/:id', requireAuth, checkPermission('edit_aboutus'), AboutUsController.editAboutUs);
route.post('/aboutus/:id', requireAuth, checkPermission('edit_aboutus'), AboutUsController.updateAboutUs);
route.get('/aboutus/:id/delete', requireAuth, checkPermission('delete_aboutus'), AboutUsController.deleteAboutUs);


// define route for user contact messages
route.get('/contacts', requireAuth, checkPermission('view_contacts'), UserController.getContacts);
route.get('/contact/:id', requireAuth, checkPermission('view_contacts'), UserController.getContactById);
route.get('/deleteContact/:id', requireAuth, checkPermission('delete_contacts'), UserController.deleteContact);

// define routes for Settings

route.get('/settings', requireAuth, checkPermission('view_settings'), SettingsController.getSettings);
route.get('/setting/add', requireAuth, checkPermission('create_settings'), SettingsController.addSettings);
route.post('/setting/add', requireAuth, checkPermission('create_settings'), SettingsController.createSettings);
route.get('/setting/edit/:id', requireAuth, checkPermission('edit_settings'), SettingsController.editSettings);
route.post('/setting/edit/:id', requireAuth, checkPermission('edit_settings'), SettingsController.updateSettings);
route.get('/setting/delete/:id', requireAuth, checkPermission('delete_settings'), SettingsController.deleteSettings);


route.get('/403', requireAuth, (req, res) => {
    res.status(403).render('auth-500', {
        title: 'Forbidden',
        layout: 'partials/layout-vertical',

    });
});













route.get('/pages', (req, res, next) => {
  res.render('pages', { title: 'Pages', layout: 'partials/layout-vertical' });
})

route.get('/advanced-animation', (req, res, next) => {
  res.render('advanced-animation', { title: 'Advanced Animation', layout: 'partials/layout-vertical' });
})

route.get('/advanced-clipboard', (req, res, next) => {
  res.render('advanced-clipboard', { title: 'Advanced Clipboard' });
})

route.get('/advanced-dragula', (req, res, next) => {
  res.render('advanced-dragula', { title: 'Advanced Dragula' });
})

route.get('/advanced-files', (req, res, next) => {
  res.render('advanced-files', { title: 'Advanced Files' });
})

route.get('/advanced-highlight', (req, res, next) => {
  res.render('advanced-highlight', { title: 'Advanced Highlight' });
})

route.get('/advanced-rangeslider', (req, res, next) => {
  res.render('advanced-rangeslider', { title: 'Advanced Rangeslider' });
})

route.get('/advanced-ratings', (req, res, next) => {
  res.render('advanced-ratings', { title: 'Advanced Ratings' });
})

route.get('/advanced-ribbons', (req, res, next) => {
  res.render('advanced-ribbons', { title: 'Advanced Ribbons' });
})

route.get('/advanced-sweetalerts', (req, res, next) => {
  res.render('advanced-sweetalerts', { title: 'Advanced Sweetalerts' });
})

route.get('/advanced-toasts', (req, res, next) => {
  res.render('advanced-toasts', { title: 'Advanced Toasts' });
})

route.get('/analytics-customers', (req, res, next) => {
  res.render('analytics-customers', { title: 'Analytics Customers' });
})

route.get('/analytics-reports', (req, res, next) => {
  res.render('analytics-reports', { title: 'Analytics Reports' });
})

route.get('/apps-calendar', (req, res, next) => {
  res.render('apps-calendar', { title: 'Apps Calendar' });
})

route.get('/apps-chat', (req, res, next) => {
  res.render('apps-chat', { title: 'Apps Chat' });
})

route.get('/apps-contact-list', (req, res, next) => {
  res.render('apps-contact-list', { title: 'Apps Contact List' });
})

route.get('/apps-invoice', (req, res, next) => {
  res.render('apps-invoice', { title: 'Apps Invoice' });
})

route.get('/auth-404', (req, res, next) => {
  res.render('auth-404', { title: 'Auth 404', layout: 'partials/layout-auth' });
})

route.get('/auth-500', (req, res, next) => {
  res.render('auth-500', { title: 'Auth 500', layout: 'partials/layout-auth' });
})

route.get('/auth-lock-screen', (req, res, next) => {
  res.render('auth-lock-screen', { title: 'Auth Lock Screen', layout: 'partials/layout-auth' });
})


route.get('/auth-maintenance', (req, res, next) => {
  res.render('auth-maintenance', { title: 'Auth Maintenance', layout: 'partials/layout-auth' });
})

route.get('/auth-recover-pw', (req, res, next) => {
  res.render('auth-recover-pw', { title: 'Auth Recover Pw', layout: 'partials/layout-auth' });
})

route.get('/auth-register', (req, res, next) => {
  res.render('auth-register', { title: 'Auth Register', layout: 'partials/layout-auth' });
})

route.get('/charts-apex', (req, res, next) => {
  res.render('charts-apex', { title: 'Charts Apex' });
})

route.get('/charts-chartjs', (req, res, next) => {
  res.render('charts-chartjs', { title: 'Charts Chartjs' });
})

route.get('/charts-echarts', (req, res, next) => {
  res.render('charts-echarts', { title: 'Charts Echarts' });
})

route.get('/charts-justgage', (req, res, next) => {
  res.render('charts-justgage', { title: 'Charts Justgage' });
})

route.get('/charts-toast-ui', (req, res, next) => {
  res.render('charts-toast-ui', { title: 'Charts Toast Ui' });
})

route.get('/ecommerce-customer-details', (req, res, next) => {
  res.render('ecommerce-customer-details', { title: 'Ecommerce Customer Details' });
})

route.get('/ecommerce-customers', (req, res, next) => {
  res.render('ecommerce-customers', { title: 'Ecommerce Customers' });
})

route.get('/ecommerce-index', (req, res, next) => {
  res.render('ecommerce-index', { title: 'Ecommerce Index' });
})

route.get('/ecommerce-order-details', (req, res, next) => {
  res.render('ecommerce-order-details', { title: 'Ecommerce Order Details' });
})

route.get('/ecommerce-orders', (req, res, next) => {
  res.render('ecommerce-orders', { title: 'Ecommerce Orders' });
})

route.get('/ecommerce-products', (req, res, next) => {
  res.render('ecommerce-products', { title: 'Ecommerce Products' });
})

route.get('/ecommerce-refunds', (req, res, next) => {
  res.render('ecommerce-refunds', { title: 'Ecommerce Refunds' });
})

route.get('/email-templates-alert', (req, res, next) => {
  res.render('email-templates-alert', { title: 'Email Templates Alert' });
})

route.get('/email-templates-basic', (req, res, next) => {
  res.render('email-templates-basic', { title: 'Email Templates Basic' });
})

route.get('/email-templates-billing', (req, res, next) => {
  res.render('email-templates-billing', { title: 'Email Templates Billing' });
})

route.get('/forms-advanced', (req, res, next) => {
  res.render('forms-advanced', { title: 'Forms Advanced' });
})

route.get('/forms-editors', (req, res, next) => {
  res.render('forms-editors', { title: 'Forms Editors' });
})

route.get('/forms-elements', (req, res, next) => {
  res.render('forms-elements', { title: 'Forms Elements' });
})

route.get('/forms-img-crop', (req, res, next) => {
  res.render('forms-img-crop', { title: 'Forms Img Crop' });
})

route.get('/forms-uploads', (req, res, next) => {
  res.render('forms-uploads', { title: 'Forms Uploads' });
})

route.get('/forms-validation', (req, res, next) => {
  res.render('forms-validation', { title: 'Forms Validation' });
})

route.get('/forms-wizard', (req, res, next) => {
  res.render('forms-wizard', { title: 'Forms Wizard' });
})

route.get('/icons-fontawesome', (req, res, next) => {
  res.render('icons-fontawesome', { title: 'Icons Fontawesome' });
})

route.get('/icons-icofont', (req, res, next) => {
  res.render('icons-icofont', { title: 'Icons Icofont' });
})

route.get('/icons-iconoir', (req, res, next) => {
  res.render('icons-iconoir', { title: 'Icons Iconoir' });
})

route.get('/icons-lineawesome', (req, res, next) => {
  res.render('icons-lineawesome', { title: 'Icons Lineawesome' });
})



route.get('/index', (req, res, next) => {
  res.render('index', { title: 'Index' });
})

route.get('/maps-google', (req, res, next) => {
  res.render('maps-google', { title: 'Maps Google' });
})

route.get('/maps-leaflet', (req, res, next) => {
  res.render('maps-leaflet', { title: 'Maps Leaflet' });
})

route.get('/maps-vector', (req, res, next) => {
  res.render('maps-vector', { title: 'Maps Vector' });
})

route.get('/pages-blogs', (req, res, next) => {
  res.render('pages-blogs', { title: 'Pages Blogs' });
})

route.get('/pages-faq', (req, res, next) => {
  res.render('pages-faq', { title: 'Pages Faq' });
})

route.get('/pages-gallery', (req, res, next) => {
  res.render('pages-gallery', { title: 'Pages Gallery' });
})

route.get('/pages-notifications', (req, res, next) => {
  res.render('pages-notifications', { title: 'Pages Notifications' });
})

route.get('/pages-pricing', (req, res, next) => {
  res.render('pages-pricing', { title: 'Pages Pricing' });
})

route.get('/pages-profile', (req, res, next) => {
  res.render('pages-profile', { title: 'Pages Profile' });
})

route.get('/pages-starter', (req, res, next) => {
  res.render('pages-starter', { title: 'Pages Starter' });
})

route.get('/pages-timeline', (req, res, next) => {
  res.render('pages-timeline', { title: 'Pages Timeline' });
})

route.get('/pages-treeview', (req, res, next) => {
  res.render('pages-treeview', { title: 'Pages Treeview' });
})

route.get('/projects-clients', (req, res, next) => {
  res.render('projects-clients', { title: 'Projects Clients' });
})

route.get('/projects-create', (req, res, next) => {
  res.render('projects-create', { title: 'Projects Create' });
})

route.get('/projects-kanban-board', (req, res, next) => {
  res.render('projects-kanban-board', { title: 'Projects Kanban Board' });
})

route.get('/projects-project', (req, res, next) => {
  res.render('projects-project', { title: 'Projects Project' });
})

route.get('/projects-task', (req, res, next) => {
  res.render('projects-task', { title: 'Projects Task' });
})

route.get('/projects-team', (req, res, next) => {
  res.render('projects-team', { title: 'Projects Team' });
})

route.get('/projects-users', (req, res, next) => {
  res.render('projects-users', { title: 'Projects Users' });
})

route.get('/tables-basic', (req, res, next) => {
  res.render('tables-basic', { title: 'Tables Basic' });
})

route.get('/tables-datatable', (req, res, next) => {
  res.render('tables-datatable', { title: 'Tables Datatable' });
})

route.get('/tables-editable', (req, res, next) => {
  res.render('tables-editable', { title: 'Tables Editable' });
})

route.get('/ui-alerts', (req, res, next) => {
  res.render('ui-alerts', { title: 'Ui Alerts' });
})

route.get('/ui-avatar', (req, res, next) => {
  res.render('ui-avatar', { title: 'Ui Avatar' });
})

route.get('/ui-badges', (req, res, next) => {
  res.render('ui-badges', { title: 'Ui Badges' });
})

route.get('/ui-buttons', (req, res, next) => {
  res.render('ui-buttons', { title: 'Ui Buttons' });
})

route.get('/ui-cards', (req, res, next) => {
  res.render('ui-cards', { title: 'Ui Cards' });
})

route.get('/ui-carousels', (req, res, next) => {
  res.render('ui-carousels', { title: 'Ui Carousels' });
})

route.get('/ui-dropdowns', (req, res, next) => {
  res.render('ui-dropdowns', { title: 'Ui Dropdowns' });
})

route.get('/ui-grids', (req, res, next) => {
  res.render('ui-grids', { title: 'Ui Grids' });
})

route.get('/ui-images', (req, res, next) => {
  res.render('ui-images', { title: 'Ui Images' });
})

route.get('/ui-list', (req, res, next) => {
  res.render('ui-list', { title: 'Ui List' });
})

route.get('/ui-modals', (req, res, next) => {
  res.render('ui-modals', { title: 'Ui Modals' });
})

route.get('/ui-navbar', (req, res, next) => {
  res.render('ui-navbar', { title: 'Ui Navbar' });
})

route.get('/ui-navs', (req, res, next) => {
  res.render('ui-navs', { title: 'Ui Navs' });
})

route.get('/ui-paginations', (req, res, next) => {
  res.render('ui-paginations', { title: 'Ui Paginations' });
})

route.get('/ui-popover-tooltips', (req, res, next) => {
  res.render('ui-popover-tooltips', { title: 'Ui Popover Tooltips' });
})

route.get('/ui-progress', (req, res, next) => {
  res.render('ui-progress', { title: 'Ui Progress' });
})

route.get('/ui-spinners', (req, res, next) => {
  res.render('ui-spinners', { title: 'Ui Spinners' });
})

route.get('/ui-tabs-accordions', (req, res, next) => {
  res.render('ui-tabs-accordions', { title: 'Ui Tabs Accordions' });
})

route.get('/ui-typography', (req, res, next) => {
  res.render('ui-typography', { title: 'Ui Typography' });
})

route.get('/ui-videos', (req, res, next) => {
  res.render('ui-videos', { title: 'Ui Videos' });
})

route.get('/teachers', (req, res, next) => {
  res.render('ui-widgets', { title: 'Ui Widgets' });
})

module.exports = route;