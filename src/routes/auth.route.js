const express  = require('express');
const authContoller = require('../controller/auth.controller');
const { checkRole } = require('../middlewares/role.middleware');
const {verifyJWT} =  require("../middlewares/auth.middleware")

const router = express.Router();

router.post('/register',authContoller.register);
router.post('/login',authContoller.login);

module.exports = router;
