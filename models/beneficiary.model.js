// const pool = require('../util/database');

module.exports = class Beneficiary {
    constructor(beneficiaryId, firstName, paternalLastName, maternalLastName, dateOfBirth, emergencyPhoneNumber, emergencyContactName, emergencyContactRelationship, description, admissionDate, photo) {
        this.beneficiaryId = beneficiaryId;
        this.firstName = firstName; 
        this.paternalLastName = paternalLastName; 
        this.maternalLastName = maternalLastName; 
        this.dateOfBirth = dateOfBirth; 
        this.emergencyPhoneNumber = emergencyPhoneNumber;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactRelationship = emergencyContactRelationship;
        this.description = description;
        this.admissionDate = admissionDate;
        this.photo = photo;
    }

    static fetchAll() {
        return new Promise((resolve) => {
            const mockData = [
                new Beneficiary(1, "María", "López", "García", "2000-05-10", "555-1234", "Ana López", "Madre", "Descripción 1", "2023-01-01", "foto1.jpg"),
                new Beneficiary(2, "Juan", "Pérez", "Rodríguez", "1998-08-20", "555-5678", "Carlos Pérez", "Padre", "Descripción 2", "2023-02-15", "foto2.jpg"),
                new Beneficiary(3, "Ana", "García", "Sánchez", "2001-11-05", "555-9012", "Luis García", "Tío", "Descripción 3", "2023-03-10", "foto3.jpg"),
            ];
            resolve(mockData);
        });
    }
}