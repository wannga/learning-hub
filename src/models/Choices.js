import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Choices = sequelize.define("Choices", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  choice_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "Choices",
  timestamps: false,
});
