import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ArticleSections } from './ArticleSections.js';

export const Articles = sequelize.define('Articles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  tag: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  objective: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  target: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  infoBox: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  }
}, {
  tableName: 'Articles',
  timestamps: false,
});

Articles.hasMany(ArticleSections, {
  foreignKey: 'article_id',
  as: 'sections',
});