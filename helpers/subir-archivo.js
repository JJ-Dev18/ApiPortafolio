const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

        const { img } = files;
        const nombreCortado = img.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );

        img.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve( nombreTemp );
        });

    });

}

const updateImage = async (img,carpeta,oldImg) => {

     const { tempFilePath: temFileImg } = img;
      const { secure_url: urlImg } = await cloudinary.uploader.upload(
        temFileImg,
        {
          folder: carpeta,
        }
      );
      const oldImgsplit = oldImg.split("/");
      const nombreOldImg = oldImgsplit[oldImgsplit.length - 1];
      const [idOldImg] = nombreOldImg.split(".");
      cloudinary.uploader.destroy(`${carpeta}/${idOldImg}`);
     return urlImg;
}



module.exports = {
    subirArchivo,
    updateImage
}