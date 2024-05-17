const mongoose = require("mongoose");
const ListSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique:true,
      required: [true, "Enter To Do List title"],
    },

    desc: {
      type: String,
      required: [true, "Enter To Do List description"],
    },

    comp: {
        type: String,
        enum : ['done','not done'],
        required: [true, "Enter done not done"],
      },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model("List", ListSchema);
module.exports = List;
