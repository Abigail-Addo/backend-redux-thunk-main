import express from 'express';
import ticketController from '../controller/ticketController.js'
import { authUser } from "../middleware/auth.js"

const router = express.Router();


router.get('/api/tickets', ticketController.allTickets);

router.post('/api/ticket/:userId', authUser,  ticketController.addTicket);

router.delete('/api/ticket/:id', ticketController.deleteTicket);

router.put('/api/tickets/:id', ticketController.updateTicket);


export default router;



// router.get('/api/tickets', ticketController.allTickets);