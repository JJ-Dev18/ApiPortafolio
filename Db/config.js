
const mongoose = require("mongoose");
const { MONGODB_CNN, MONGODB_CNN_TEST,NODE_ENV} = process.env
const connectionString = NODE_ENV === 'test'
? MONGODB_CNN_TEST
: MONGODB_CNN

let connection;
const dbConnection = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      
    });
    console.log("base de datos online");
  } catch (error) {
    console.log(error);
    console.log(process.env.MONGODB_CNN);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

const dbDisconnection =  ()=> {
    mongoose.connection.close()
}

module.exports = {
  dbConnection,
  dbDisconnection
};
