const HousePlan = sequelize.define("HousePlan", {
  plan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_name: { type: DataTypes.STRING(100) },
  total_area: { type: DataTypes.FLOAT, allowNull: false },
  floors: { type: DataTypes.INTEGER, allowNull: false },
  rooms_count: { type: DataTypes.INTEGER, allowNull: false },
  layout_json: { type: DataTypes.JSON },
  layout_image_url: { type: DataTypes.STRING(255) }, // 👈 new column
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
