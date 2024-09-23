import {DataTypes, Model} from 'sequelize';
import sequelize from '../clients/sequelize.mysql.js';

import Media from "./Media.js";

class Events extends Model {}

Events.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },

    },
    {
        sequelize,
        modelName: 'events',
        tableName: 'events',
    }
)

Events.hasMany(Media, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: 'eventId',
    as: 'images',
});

Media.belongsTo(Events, {
    foreignKey: 'eventId',
});

export default Events;