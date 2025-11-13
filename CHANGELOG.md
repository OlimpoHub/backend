## [0.1.0] - 12/11/2025

### Changed
- .gitignore to ignore all the content from uploads/ however track the directory
  anayway so there is no problems

### Fixed
- Fix the undefined request when the supply add information was received from the
  frontend
- Fix the undefined request when the supply doesnt contain a supply batch in the 
  supply batch model
- Fix the model and controller for a better connection with Front
- Fixed a problem with FetchAll ProductBatches

### Added
- Uploads/ directory to upload any file or image from the front
- Implemented routes, controllers, and model for the Modify Supply Batch.
- Deployment diagram updated with the Mail API
- Add funtion to search product
- Add funtion to order product
- Add funtion to remove product
- Add funtion to filter product

## [0.1.0] - 11/11/2025

### Changed
- model getFiltersData updated to also send back the id from the workshops and categories

### Added
- Endpoint to send only workshop and categories ids and names.
- Add deleteOneSupplyFront Secuence Diagram
- Add deleteOneSupplyFrontPakages Diagram
- Modify product implementation
- Sequence diagram for modify product
- Added filter functionality to workshops
- Added functionality for search, order, filter and modify for beneficiaries
- Added the order functionality by name
- Added Acquisition type get route

### Fixed
- Fixing commit regist
- Missing get route for register product.
- Fixed name variables for errors in workshops.model.js
- Parameters needed for RegisterSupplyBatch

## [0.1.0] - 10/11/2025

### Added
- More parameters to match the data with the view of the supply batch
- Add new filter and ordering format added
- Add filter and order organism with generic approach finished
- Add order supply batches functionality 
- Add filter supply batches functionality 
- Add funtion to search a workshop in model, routes and controller.
- Implementation for consult products.
- Sequence diagram for consult products.
- Add funtion to search a workshop in model, routes and controller.
- Add function to modify a beneficiary in model, routes and controller.

### Fixed
- Fix routes, model and controller for external collabs.
- Fix routes on beneficiaries
- Fix post beneficiary function
- Fix the 'horario taller' to 'descripcion' from the data base in workshops.
- Fix Calendar model query to match the database fields.

## [0.1.0] - 09/11/2025

### Added
- Implemented separated filter functions in `ProductBatch` model:
  - `filterPrice({ minPrecio, maxPrecio })`
  - `filterDisponible({ disponible })`
  - `filterDate({ startDate, endDate })`
- Added search functionality: `search(term)`
- Added ordering functionality: `fetchAllWithOrder(orderBy, direction)`
- Created corresponding controller methods and route endpoints for each function.
- Documented all functionalities with PlantUML diagrams:
  - Sequence diagrams for search, order, and each filter.
  - Class diagram for `ProductBatch` model.
- Refactored code to follow formatting standards (multi-line destructuring and parameter arrays).
- Delete supply batch functionality
- Sequence diagrams for  Delete supplies batches and filter
### Fixed
- Fix Model viewOneWorkshop

### Changed
- viewOneWorkshop now returns URL, date and teh user in charge

## [0.1.0] - 08/11/2025

### Added 
- Changed the workshop controller to work with the front end.
- Documentation for register product implemetation.
- Implemented routes, controllers, and model for the Register Product.
- Added sequence diagram.
- Added logic for consult beneficiaries

### Fixed
- Fix controller viewOneWorkshop

## [0.1.0] - 07/11/2025

### Added 
- Implemented routes, controllers, and model for the Eliminate Workshops fucntionality.
- Implemented Registration for new beneficiaries and prevents registration of beneficiaries already existing

## [0.1.0] - 06/11/2025

### Added 
- Sequence diagrams for supplies list

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
 - Added new fields for workshops model and controller.
 - Added logic for Delete Workshop
 
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
