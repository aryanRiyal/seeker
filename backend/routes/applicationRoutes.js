import { LOGGER } from '../utils/logger.js';
import express from 'express';
import {
    jobSeekerGetAllApplications,
    employerGetAllApplications,
    jobSeekerDeleteApplication,
    postApplication
} from '../controllers/applicationController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';

LOGGER.DEBUG('starting ./routes/applicationRoutes.js');

const router = express.Router();
const JobSeeker = 'Job Seeker';
const Employer = 'Employer';

router.get(
    '/jobSeeker/getAll',
    isAuthenticated,
    isAuthorized(JobSeeker),
    jobSeekerGetAllApplications
);
router.get('/employer/getAll', isAuthenticated, isAuthorized(Employer), employerGetAllApplications);
router.post('/postApplication', isAuthenticated, isAuthorized(JobSeeker), postApplication);
router.delete('/delete/:id', isAuthenticated, isAuthorized(JobSeeker), jobSeekerDeleteApplication);

export default router;
LOGGER.DEBUG('exporting default router');
