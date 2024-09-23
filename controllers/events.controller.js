import path from 'path';
import fs from 'fs/promises';

import Media from '../models/Media.js';
import Users from "../models/Users.js";
import Events from '../models/Events.js';

import {sendMail} from "../services/Mail.js";
import {createXlsx} from "../services/Xlsx.js";

import sequelize from "../clients/sequelize.mysql.js";

export default {
    async create(req, res) {
        try {
            const {title, description, location, date} = req.body;
            const {id} = req.user;
            const {files} = req;

            if (!files) {
                res.status(409).json({
                    message: 'File or files not found!'
                });
                return;
            }
            const event = await Events.create({
                title,
                description,
                location,
                date,
                userId: id,
            });

            for (let file of files) {
                const filePath = file.path.replace('public/', '');

                await Media.create({
                    path: filePath,
                    eventId: event.id,
                })
            }

            const result = await Events.findByPk(event.id, {
                include: [
                    {
                        model: Media,
                        as: 'images',
                    }
                ]
            });


            await sendMail({
                to: req.user.email,
                subject: 'Your event',
                template: 'events',
                templateData: {
                    title: result.title,
                    description: result.description,
                    location: result.location,
                    date: result.date,
                }
            });

            res.status(201).json({
                message: 'Event created successfully',
                result
            })

        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            });
        }
    },

    async getEvents(req, res) {
        try {
            const {id: userId} = req.user;
            const order = req.query.order;

            const user = await Users.findByPk(userId);

            if (!order) {
                res.status(400).json({
                    message: 'Order is required'
                })
                return;
            }

            const events = await Events.findAll({
                attributes: [
                    'id',
                    'description',
                    'createdAt',
                    [
                        sequelize.fn('COUNT', sequelize.col('images.id')),
                        'mediaCount'
                    ]
                ],

                where: {
                    userId
                },
                include: [
                    {
                        model: Media,
                        as: 'images',
                        attributes: []
                    }
                ],
                group: ['id'],
                order: [
                    [
                        [
                            sequelize.literal('mediaCount'),
                            order
                        ]
                    ]
                ],
                raw: true
            });

            if (!events) {
                res.status(404).json({
                    message: 'No events found',
                    events: []
                });
                return;
            }

            console.log(events[0])

            const filename = `users-${Date.now()}.xlsx`;
            const fullPath = `./public/xlsx/${filename}`;

            createXlsx(events, fullPath);

            await sendMail({
                to: req.user.email,
                subject: 'User events statistics',
                template: 'statistics',
                templateData: {},
                attachments: [
                    {
                        filename,
                        path: path.resolve(fullPath),
                    }
                ]
            });

            await fs.unlink(path.resolve(fullPath));

            res.status(200).json({
                message: 'Events list',
                events
            })

        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
        }
    },

    async update(req, res) {
        try {
            const {id} = req.params;
            const {id: userId} = req.user;
            const {files = null} = req;
            const {title, description, location, date} = req.body;

            const event = await Events.findOne({
                where: {id, userId},
                include: {
                    model: Media,
                    as: 'images',
                },
            });

            if (!event) {
                if (files) {
                    files.forEach(file => fs.unlink(file.path));
                }
                return res
                    .status(403)
                    .json({message: 'You are not allowed to edit this event'});
            }

            await Events.update({
                    title,
                    description,
                    location,
                    date
                },
                {
                    where: {id}
                })

            const pathImages = await Media.findAll({
                where: {eventId: event.id}
            });
            await Media.deleteFiles(pathImages);

            for (let image of files) {
                await Events.update(
                    {
                        path: Media.processFilePath(image),
                    },
                    {where: {eventId: event.id}}
                );
            }

            res.status(200).json({
                message: 'Event updated successfully',
            })
        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            });
        }
    },
}