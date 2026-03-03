function checkPermission(permission) {
    return (req, res, next) => {

        if (!req.permissions) {
            return res.redirect('/admin/403');
        }

        // Super admin (if using wildcard)
        if (req.permissions.includes('*')) {
            return next();
        }

        if (req.permissions.includes(permission)) {
            return next();
        }

        return res.redirect('/admin/403');
    };
}

module.exports = checkPermission;