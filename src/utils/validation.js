const validator = require('validator');

const validateSignUpData = (req)=>{
    const { firstName, lastName, emailId, password, age, gender, photoURL, about } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is invalid");
    }
    else if ( firstName.length <4 || firstName.length > 50) {
        throw new Error("First Name should be between 4 and 50 characters");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format: " + emailId);
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Weak password. ");
    }
    else if (age < 18) {
        throw new Error("Age should be greater than or equal to 18");
    }
    else if(!["Male", "Female", "Other"].includes(gender)){
        throw new Error("Invalid gender value. Allowed values are: Male, Female, Other");
    }
    else if(!validator.isURL(photoURL)){
        throw new Error("Invalid photoURL format: "+ photoURL);
    }
}

module.exports = {validateSignUpData};