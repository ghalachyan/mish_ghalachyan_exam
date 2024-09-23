import { Router } from "express";
import users from './users.js';
import events from './events.js';

const router = Router();

router.use('/users', users);
router.use('/events', events);

export default router;