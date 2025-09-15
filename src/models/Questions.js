import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Questions = sequelize.define("Questions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "Questions",
  timestamps: false, 
});