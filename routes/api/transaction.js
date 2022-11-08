var express = require('express');

const jwt = require('jsonwebtoken')

var router= express.Router();

var dbConn = require('../../config/db.js');


// RETURN 
// @ROUTES /transaction/return/:staff_id
// @DESC Being able 
router.post('/return/:staff_id', (req,res)=> {
    var token = req.headers.authorization;
  
    if (!token){
      res.status(400).json({success: false, msg: 'Error, Token was not found'});
      return;
    }
    token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  
    var staff_id = req.params.staff_id;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;
    var Transaction_date = req.body.Transaction_date;
    var Reservation_id = req.body.Reservation_id;


    dbConn.query(`SELECT Reservation_id, book_id FROM reservation WHERE Reservation_id = ${Reservation_id} AND book_id = ${book_id}`, function(error, results, fields){
        console.log(results);
        if(error)throw error;
        else if(!results.length){
            console.log("Reservation is not found")
            res.status(300).json("Reservation ID does not exist");
            return;
        }
        else{
        sqlQuery = `INSERT INTO transaction(Reservation_id, User_id, book_id,Transaction_name,Transaction_date, Staff_id) VALUES (${Reservation_id},${user_id}, ${book_id},"return","${Transaction_date}", ${staff_id})`;
  
        dbConn.query(sqlQuery, function(error, results){
            console.log(`Book ${results.insertId} was reserved by : ${user_id}`);
            res.status(400).json({
                "Transaction Type" : "Return" ,
                "Returned by" : user_id,
                "Transaction ID": results.insertId
        });
        });
        dbConn.query(`UPDATE book SET book_status = "available" WHERE book_id = ${book_id}`, function(error, results, fields){
            console.log("BOOK STATUS HAS BEEN UPDATED");
            if(error) return;
        });
        }
    });  
});



// RELEASE 
// @ROUTES /transaction/release/:staff_id
// @DESC Being able 
router.post('/release/:staff_id', (req,res)=> {
    var token = req.headers.authorization;
  
    if (!token){
      res.status(400).json({success: false, msg: 'Error, Token was not found'});
      return;
    }
    token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  
    var staff_id = req.params.staff_id;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;
    var Transaction_date = req.body.Transaction_date;
    var Reservation_id = req.body.Reservation_id;


    dbConn.query(`SELECT Reservation_id, book_id, Return_date FROM reservation WHERE Reservation_id = ${Reservation_id} AND book_id = ${book_id}`, function(error, results){
        console.log(results);
        const return_date = results.Return_date;
        if(error)throw error;
        else if(!results.length){
            console.log("Reservation is not found")
            res.status(300).json("Reservation ID does not exist");
            return;
        }
        else{
        sqlQuery = `INSERT INTO transaction (Reservation_id, User_id, book_id,Transaction_name,Transaction_date, Staff_id) VALUES (${Reservation_id},${user_id}, ${book_id},"release","${Transaction_date}", ${staff_id})`;
  
        dbConn.query(sqlQuery, function(error1, results1){
            console.log(`Book ${book_id} was reserved by : ${user_id}`);
            res.status(400).json({
                "Transaction Type" : "Release" ,
                "Receieved by" : user_id,
                "Transaction ID": results.insertId
        });
        dbConn.query(`UPDATE book SET book_status = "not available until:${return_date}" WHERE book_id = ${book_id}`, function(error2, results2){
            console.log("BOOK STATUS HAS BEEN UPDATED");
            if(error) return;
        });
        });

        }
    });  
});



module.exports = router;