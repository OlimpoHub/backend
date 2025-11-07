## [0.1.0] - 05/11/2025

### Added 
- Implemented routes, controllers, and model for the View Workshops use case.
- Added new fields for workshops model and controller.

## [0.0.0] - 04/11/2025 

### Added
 - Added the search for external collabs, allowing to search by name or lastname.
 - Added filters to obtain external collabs by role or status.
 - Added the possibility to order external collabs by name ASC or DESC.

 ## [0.0.0] - 04/11/2025 

### Added
 - Added logic for Delete Supplie
 - Sequence diagram for Delete Supplie
 - Added complete login and authentication flow divided in route, utils, controller and model.
 - Updated supplies model to follow database names
 - Implemented routes, controller, and model for the Get Supplies List use case.
 - Sequence diagram for Product Batch CRUD operations in the MVC structure.
 - Implemented Product Batch model with CRUD operations (fetchAll, fetchOne, add, update, remove).
 - Added Product Batch controller with error handling and response formatting.
 - Created routes for Product Batch operations with JSDoc documentation.
 - UUID generation for inventory IDs.
 
## [0.0.0] - 04/11/2025

### Fixed
 - Fix the query standar in models

### Added
 - Logic to Update external Collab
 - Logic to Register an external collaborator.
 - Added the business logic in 'WorkshopsController' to generate a new workshop.
 - Added the 'save' and 'add' methods to the 'WorkshopsModel' to interact with the data base.
 - Added the routes in 'WorkshopsRoutes' and 'GeneralRoutes' to access to the model and controller.
 - Added the modify controller in 'WorkshopsController' to change the values in the workshop.
 - Added the 'update' methods to the 'WorkshopsModel' to interact with the data base.
 - Merge with realese 0-1-0
 - Update supplies model
 - Routes, controller and model to register supply Batch
### Changed
 - Updated the function of delete for deleteBenefitiaries, so that it does a 'soft' delete.

## [0.0.0] - 04/11/2025 

### Added
- Merge with realese 0-1-0
- Update supplies model

## [0.0.0] - 02/11/2025 

### Added
- Updated supplies model to follow database names
- Implemented routes, controller, and model for the Get Supplies List use case.

### Changed
 - Supplies interface to match the params with the db.


## [0.1.0] - 03/11/2025

### Added
 - Implemented the endpoint 'DELETE /api/beneficiarios/:id' for the user story 'BEN-004'.
 - Added the business logic in 'BeneficiaryController' to validate the status (can't erase active beneficiaries).
 - Added the 'fetchById' and 'remove' methods to the 'BeneficiaryModel' to interact with the data base.

## [0.0.0] - 02/11/2025 

### Added
- Updated supplies model to follow database names
- Implemented routes, controller, and model for the Get Supplies List use case.

## [0.1.0] - 01/11/2025  

### Added
 - US to add a new supply, receiving params and post them into the db.
 - Sequence diagrams for US fetchSupplyBatch and addSupply.
 - Logic to delete an external collaborator.
 - Sequence diagram for User Story of deliting an external collaborator.
 - Sequence diagram for User Story of viewing external collaborator and all of them.
 - Logic to have the routes to view external collaborators (all and by ID).
 - Use case to fetch all supply batches with the MVC structure (supplyBatch)
 - Use case to fetch one supply batch with the MVC structure (supplyBatch)
 - Modified supplies model to correctly fetch data from the database (search, order, filter)
 - Updated supplies controller to handle errors when fetching supplies by ID.
 - Method to handle post request in index.js.
 - Logic to send email to recover password, check if the JWT is valid and update password with argon2 encryption.

## [0.0.0] - 31/10/2025  

### Changed
@@ -94,4 +48,4 @@
 - Pull request template file (14/10/2025)

### Changed
 - Pull request template file now has a direct link to the coding standard (21/10/2025)
 - Pull request template file now has a direct link to the coding standard (21/10/2025)