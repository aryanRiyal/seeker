import { LOGGER } from '../utils/logger.js';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

LOGGER.DEBUG('starting ./models/userSchema.js');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        minLength: [3, 'Name must contain at least 3 characters!'],
        maxLength: [30, 'Name cannot exceed 30 characters!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email.'],
        validate: [validator.isEmail, 'Please provide a valid Email!']
    },
    phone: {
        type: Number,
        required: [true, 'Please provide your Phone Number.']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password.'],
        minLength: [8, 'Password must contain at least 8 characters!'],
        maxLength: [32, 'Password cannot exceed 32 characters!'],
        select: false
    },
    role: {
        type: String,
        required: [true, 'Please provide your Role.'],
        enum: ['Job Seeker', 'Employer']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hashing the Password
userSchema.pre('save', async function (next) {
    LOGGER.DEBUG('using - bcrypt.hash()');
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    LOGGER.DEBUG('using - bcrypt.compare()');
    // LOGGER.INFO(`using - bcrypt.compare(${enteredPassword}, ${this.password})`);
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT Token for Authorization
userSchema.methods.getJWTToken = function () {
    LOGGER.DEBUG('using - getJWTToken()');
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

export const User = mongoose.model('User', userSchema);
LOGGER.DEBUG("exporting userSchema as 'User' model");
