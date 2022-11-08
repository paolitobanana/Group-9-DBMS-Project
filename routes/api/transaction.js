var express = require('express');

const jwt = require('jsonwebtoken')

const date = new Date();

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
    let Transaction_date = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
    var reservation_id = req.body.reservation_id;
    var report_date = new Date();



    dbConn.query(`SELECT reservation_id, book_id FROM reservation WHERE reservation_id = ${reservation_id} AND book_id = ${book_id}`, function(error, results, fields){
        console.log(results);
        if(error)throw error;
        else if(!results.length){
            console.log("Reservation is not found")
            res.status(300).json("Reservation ID does not exist");
            return;
        }
        else{
        sqlQuery = `INSERT INTO transaction(reservation_id, User_id, book_id,Transaction_name,Transaction_date, Staff_id) VALUES (${reservation_id},${user_id}, ${book_id},"return","${Transaction_date}", ${staff_id})`;
  
        dbConn.query(sqlQuery, function(error, results1){
            console.log(`Book ${results1.insertId} was reserved by : ${user_id}`);
            res.status(400).json({
                "Transaction Type" : "Return" ,
                "Returned by user id:" : user_id,
                "Transaction ID": results1.insertId
            });
            sqlQuery = `INSERT INTO activity_report (Report_Date, reservation_ID, Transaction_ID) VALUES("${report_date}", ${reservation_id}, ${results1.insertId})`;
    
            dbConn.query(sqlQuery, function(err, resu){
            console.log(resu);
            console.log(`Activity log ${resu.insertId}: ${staff_id} has added reservation having reservation ID: ${reservation_id} `);
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
    var Transaction_date = new Date();
    var reservation_id = req.body.reservation_id;
    var report_date = new Date();


    dbConn.query(`SELECT reservation_id, book_id, Return_date FROM reservation WHERE reservation_id = ${reservation_id} AND book_id = ${book_id}`, function(error, results){
        console.log(results);
        if(error)throw error;
        else if(!results.length){
            console.log("Reservation is not found")
            res.status(300).json("Reservation ID does not exist");
            return;
        }
    });

        sqlQuery = `INSERT INTO transaction (reservation_id, User_id, Book_id,Transaction_name,Transaction_date, Staff_id) VALUES (${reservation_id},${user_id}, ${book_id},"release","${Transaction_date}", ${staff_id})`;
  
        dbConn.query(sqlQuery, function(error1, results1){
            console.log(`Book ${book_id} was reserved by : ${user_id}`);
            res.status(400).json({
                "Transaction Type" : "Release" ,
                "Receieved by" : user_id,
                "Transaction ID": results1.insertId
        });
        dbConn.query(`UPDATE book SET book_status = "not available" WHERE book_id = ${book_id}`, function(error2, results2){
            console.log("BOOK STATUS HAS BEEN UPDATED");
            if(error2) throw error2;       
            });
        sqlQuery = `INSERT INTO activity_report (Report_Date, reservation_ID, Transaction_ID) VALUES("${report_date}", ${reservation_id}, ${results1.insertId})`;
    
        dbConn.query(sqlQuery, function(err, resu){
        console.log(resu);
        console.log(`Activity log ${resu.insertId}: ${staff_id} has added reservation having reservation ID: ${reservation_id} `);
        });
        });
});

module.exports = router;