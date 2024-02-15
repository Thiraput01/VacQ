const express = require('express');
const {getHospital, getHospitals, createHospital, updateHospital, deleteHospital} = require('../controllers/hospitals');
const router = express.Router();

router.route('/').get(getHospitals).post(createHospital);
router.route('/:id').get(getHospital).put(updateHospital).delete(deleteHospital);

module.exports = router;