const mongoose = require('mongoose');

module.exports.connectMongoDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://baderraheel5:Mok3pTY9TDfMAl7l@cluster0.cmimqay.mongodb.net/Full-Auth`
        );
        console.log('Connection established with MongoDB.');
        return;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
