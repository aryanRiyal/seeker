import { LOGGER } from '../utils/logger.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Job } from '../models/jobSchema.js';

LOGGER.DEBUG('starting ./controllers/jobController.js');

export const getAllJobs = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - getAllJobs()');
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs
    });
});
LOGGER.DEBUG('exporting getAllJobs');

export const postJob = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - postJob()');
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo
    } = req.body;
    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler('Please provide all the required job details!', 400));
    }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new ErrorHandler(
                'Please provide the Salary either in the fixed format or in the ranged format!',
                400
            )
        );
    }
    if (!salaryFrom && !salaryTo && !fixedSalary) {
        return next(
            new ErrorHandler('Cannot provide the salary in both the fixed and ranged format!', 400)
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy
    });
    LOGGER.INFO('Job created Successfully!');
    res.status(200).json({
        success: true,
        message: 'Job created Successfully!',
        job
    });
});
LOGGER.DEBUG('exporting postJob');

export const getMyJobs = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - getMyJobs()');
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs
    });
});
LOGGER.DEBUG('exporting getMyJobs');

export const updateJob = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - updateJob()');
    const { id } = req.params;
    const updatedData = req.body;
    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true
    });
    if (!updatedJob) {
        return next(new ErrorHandler('Oops, Job not found!', 404));
    }
    LOGGER.INFO('Job Updated Successfully!');
    res.status(200).json({
        success: true,
        updatedJob,
        message: 'Job Updated Successfully!'
    });
});
LOGGER.DEBUG('exporting updateJob');

export const deleteJob = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - deleteJob()');
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
        return next(new ErrorHandler('Oops, Job not found!', 400));
    }
    LOGGER.INFO('Job deleted Successfully!');
    res.status(200).json({
        success: true,
        message: 'Job deleted Successfully!'
    });
});
LOGGER.DEBUG('exporting deleteJob');
