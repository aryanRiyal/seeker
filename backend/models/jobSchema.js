import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide Job title.'],
        minLength: [3, 'Title must contain at least 3 characters!'],
        maxLength: [30, 'Title must contain at most 30 characters!']
    },
    description: {
        type: String,
        required: [true, 'Please provide Job Description.'],
        minLength: [30, 'Description must contain at least 30 characters!'],
        maxLength: [500, 'Description must contain at most 500 characters!']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category.']
    },
    country: {
        type: String,
        required: [true, 'Please provide a country name.']
    },
    city: {
        type: String,
        required: [true, 'Please provide a city name.']
    },
    location: {
        type: String,
        required: [true, 'Please provide a location!'],
        minLength: [20, 'Location must contain at least 20 characters.']
    },
    fixedSalary: {
        type: Number,
        minLength: [4, 'Salary must contain at least 4 digits!'],
        maxLength: [9, 'Salary must contain at most 9 digits!']
    },
    salaryFrom: {
        type: Number,
        minLength: [4, 'Salary must contain at least 4 digits!'],
        maxLength: [9, 'Salary must contain at most 9 digits!']
    },
    salaryTo: {
        type: Number,
        minLength: [4, 'Salary must contain at least 4 digits!'],
        maxLength: [9, 'Salary must contain at most 9 digits!']
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Job = mongoose.model('Job', jobSchema);
