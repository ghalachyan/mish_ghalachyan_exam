import path from "path";
import fs from "fs/promises";

import {DataTypes, Model} from "sequelize";
import sequelize from "../clients/sequelize.mysql.js";

class Media extends Model {
    static async deleteFiles(pathPhotos) {
        for (let photo of pathPhotos) {
            const photoDir = path.resolve(`./public${photo.path}`);
            if (
                await fs.access(photoDir).then(() => true).catch(() => false)
            ) {
                await fs.unlink(photoDir);
            }
            await Media.destroy({where: {id: photo.id}});
        }
    }

    static processFilePath(file) {
        if (!file) return null;
        const relativePath = file.destination.replace(
            `${path.resolve('./public')}`,
            ''
        );

        return path.join(relativePath, file.filename);
    }
}

Media.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        path: {
            type: DataTypes.STRING,
        },

        eventId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },

        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'media',
        tableName: 'media',
    }
)

export default Media;