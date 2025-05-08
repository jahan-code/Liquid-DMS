const { Schema, model } = require('mongoose');

// Define User schema
exports.User = model(
    'user',
    new Schema(
        {
            userID: {
                type: String,
            },
            name: {
                type: String,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
            },
            confirmPassword: {
                type: String
            },
            PhoneNumber: {
                type: String,
                maxlength: 11,
                minlength: 11,
                match: /^[0-9]{11}$/
            },
            isAccountVerified: {
                type: Boolean,
                default: false,
            },
            Otp: {
                type: String,
                default: "",
            },
            ExpireAt: {
                type: Number,
                default: 0,
            }
        },
        {
            timestamps: true, // Adds createdAt and updatedAt fields to the User schema
        }
    )
);
