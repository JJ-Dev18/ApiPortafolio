const { Schema, model } = require("mongoose");
const TechnologySchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: {
    type: String,
  },
  
});

module.exports = model("Technology", TechnologySchema);
