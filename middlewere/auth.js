const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const axios = require('axios');
const User = require('../api/model/User');
const RolePermission = require('../api/model/RolePermission');
const Permission = require('../api/model/Permission');
dotenv.config({ path: "./config.env" });
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function requireAuth(req, res, next) {
    let token;
    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (!token) {
      console.log(token, "No token found in request");
        return res.redirect('/admin/login');
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err, "Token verification failed");
            return res.redirect('/admin/login');
        }
        req.user = decoded;
        axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

        // Fetch permissions
        try {
            const user = await User.findById(decoded.id).populate("role_id");
            if (user && user.role_id) {
                const rolePerm = await RolePermission.findOne({ role_id: user.role_id._id });
                if (rolePerm) {
                    const permissions = await Permission.find({
                        _id: { $in: rolePerm.permission_id },
                    });
                    req.permissions = permissions.map((p) => p.name);
                    res.locals.permissions = req.permissions;
                } else {
                    req.permissions = [];
                    res.locals.permissions = [];
                }
            } else {
                req.permissions = [];
                res.locals.permissions = [];
            }
        } catch (permErr) {
            console.error("Error fetching permissions:", permErr);
            req.permissions = [];
            res.locals.permissions = [];
        }

        next();
    });
}

function requireAuthAPI(req, res, next) {
    let token;

    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
}

function redirectIfAuthenticated(req, res, next) {
    let token;

    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                return res.redirect('/admin');
            }
            next();
        });
    } else {
        next();
    }
}

module.exports = {
    requireAuth,        
    requireAuthAPI,       
    redirectIfAuthenticated  
};