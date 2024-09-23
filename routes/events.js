import {Router} from 'express';
import eventsSchema from '../schemas/events.js';
import validate from '../middleware/validate.js';
import uploadFile from "../middleware/uploadFile.js";
import checkToken from "../middleware/checkToken.js";
import controller from '../controllers/events.controller.js';

const router = Router();

router.post(
    '/create',
    uploadFile('public/events').array('images', 4),
    checkToken,
    validate(eventsSchema.create, 'body'),
    controller.create
);

router.get(
    '/list',
    checkToken,
    validate(eventsSchema.getEvents, 'query'),
    controller.getEvents
);

router.put(
    '/update/:id',
    uploadFile('public/events').array('images', 4),
    checkToken,
    validate(eventsSchema.update, 'body'),
    controller.update
);

export default router