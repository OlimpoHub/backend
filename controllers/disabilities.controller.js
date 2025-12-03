const Disability = require('../models/disabilities.model');

// Fucnion para BEN-001
exports.fetchAll = async (req, res) => {
    // Llama todas las dispacidades para la vista de BEN-001
    try {
        const disabilities = await Disability.fetchAll();
        res.status(200).json(disabilities);
    } catch (error) {
        console.error('Error fetching disabilities:', error);
        res.status(500).json({ message: 'Failed to fetch disabilities.' });
    }

}

// Update disability (US CAP-003)
exports.updateDisabilities = async (request, response) => {
  try {
    const idDiscapacidad = request.body.id;
    const update_disabilities = new Disability(
        request.body.disability_name,
        request.body.disability_description,
  );

    await update_disabilities.updateById(idDiscapacidad);

    response.status(200).json({
        status: true ,
        message: "Success to update disability."});

  } catch (error) {
    console.error("Error updating disability:", error);
    response.status(500).json({
      status: false,
      message: "Failed to update disability." });
  }
};

exports.fetchDisability = async (req, res) => {
  const {idDiscapacidad} = req.params;
  try {
      const discapacidad = await Disability.fetchDisability(idDiscapacidad);

      res.status(200).json(discapacidad);

  } catch (error) {
      res.status(500).json({ message: "Error al obtener la discapacidad." });
  }
};