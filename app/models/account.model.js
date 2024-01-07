const Mongoose = require("mongoose");

module.exports = (mongoose) => {
  var accountSchema = mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    role: {
      type: String,
      default: "Basic",
      required: true,
    },
    refreshToken: {
      type: String
    }
  },
    { timestamps: true }
  );

  accountSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Account = mongoose.model("accounts", accountSchema);
  return Account;
};
