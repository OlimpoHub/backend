require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Workshops = require("../models/workshops.model");

exports.addWorkshops = async (request, response) => {
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
      data: {
        idTaller: taller.idTaller,
        result
      }
    });

  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
}

exports.modifyWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    const { nombreTaller, horaEntrada, horaSalida, estatus } = request.body;

    const newTaller = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida,
      estatus
    );

    response.status(200).json({
      data: {
        idTaller,
        modifiedFields: {
          ...(nombreTaller && { nombreTaller }),
          ...(horaEntrada && { horaEntrada }),
          ...(horaSalida && { horaSalida }),
          ...(estatus !== undefined && { estatus })
        }
      }
    });

  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
}

// // Función serializar resultados con BigInt
// function serializeResult(result) {
//   return JSON.parse(JSON.stringify(result, (key, value) =>
//     typeof value === 'bigint' ? value.toString() : value
//   ));
// }

// // Función de prueba para crear taller
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
//     const serializedResult = serializeResult(result);
//     return taller.idTaller;
    
//   } catch (error) {
//     console.error('Error creando taller:', error.message);
//     throw error;
//   }
// }

// // Función de prueba para modificar taller
// exports.testModify = async (idTaller) => {
//   try {
//     const result = await Workshops.update(
//       idTaller,
//       'Taller de Liderazgo Avanzado',
//       '10:00:00',
//       '12:00:00',
//       0
//     );

//     const serializedResult = serializeResult(result);
//     return serializedResult;
    
//   } catch (error) {
//     console.error('Error modificando taller:', error.message);
//     throw error;
//   }
// }

// // Función para obtener un ID existente
// exports.getExistingWorkshopId = async () => {
//   try {
//     const query = 'SELECT idTaller FROM talleres ORDER BY idTaller DESC LIMIT 1';
//     const db = require('../utils/db');
//     const result = await db.execute(query);
//     const serializedResult = serializeResult(result);
    
//     if (serializedResult.length === 0) {
//       throw new Error('No hay talleres existentes');
//     }
    
//     return serializedResult[0].idTaller;
//   } catch (error) {
//     console.error('Error obteniendo ID existente:', error.message);
//     throw error;
//   }
// }

// // Función de prueba completa
// exports.runCompleteTest = async () => {
//   try {
//     let idTaller;
    
//     try {
//       idTaller = await exports.getExistingWorkshopId();
//     } catch (error) {
//       idTaller = await exports.testCreate();
//     }
    
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await exports.testModify(idTaller);
//     return true;
    
//   } catch (error) {
//     console.error('Error en tests:', error.message);
//     throw error;
//   }
// }

// // Ejecución 
// if (require.main === module) {
//     exports.runCompleteTest()
//       .then(() => {
//         setTimeout(() => process.exit(0), 1000);
//       })
//       .catch((error) => {
//         console.error('Fallaron:', error);
//         process.exit(1);
//       });
// }