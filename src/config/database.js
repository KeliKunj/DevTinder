const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://namastenode:namastenode825@namastenode.0xov6m1.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://namastenode:namastenode825@namastenode.0xov6m1.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNode");
};

module.exports = connectDB;

