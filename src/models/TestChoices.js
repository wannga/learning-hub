import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const TestChoices = sequelize.define("TestChoices", {
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
  correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "TestChoices",
  timestamps: false,
});
