import { LOGGER } from '../utils/logger.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Application } from '../models/applicationSchema.js';

LOGGER.DEBUG('starting ./controllers/applicationController.js');

export const postApplication = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - postApplication()');
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
