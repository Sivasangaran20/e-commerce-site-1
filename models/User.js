const mongoose = require('mongoose');

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            validate: [validateEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: true
        }, 
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);