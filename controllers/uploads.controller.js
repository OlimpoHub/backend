const path = require("path");
const fs = require("fs");

// GET: Opens a file
exports.openFile = (request, response) => {
    // Gets the file name
    const fileName = request.params.fileID;

    // Gets the file address
    const directory = path.join(
        __dirname, 
        "..",
        "uploads",
        fileName
    );

    // Renders the file
    fs.access(directory, fs.constants.F_OK, (error) => {
        // In case the file wasn't found, sends an error
        if (error) {
            return response
                .status(404)
                .json({error: "The file doesn't exist"});
        }

        // Renders the file
        response.sendFile(directory);
    });
};