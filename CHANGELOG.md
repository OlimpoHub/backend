## [0.1.0] - 03/11/2025

### Added
 - Implemented the endpoint 'DELETE /api/beneficiarios/:id' for the user story 'BEN-004'.
 - Added the business logic in 'BeneficiaryController' to validate the status (can't erase active beneficiaries).
 - Added the 'fetchById' and 'remove' methods to the 'BeneficiaryModel' to interact with the data base.

## [0.1.0] - 01/11/2025  

### Added
 - Modified supplies model to correctly fetch data from the database (search, order, filter)
 - Updated supplies controller to handle errors when fetching supplies by ID.
 - Method to handle post request in index.js.
 

## [0.0.0] - 31/10/2025  

### Changed

 - Updated dotenv configuration to correctly load environment variables from the .env file located in the parent directory.

### Added
 - Test code to verify database connection and query execution.
 - Added "type": "module" to package.json to enable ES module support.

## [0.0.0] - 20/10/2025  

### Added

 - MC (Model-Controller) and routes (endpoints)
 - Mock data to verify the correct implementation of the API
 - APIs initial structure with NodeJs and Express

## [0.0.0] - 14/10/2025

### Added

 - Coding Standard (14/10/2025)
 - Project's initial commit (14/10/2025)
 - Changelog file (14/10/2025)
 - Pull request template file (14/10/2025)

### Changed
 - Pull request template file now has a direct link to the coding standard (21/10/2025)