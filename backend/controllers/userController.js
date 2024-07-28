import { LOGGER } from '../utils/logger.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import { sendToken } from '../utils/jwtToken.js';

LOGGER.DEBUG('starting ./controllers/userController.js');

export const register = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - register()');
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
        return next(new ErrorHandler('Please fill all the fields for registration!', 400));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler('Email already exists!', 400));
    }
    const user = await User.create({
        name,
        email,
        phone,
        password,
        role
    });
    sendToken(user, 201, res, 'User Registered!');
});
LOGGER.DEBUG('exporting register');

export const login = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - login()');
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler('Please provide email, password and role.', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 400));
    }
    if (user.role !== role) {
        return next(new ErrorHandler('User with this role not found!', 400));
    }
    sendToken(user, 200, res, 'User logged in Successfully!');
});
LOGGER.DEBUG('exporting login');

export const getUser = catchAsyncError(function (req, res, next) {
    LOGGER.DEBUG('using - getUser()');
    const user = req.user;
    if (!user) {
        return next(new ErrorHandler('User not found!', 404));
    }
    LOGGER.INFO('User found!');
    res.status(200).json({
        success: true,
        message: 'User found!',
        user
    });
});
LOGGER.DEBUG('exporting getUser');

export const logout = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - logout()');
    LOGGER.INFO('User logged out successfully!');
    res.status(200)
        .cookie('token', '', {
            httpOnly: true,
            expires: new Date(Date.now())
        })
        .json({
            success: true,
            message: 'User logged out successfully!'
        });
});
LOGGER.DEBUG('exporting logout');
