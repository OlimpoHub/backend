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

exports.deleteWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    const result = await Workshops.delete(idTaller);

    response.status(200).json({
      data: {
        idTaller,
        affectedRows: result.affectedRows
      }
    });

  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
}

// Comments de test de talleres (eliminar a futuro)
// const readline = require('readline');

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
//     console.log('ID del taller:', taller.idTaller);
//     return taller.idTaller;
    
//   } catch (error) {
//     throw error;
//   }
// }

// // Función de prueba para modificar taller
// exports.testModify = async (idTaller) => {
//   try {
//     if (!idTaller) {
//       throw new Error('Se requiere idTaller para modificar');
//     }

//     const result = await Workshops.update(
//       idTaller,
//       'Taller de Liderazgo Avanzado',
//       '10:00:00',
//       '12:00:00',
//       0
//     );

//     const serializedResult = serializeResult(result);
//     console.log('ID modificado:', idTaller);
//     return serializedResult;
    
//   } catch (error) {
//     throw error;
//   }
// }

// // Función de prueba para eliminar taller
// exports.testDelete = async (idTaller) => {
//   try {
//     if (!idTaller) {
//       throw new Error('Se requiere idTaller para eliminar');
//     }

//     const result = await Workshops.delete(idTaller);
//     const serializedResult = serializeResult(result);   
//     return serializedResult;
    
//   } catch (error) {
//     throw error;
//   }
// }

// // Función para obtener un ID existente
// exports.getExistingWorkshopId = async () => {
//   try {
//     const query = 'SELECT idTaller FROM Taller ORDER BY idTaller DESC LIMIT 1';
//     const db = require('../utils/db');
//     const result = await db.execute(query);
//     const serializedResult = serializeResult(result);
    
//     if (serializedResult.length === 0) {
//       throw new Error('No hay talleres existentes');
//     }
    
//     return serializedResult[0].idTaller;
//   } catch (error) {
//     throw error;
//   }
// }

// // Función para listar todos los talleres
// exports.listAllWorkshops = async () => {
//   try {
//     const query = 'SELECT idTaller, nombreTaller, estatus FROM Taller ORDER BY idTaller DESC';
//     const db = require('../utils/db');
//     const result = await db.execute(query);
//     const serializedResult = serializeResult(result);

//     if (serializedResult.length === 0) {
//       console.log('No hay talleres registrados');
//     } else {
//       serializedResult.forEach((taller, index) => {
//         console.log(`${index + 1}. ID: ${taller.idTaller} | Nombre: ${taller.nombreTaller} | Estatus: ${taller.estatus}`);
//       });
//     }
    
//     return serializedResult;
//   } catch (error) {
//     throw error;
//   }
// }

// exports.showMenu = async () => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   const menu = `
// MENÚ DE PRUEBAS - TALLERES
// ==============================
// 1. Listar todos los talleres
// 2. Crear nuevo taller
// 3. Modificar último taller
// 4. Eliminar último taller
// 5. Ejecutar todas las operaciones
// 6. Salir
// Selecciona una opción (1-6): `;

//   const question = (query) => new Promise((resolve) => rl.question(query, resolve));

//   try {
//     while (true) {
//       const option = await question(menu);

//       switch (option) {
//         case '1':
//           await exports.listAllWorkshops();
//           break;

//         case '2':
//           const newId = await exports.testCreate();
//           break;

//         case '3':
//           try {
//             const idToModify = await exports.getExistingWorkshopId();
//             await exports.testModify(idToModify);
//           }
//           break;

//         case '4':
//           try {
//             const idToDelete = await exports.getExistingWorkshopId();
//             await exports.testDelete(idToDelete);
//           } 
//           break;

//         case '5':
//           await exports.runCompleteTest();
//           break;

//         case '6':
//           rl.close();
//           return;

//         default:
//           console.log('Opción no válida');
//       }

//       await question('\nPresiona Enter para continuar...');
//       console.clear();
//     }
//   } catch (error) {
//     console.error('Error en el menú:', error);
//     rl.close();
//   }
// }

// // Función de prueba completa (todas las operaciones)
// exports.runCompleteTest = async () => {
//   try {
//     // 1. Listar talleres existentes
//     await exports.listAllWorkshops();
    
//     // 2. Crear nuevo taller
//     const newId = await exports.testCreate();
    
//     // 3. Modificar el taller recién creado
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await exports.testModify(newId);
    
//     // 4. Listar después de modificar
//     await exports.listAllWorkshops();
    
//     // 5. Eliminar el taller
//     await exports.testDelete(newId);
    
//     // 6. Listar final
//     await exports.listAllWorkshops();
    
//   } catch (error) {
//     throw error;
//   }
// }

// // Ejecución automática si es el archivo principal
// if (require.main === module) {
//   console.clear();
//   exports.showMenu()
//     .catch((error) => {
//       console.error('Error en la aplicación:', error);
//       process.exit(1);
//     });
// }