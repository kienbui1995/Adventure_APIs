/**
 * Created by Brucelee Thanh on 29/10/2016.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: false,
        default: null
    },
    last_name: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: false,
        default: null
    },
    phone_number: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    gender: {
        type: Number, // 0 : male , 1 : female
        required: false,
        default: 0
    },
    birthday: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false,
        default: null
    },
    religion: {
        type: String,
        required: false,
        default: null
    },
    intro: {
        type: String,
        required: false,
        default: null
    },
    id_facebook: {
        type: String,
        required: false,
        default: null
    },
    avatar: {
        type: String,
        required: false,
        default: null
    },
    cover: {
        type: String,
        required: false,
        default: null
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now()
    },
    latest_active: {
        type: Date,
        required: false,
        default: Date.now()
    },
    fcm_token:{
        type:String,
        required:false,
        default:null
    }
});
module.exports = mongoose.model('User', userSchema);