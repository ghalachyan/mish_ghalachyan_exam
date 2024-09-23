import Users from './models/Users.js';
import Media from './models/Media.js';
import Events from './models/Events.js';

const models = [
    Users,
    Events,
    Media,
];

(async () => {
    for (const model of models) {
        await model.sync({ alter: true });
        console.log(`${model.name} table created or updated`);
    }
})()

export default models;