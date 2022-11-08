var express = require('express');

const jwt = require('jsonwebtoken');

var router = express.Router();

var dbConn = require('../../config/db.js');

// USER SIGNUP
// @ROUTE /userauth/signup
// @DESC Add new useer to the database
// @ACCESS Public
router.post('/signup', (req,res,next)=> {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var contactNo = req.body.contactNo;
    var email = req.body.email;
    var password = req.body.pass;
    var user_role = req.body.user_role;

    try{
        sqlQuery = `INSERT INTO user(fname, lname, user_contact, sch_email, sch_pass, user_role) VALUES ("${fname}", "${lname}", "${contactNo}", "${email}", "${password}", "${user_role}")`;

        dbConn.query(sqlQuery, function(error, results){
            console.log(results);
            res.status(200).json({
                "Account Creation" : "SUCCESSFUL",
                "User ID": results.insertId
            });
        });
    }

    catch (error){
        console.log(error);
        return next(error);
    }
});

// USER LOGIN
// @ROUTE @/userauth/login
// @DESC Verify the user account and returns a token that expires in 1 hour
// @ACCESS Private
router.get('/login', (req,res,next) => {
    var email = req.body.email;
    var password = req.body.password;

    try{
        sqlQuery = `SELECT user_id FROM user WHERE sch_email = "${email}" AND sch_pass= "${password}"`;
        dbConn.query(sqlQuery, function(error,results){
            console.log(results);
            console.log(error);

            
            if(!results.length){
                res.status(400).json({
                    msg: 'Invalid username/password'
                    
                });
                return;
            }
            else{
                userToken = jwt.sign({data:results}, process.env.TOKEN_SECRET, {
                    expiresIn: '3h'
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