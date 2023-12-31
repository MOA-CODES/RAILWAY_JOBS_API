const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type:String,
        required:[true, 'Please provide an email address'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address'
        ],
        unique: true,
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
        minlength: 6,
        // maxlength: 12, //removed because hashing passwords makes it longer
    },
})

UserSchema.pre('save', async function (){ //before saving

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME,})
}

UserSchema.methods.comparePassword = async function (userPassword){
    const compare = await bcrypt.compare( userPassword, this.password)
    return compare
}

module.exports = mongoose.model('User', UserSchema)