const { Schema, model } = require("mongoose");
const ProjectSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: {
    type: String,
    required: [true, "Imagen es obligatoria"],
  },
  website: {
    type: String,
    required: [true, "website es obligatorio"],
  },
  codigo: String,
  descripcion: String,
  tecnologias: {
    type: Array,
    required: [true, "Tecnologias son obligatorias"],
  },
});

module.exports = model("Project", ProjectSchema);