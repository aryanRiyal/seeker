import { LOGGER } from '../utils/logger.js';
import express from 'express';
import { register, login, logout } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

LOGGER.DEBUG('starting ./routes/userRoutes.js');

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Welcome Seeker!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);

export default router;
LOGGER.DEBUG('exporting default router');
