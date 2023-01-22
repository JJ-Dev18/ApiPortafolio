const { Schema, model } = require("mongoose");

const ProjectSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: {
    type: String,
  },
  gif: {
    type: String,
  },
  website: {
    type: String,
    required: [true, "website es obligatorio"],
  },
  complejidad: {
    type: String,
    required : [true, "complejidad obligatorio"]
  },
  codigo: String,
  descripcion: String,
  tecnologias: [{ type: Schema.Types.ObjectId, ref: "Technology" }],
  // tecnologias: [
  //   TechnologySchema
  // ],
});

module.exports = model("Project", ProjectSchema);