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
        if (existingBeneficiary.estatus === 1) {
            // (Flujo Alterno 5.1)
            return res.status(409).send({
                message: "The beneficiary is active and can't be deleted."
            });
        }

        // 3. (Flujo Principal) El beneficiario existe y NO está activo. Procedemos a eliminar.
        await Beneficiary.remove(id);

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

exports.get_beneficiaries = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.fetchAll();
        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ message: 'Failed to fetch beneficiaries.' });
    }
};

exports.get_beneficiary = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await Beneficiary.fetchById(id);
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: 'Failed to fetch beneficiary.' });
    }
};