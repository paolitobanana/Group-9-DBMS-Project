var express = require('express');

const jwt = require('jsonwebtoken')

var router= express.Router();

var dbConn = require('../../config/db.js');

//@routes/reservation/:user_id 
//INSERT command add inputs existing book_id, and reservation date and return date
//must be able to add multiple book_id without generating multiple reservation_id\

//ADD
// @ROUTE /add-remove/add/:staff_id
// @DESC Addds new books to the book library, and the activity will be tracked in the log_library table
router.post('/reserve/:user_id', (req,res)=> {
    var token = req.headers.authorization;
  
    if (!token){
      res.status(400).json({success: false, msg: 'Error, Token was not found'});
      return;
    }
    token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  
    var user_id = req.params.user_id;
    var Request_date = req.body.Request_date;
    var Return_date = req.body.Return_date;
    var book_id = req.body.book_id;

    dbConn.query(`SELECT book_id, book_status FROM book WHERE book_id = ${book_id} AND book_status = "available"`, function(error, results, fields){
        console.log(results);
        if(error)throw error;
        else if(!results.length){
            console.log("Book does not exist or is not available for reservation")
            res.status(300).json("Book does not exist or is not available for reservation");
            return;
        }
        else{
        sqlQuery = `INSERT INTO reservation(user_id,Request_date, Return_date, book_id) VALUES (${user_id},"${Request_date}", "${Return_date}", ${book_id})`;
  
        dbConn.query(sqlQuery, function(error, results){
            console.log(`Book ${results.insertId} was reserved by : ${user_id}`);
            res.status(400).json({
                "Reservation status" : "Nominal" ,
                "Added by" : user_id,
                "Reservation ID": results.insertId
        });
        });
        dbConn.query(`UPDATE book SET book_status = "reserved" WHERE book_id = ${book_id}`, function(error, results, fields){
            console.log("BOOK STATUS HAS BEEN UPDATED");
            if(error) return;
        });
        }
    });  
});

module.exports = router;