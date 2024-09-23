import {query, Router} from 'express';
import usersSchema from '../schemas/users.js';
import validate from '../middleware/validate.js';
import uploadFile from "../middleware/uploadFile.js";
import checkToken from "../middleware/checkToken.js";
import controller from '../controllers/users.controller.js';

const router = Router();

router.post(
    '/registration',
    uploadFile('public/avatar').single('avatar'),
    validate(usersSchema.registration, 'body'),
    controller.registration
);

router.post(
    '/login',
    validate(usersSchema.login, 'body'),
    controller.login
);

router.get(
    '/activate',
    validate(usersSchema.activate, 'query'),
    controller.activate
)

export default router;