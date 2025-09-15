import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  signup_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  career: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  article_history: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  casestudy_history: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  video_history: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  quiz_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  test_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'Users', 
  timestamps: false,
});
