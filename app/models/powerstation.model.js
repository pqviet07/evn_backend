module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      station_id: String,
      location: String,
      wattage: Number,
      image_url: String,
      manufactory: String,
      maintainance_id: Number,
      status: String,
      note: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const PowerStation = mongoose.model("power_stations", schema);
  return PowerStation;
};
