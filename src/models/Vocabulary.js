import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

export const Vocabulary = sequelize.define('Vocabulary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vocab: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  thai: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  definition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Vocabulary',
  timestamps: false,
});
