const { Schema, model } = require('mongoose');

const dealearsSchema = new Schema({
    city: String,
    dealer: String,
    model: String,
    name: String,
    phone: String,
    comment: String,
    operator: String,
    presale: String,
    createdAt: String,
    datedAt: Date,
});

module.exports = model('dealersSchema', dealearsSchema);
