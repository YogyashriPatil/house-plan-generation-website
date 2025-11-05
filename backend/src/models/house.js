import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const House = sequelize.define("House", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  floors: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  planDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default House;
