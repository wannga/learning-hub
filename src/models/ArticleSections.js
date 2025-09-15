import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const ArticleSections = sequelize.define('ArticleSections', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  heading: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  list: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  table_headers: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  table_rows: {
    type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.TEXT)),
    allowNull: true,
  },
}, {
  tableName: 'ArticleSections',
  timestamps: false,
});
