const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const UserItem = model('UserItem', UserSchema)

module.exports = UserItem