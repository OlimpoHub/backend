const Beneficiary = require('../models/beneficiary.model');

// Nueva función para BEN-04
exports.deleteBeneficiary = async (req, res) => {
    // 1. (Pendiente) Autenticación
    // Aqui va logica para verificar que el usuario es "Coordinador"
    // if (req.user.role !== 'Coordinador') {
    //  return res.status(403).send({ message: "No permission to do this action." });
    // }

    try {
        const { id } = req.params;

        // 2. (Flujo 5.1) Verificar si el beneficiario esta activo ANTES de borrar
        const existingBeneficiary = await Beneficiary.fetchById(id);

        if (!existingBeneficiary) {
            return res.status(404).send({ message: "Beneficiary not found." });
        }

        // Asumimos que 1 = Active y 0 = Inactive.
        // Aqui se aplica el dicho SOFT DELETE.
        if (existingBeneficiary.estatus === 0) {
            // (Flujo Alterno 5.1)
            return res.status(409).send({
                message: "The beneficiary is already inactive."
            });
        }

        // 3. (Flujo Principal) El beneficiario existe y está activo. Procedemos a eliminar (inactivarlo).
        await Beneficiary.deactivate(id);

        // 4. (Paso 7) Éxito. 204 significa "Sin Contenido" (la eliminacion fue exitosa)
        res.status(204).send();

    } catch (error) {
        //Manejo de errores de base de datos o servidor
        res.status(500).send({
            message: "Error in the server when trying to delete the beneficiary.",
            error: error.message
        });
    }
};
// FIN DE FUNCION PARA BEN-04

exports.getBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.fetchAll();
        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ message: 'Failed to fetch beneficiaries.' });
    }
};

exports.getBeneficiary = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Beneficiary.fetchById(id);
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: 'Failed to fetch beneficiary.' });
    }
};

// Controller for BEN-02
exports.beneficiariesList = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.beneficiariesList();
        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ message: 'Failed to fetch beneficiaries.' });
    }
};


exports.postBeneficiary = async (req, res) => {
    try {
        const data = req.body

        const result = await Beneficiary.registerBeneficiary(data);
        res.status(200).json(result.message);
    } catch {
        res.status(500).json({ message: 'Failed to fetch Beneficiary data. '});
    }
};

// Controller para BEN-003
exports.updateBeneficiary = async (req, response) => {
    try {
        const { id: beneficiaryId } = req.params;
        const existingData = await Beneficiary.fetchById(beneficiaryId);

        if (!existingData) {
            return response.status(404).json({ message: "Beneficiario no encontrado para actualizar." });
        }
        const {
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            numeroEmergencia,
            nombreContactoEmergencia,
            relacionContactoEmergencia,
            descripcion,
            fechaIngreso,
            foto,
            estatus
        } = req.body;

        const result = await Beneficiary.update(
            beneficiaryId,
            nombre !== undefined ? nombre : existingData.nombre,
            apellidoPaterno !== undefined ? apellidoPaterno : existingData.apellidoPaterno,
            apellidoMaterno !== undefined ? apellidoMaterno : existingData.apellidoMaterno,
            fechaNacimiento !== undefined ? fechaNacimiento : existingData.fechaNacimiento,
            numeroEmergencia !== undefined ? numeroEmergencia : existingData.numeroEmergencia,
            nombreContactoEmergencia !== undefined ? nombreContactoEmergencia : existingData.nombreContactoEmergencia,
            relacionContactoEmergencia !== undefined ? relacionContactoEmergencia : existingData.relacionContactoEmergencia,
            descripcion !== undefined ? descripcion : existingData.descripcion,
            fechaIngreso !== undefined ? fechaIngreso : existingData.fechaIngreso,
            foto !== undefined ? foto : existingData.foto,
            estatus !== undefined ? estatus : existingData.estatus
        );
        
        response.status(200).json({
        message: "Beneficiario modificado correctamente",
        data: {
            beneficiaryId,
            modifiedFields: {
            ...(nombre && { nombre }),
            ...(apellidoPaterno && { apellidoPaterno }),
            ...(apellidoMaterno && { apellidoMaterno }),
            ...(fechaNacimiento && { fechaNacimiento }),
            ...(numeroEmergencia && { numeroEmergencia }),
            ...(nombreContactoEmergencia && { nombreContactoEmergencia }),
            ...(relacionContactoEmergencia && { relacionContactoEmergencia }),
            ...(descripcion && { descripcion }),
            ...(fechaIngreso && { fechaIngreso }),
            ...(foto && { foto }),
            ...(estatus !== undefined && { estatus })
            },
            affectedRows: result[0]?.affectedRows || result.affectedRows
        }
        });

    } catch (error) {
        console.error("Error en updateBeneficiary():", error);
        response.status(500).json({
        error: error.message
        });
    }
};

exports.searchBeneficiaries = async (req, res) => {
    try {
        const { term } = req.query;

        if (!term) {
            return res.status(400).json({ message: "The search term is required." });
        }

        const beneficiaries = await Beneficiary.searchByName(term);

        res.status(200).json(beneficiaries);

    } catch (error) {
        console.error('Error in searchBeneficiaries:', error);
        res.status(500).json({ message: 'Error in the server when searching beneficiaries.' });
    }
};