import { Router } from 'express';
import { login, signup, logout, allTicketsByUser } from '../controller/userController.js';
import { authUser } from "../middleware/auth.js"

const router = Router();

router.post('/api/users', signup);
router.post('/api/users/login', login);
router.post('/api/users/logout', logout);
router.get('/api/users/:id', authUser, allTicketsByUser);


export default router;