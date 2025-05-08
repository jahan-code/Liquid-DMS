const { Schema, model } = require('mongoose');

exports.JwtToken = model(
    'jwtToken',
    new Schema(
        {
            tokenID: {
                type: String,
                required: true,
                unique: true,
            },
            userID: {
                type: String,
                default: null,
            },
            token: {
                type: String,
                required: true,
            },
        },
        { timestamps: true }
    )
);
