import { LOGGER } from '../utils/logger.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Application } from '../models/applicationSchema.js';
import { Job } from '../models/jobSchema.js';
import cloudinary from 'cloudinary';

LOGGER.DEBUG('starting ./controllers/applicationController.js');

export const postApplication = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - postApplication()');
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Resume file not Found!', 400));
    }
    const { resume } = req.files;
    const allowedFormats = ['image/png', 'image/jpg', 'image/webp'];
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler(
                'Invalid file type. Please upload your resume in a PNG, JPG or WEBP Format!',
                400
            )
        );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        cloudinary.error(
            'Cloudinary Error:',
            cloudinaryResponse.error || 'Unknown cloudinary Error'
        );
        return next(new ErrorHandler('Failed to upload Resume.', 500));
    }
    const { name, email, coverLetter, phone, address, jobID } = req.body;
    const applicantID = {
        user: req.user._id,
        role: 'Job Seeker'
    };
    if (!jobID) {
        return next(new ErrorHandler('Job not found!', 404));
    }
    const jobDetails = await Job.findById(jobID);
    if (!jobDetails) {
        return next(new ErrorHandler('Job not found!', 404));
    }
    const employerID = {
        user: jobDetails.postedBy,
        role: 'Employer'
    };
    if (
        !name ||
        !email ||
        !coverLetter ||
        !phone ||
        !address ||
        !applicantID ||
        !employerID ||
        !resume
    ) {
        return next(new ErrorHandler('Please provide all the required application details!', 400));
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });
    LOGGER.INFO('Application Submitted!');
    res.status(200).json({
        success: true,
        message: 'Application Submitted!',
        application
    });
});
LOGGER.DEBUG('exporting postApplication');

export const jobSeekerGetAllApplications = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - jobSeekerGetAllApplications()');
    const { _id } = req.user;
    const applications = await Application.find({ 'applicantID.user': _id });
    res.status(200).json({
        success: true,
        applications
    });
});
LOGGER.DEBUG('exporting jobSeekerGetAllApplications');

export const employerGetAllApplications = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - employerGetAllApplications()');
    const { _id } = req.user;
    const applications = await Application.find({ 'employerID.user': _id });
    res.status(200).json({
        success: true,
        applications
    });
});
LOGGER.DEBUG('exporting employerGetAllApplications');

export const jobSeekerDeleteApplication = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - jobSeekerDeleteApplication()');
    const { id } = req.params;
    const deletedApplication = await Application.findByIdAndDelete(id);
    if (!deletedApplication) {
        return next(new ErrorHandler('Oops, Application not found!', 400));
    }
    LOGGER.INFO('Application deleted Successfully!');
    res.status(200).json({
        success: true,
        message: 'Application deleted Successfully!'
    });
});
LOGGER.DEBUG('exporting jobSeekerDeleteApplication');
