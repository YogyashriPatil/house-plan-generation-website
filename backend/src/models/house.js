import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HousePlan = sequelize.define("HousePlan", {
  plan_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  total_area: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  floors: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rooms_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  layout_json: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  layout_image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default HousePlan;
