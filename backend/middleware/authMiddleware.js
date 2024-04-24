// import asyncHandler from 'express-async-handler';
// import SuperAdmin from '../Models/SuperAdmin.js';
//
// export const requireSuperAdmin = asyncHandler(async (req, res, next) => {
//     const useremail = req?.user?.UserInfo?.useremail; // Assuming the user's email is stored in req.user.UserInfo.useremail
//
//     // Check if the user is a super admin
//     const foundSuperAdmin = await SuperAdmin.findOne({ "email": useremail }).exec();
//     if (!foundSuperAdmin || !foundSuperAdmin.isSuperAdmin) {
//         return res.status(403).json({ message: 'Unauthorized: Superadmin access required' });
//     }
//
//     // If the user is a super admin, continue to the next middleware/route handler
//     next();
// });