import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const CaseStudy = sequelize.define("CaseStudy", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  }, {
    tableName: "CaseStudy",
    timestamps: false, 
  }
);
