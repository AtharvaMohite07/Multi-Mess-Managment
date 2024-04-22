
import asyncHandler from 'express-async-handler';
export async function requireSuperAdmin(req, res, next) {

    if (!req.session || !req.session.user || !req.session.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Unauthorized: Superadmin access required' });
    }
    next();
};