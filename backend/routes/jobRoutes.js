import { LOGGER } from '../utils/logger.js';
import express from 'express';
import {
    deleteJob,
    getAllJobs,
    getMyJobs,
    postJob,
    updateJob
} from '../controllers/jobController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';

LOGGER.DEBUG('starting ./routes/jobRoutes.js');

const router = express.Router();
const Employer = 'Employer';

router.get('/getAll', getAllJobs);
router.post('/post', isAuthenticated, isAuthorized(Employer), postJob);
router.get('/myJobs', isAuthenticated, isAuthorized(Employer), getMyJobs);
router.put('/update/:id', isAuthenticated, isAuthorized(Employer), updateJob);
router.delete('/delete/:id', isAuthenticated, isAuthorized(Employer), deleteJob);

export default router;
LOGGER.DEBUG('exporting default router');
