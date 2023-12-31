const { Schema, model }   = require('mongoose');
const Role = require('./role');

const ObjectId = Schema.Types.ObjectId;

const UserSchema = Schema({    
    firstName                 : { type: String, required: true },
    lastName                  : { type: String, required: true },
    userName                  : { type: String, unique: true, required: true },
    email                     : { type: String, unique: true, required: true, trim: true, lowercase: true },
    emailConfirmed            : { type: Boolean, default: false },
    mobile                    : { type: String, required: true },
    password                  : { type: String, required: true },
    imagePath                 : { type: String },
    refreshToken              : { type: String },
    refreshTokenExpiryTime    : { type: Date },
    roles                     : [{type: ObjectId, ref: 'Role'}],
    terms                     : { type: Boolean },
    createdBy                 : { type: String, required: true, default: 'SYSTEM' },
    createdUtc                : { type: Date, required: true, default: new Date() },
    lastModifiedBy            : { type: String, required: false },
    lastModifiedUtc           : { type: Date, required: false }
});

UserSchema.method('toJSON', function() {
    const {__v, _id, password, ...object } = this.toObject(); // Con esto evitamos devolver __v y _id, el resto se devuelve 
    object.uid = _id; // Con esto le seteamos a una variable definida por el usuario el valor de _id
    return object;
}); 

module.exports = model('User', UserSchema);