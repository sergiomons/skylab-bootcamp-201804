const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const Category = require('./category');

module.exports = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    }
})