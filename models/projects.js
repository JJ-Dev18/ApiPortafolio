const { Schema, model } = require("mongoose");

const TechnologySchema = new Schema();

TechnologySchema.add({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: {
    type: String,
    required: [true, "La imagen de la tecnologia es obligatorio"],
  },
});

const ProjectSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: {
    type: String,
  },
  website: {
    type: String,
    required: [true, "website es obligatorio"],
  },
  codigo: String,
  descripcion: String,
  tecnologias : {
    type : Array,
    required : [true, "Tecnologias obligatorias"]
  }
  // tecnologias: [
  //   TechnologySchema
  // ],
});

module.exports = model("Project", ProjectSchema);