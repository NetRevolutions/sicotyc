const { Schema, model }   = require('mongoose');

const LoockupCodeGroupSchema = new Schema({    
    lookupCodeGroupName   : { type: String, required: true },
    createdBy             : { type: String, required: true, default: 'SYSTEM' },
    createdUtc            : { type: Date, required: true, default: new Date() },
    lastModifiedBy        : { type: String, required: false },
    lastModifiedUtc       : { type: Date, required: false }
});

LoockupCodeGroupSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject(); // Con esto evitamos devolver la version (__v)
    return object;
});

module.exports = model('LookupCodeGroup', LoockupCodeGroupSchema);