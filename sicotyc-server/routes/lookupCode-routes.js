/**
 * Lookup Codes
 * Path: '/api/lookupCodes'
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { 
    getLookupCodes,
    createLookupCodes,
    updateLookupCodes,
    deleteLookupCode,
    getLookupCodesByLCG
} = require('../controllers/lookupCode-controller');

const router = Router();

router.get( '/',
    [
        //validateJWT
    ],
    getLookupCodes
);

router.get( '/:lcgId', 
    [
        //validateJWT
    ],
    getLookupCodesByLCG
);

router.post('',
    [
        validateJWT,
        check('lookupCodeGroup', 'El LookupCodeGroup debe de ser valido').isMongoId(),
        check('lookupCodeValue', 'El valor del Lookup Code es requerido').not().isEmpty(),
        check('lookupCodeName', 'El nombre del Lookup Code es requerido').not().isEmpty(),        
        validateFields
    ], 
    createLookupCodes
);

router.put('/:id',
    [
        validateJWT,
        check('lookupCodeGroup', 'El LookupCodeGroup debe de ser valido').isMongoId(),
        check('lookupCodeValue', 'El valor del Lookup Code es requerido').not().isEmpty(),
        check('lookupCodeName', 'El nombre del Lookup Code es requerido').not().isEmpty(),        
        validateFields
    ], 
    updateLookupCodes
);

router.delete('/:id',
    [    
        validateJWT    
    ], 
    deleteLookupCode
);


module.exports = router;