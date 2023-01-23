const jwt = require('jsonwebtoken');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '6h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}
const comprobarJWT = (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    } else {
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

      return uid;
    }
  } catch (error) {
    // console.log(error);
    return null;
  }
};




module.exports = {
    generarJWT,
    comprobarJWT
}

