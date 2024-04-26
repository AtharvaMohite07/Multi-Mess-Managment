import User from '../Models/User.js';
import SuperAdmin from '../Models/SuperAdmin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists in the regular user collection
    const foundUser = await User.findOne({ 'email': email }).exec();

    if (!foundUser) {
        // If not found in regular users, check in superadmin collection
        const foundSuperAdmin = await SuperAdmin.findOne({ 'email': email }).exec();

        if (!foundSuperAdmin) {
            return res.status(401).json({ message: 'User not available' });
        }
        //console.log(password)

        // For superadmin, compare password and generate tokens
        const matchPasswd = await bcrypt.compare(password, foundSuperAdmin.password);

        if (!matchPasswd) return res.status(401).json({ message: 'Unauthorized' });

        const userId = foundSuperAdmin.userId;
        const role = foundSuperAdmin.role;
        const name = foundSuperAdmin.name;

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "name": foundSuperAdmin.name,
                    "useremail": foundSuperAdmin.email,
                    "role": role
                }
            },
            process.env.AUTH_TOKEN,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { "useremail": foundSuperAdmin.email },
            process.env.AUTH_TOKEN,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ userId, name, email, role, accessToken });
    } else {
        // For regular users, continue with the existing logic
        const matchPasswd = await bcrypt.compare(password, foundUser.password);

        if (!matchPasswd) return res.status(401).json({ message: 'Unauthorized' });

        const userId = foundUser.userId;
        const messId = foundUser.messId;
        const role = foundUser.role;
        const name = foundUser.name;
        const mobileno = foundUser.mobileno;

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "name": foundUser.name,
                    "messId": foundUser.messId,
                    "useremail": foundUser.email,
                    "role": role,
                    "mobileno": mobileno
                }
            },
            process.env.AUTH_TOKEN,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { "useremail": foundUser.email },
            process.env.AUTH_TOKEN,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ userId, name, messId, email, mobileno, role, accessToken });
    }
});

// Add refresh and logout routes as before

export const refresh = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized : no cookie store' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.AUTH_TOKEN,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            const foundUser = await User.findOne({ "email": decoded.useremail }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized : no user found' })

            const userId = foundUser.userId
            const role = foundUser.role
            const messId = foundUser.messId
            const name = foundUser.name
            const email = foundUser.email
            const mobileno = foundUser.mobileno

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "useremail": email,
                        "messId": messId,
                        "role": role
                    }
                },
                process.env.AUTH_TOKEN,
                { expiresIn: '15m' }
            )

            res.json({userId , name ,messId, email,mobileno, role , accessToken })

        })
    )
}
export const refreshSuperAdmin = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized: no cookie stored' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.AUTH_TOKEN, asyncHandler(async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        const foundSuperAdmin = await SuperAdmin.findOne({ "email": decoded.useremail }).exec();

        if (!foundSuperAdmin) return res.status(401).json({ message: 'Unauthorized: no super admin found' });

        const userId = foundSuperAdmin.userId;
        const role = foundSuperAdmin.role;
        const name = foundSuperAdmin.name;
        const email = foundSuperAdmin.email;
        const mobileno = foundSuperAdmin.mobileno;

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "useremail": email,
                    "role": role
                }
            },
            process.env.AUTH_TOKEN,
            { expiresIn: '15m' }
        );

        res.json({ userId, name, email, mobileno, role, accessToken });
    }));
};

export const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Logout Successfully' })
}
