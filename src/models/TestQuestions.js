import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const TestQuestions = sequelize.define("TestQuestions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  course_type: {
    type: DataTypes.STRING(25),
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "TestQuestions",
  timestamps: false, 
});