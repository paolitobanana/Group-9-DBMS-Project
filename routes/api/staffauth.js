var express = require('express');

const jwt = require('jsonwebtoken');

var router = express.Router();

var dbConn = require('../../config/db.js');

// STAFF LOGIN
// @ROUTE /staffauth/login
// @DESC verifies staff account and returns a token that expires in 1 hour
router.get('/login', (req,res,next) => {
    var email = req.body.email;
    var password = req.body.password;

    try{
        sqlQuery = `SELECT staff_id FROM staff WHERE staff_email = "${email}" AND staff_password = "${password}"`;
        dbConn.query(sqlQuery, function(error,results){
            console.log(results);
            if(!results.length){
                res.status(400).json({
                    msg: 'Invalid username/password'
                });
            }
            else{
                userToken = jwt.sign({data:results}, process.env.TOKEN_SECRET, {
                    expiresIn: '1h'
                });
                res.status(200).json({
                msg: 'Log-in Successful!',
                token: userToken
                });
            }   
        });
    }
    catch (error){
        console.log(error);
        return next(error);
    }
});

module.exports = router;