require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Workshops = require("../models/workshops.model");

exports.addWorkshops = async (request, response) =>  {
    try {
      const { idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario } = request.body;

      const taller = new Workshops(
        null,
        idCapacitacion,
        nombreTaller,
        horaEntrada,
        horaSalida,
        estatus,
        idUsuario
      );

      const result = await taller.save();
      
      response.status(201).json({
        success: true,
        message: 'Taller creado exitosamente',
        data: {
          idTaller: taller.idTaller,
          result
        }
      });
      
    } catch (error) {
      console.error('Error al crear taller:', error.message);
      response.status(500).json({
        success: false,
        message: 'Error al crear taller',
        error: error.message
      });
    }
}

// // Función de prueba (opcional)
// exports.testCreate = async () => {
//   try {
//     const taller = new Workshops(
//       null,
//       'a6a4dc6e-29f3-4c34-bd3c-4c8c74a5a550',
//       'Taller de liderazgo',
//       '09:00:00',
//       '11:00:00',
//       1,
//       '4e3d1a59-2ac1-4a5e-bb77-3b238bdfc50f'
//     );

//     const result = await taller.save();
    
//     return result;
//   } catch (error) {
//     console.error('Error:', error.message);
//     throw error;
//   }
// }

// if (require.main === module) {
//   exports.testCreate()
//     .then(() => setTimeout(() => process.exit(0), 3000))
//     .catch(() => process.exit(1));
// }