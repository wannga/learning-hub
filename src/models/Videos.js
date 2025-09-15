import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Videos = sequelize.define('Videos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creator: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  objective: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  target: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tag: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'Videos',
  timestamps: false, 
});
