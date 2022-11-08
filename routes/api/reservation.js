var express = require('express');

// UNUSED DATA(CURRENT DATE FUNCTION)
// FIND ME A DATE, I'M SINGLE!!! <0956271013>
/*Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var date = new Date()
*/
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

    // let Return_date = `${date.getMonth()+(1+duration)}-${date.getDate()}-${date.getFullYear()}`;
    // var return duration = req.body.duration_days

    dbConn.query(`SELECT book_id, book_status FROM book WHERE book_id = ${book_id} AND book_status = "available"`, function(error, results, fields){
        console.log(results);
        if(error)throw error;
        else if(!results.length){
            console.log("Book does not exist or is not available for reservation")
            res.status(300).json("Book does not exist or is not available for reservation");
            return;
        }
        else{
        //dbConn.query(`SELECT Return_date FROM reservation WHERE`)
        sqlQuery = `INSERT INTO reservation(user_id,Request_date, Return_date, book_id,reservation_status) VALUES (${user_id}, "${Request_date}", "${Return_date}", ${book_id},"on-going")`;
  
        dbConn.query(sqlQuery, function(error, results){
            console.log(`Book ${results.insertId} was reserved by : ${user_id}`);
            res.status(400).json({
                "Reservation status" : "Claim the book you reserved before 3 days after this request." ,
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

// Prototype no.0001 not working !!!! PLS HELP MEE IM DYING!!!
// WHY LIVE 
/*router.get('/reserved/:staff_id/:request_status', (req,res) =>{
    var token = req.headers.authorization;
  
    if (!token){
      res.status(400).json({success: false, msg: 'Error, Token was not found'});
      return;
    }
    token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    
    var request_date = req.body.request_date;
    var request_date = JSON.stringify(request_date);
    var new_request_date = new Date (request_date);
    let reservation_date = new_request_date.addDays(3);
    console.log(new_request_date)
    console.log(reservation_date);
    console.log(date);
    console.log(date);
    
    sqlQuery = `UPDATE reservation SET reservation_status = "cancelled" WHERE DATE("${reservation_date}") >= DATE("${date}")`;
    dbConn.query(sqlQuery, function(error, results){
        if(error) throw error;
        else if(!results.length){
            return;
        }
    });
    
    sqlQuery = `UPDATE book SET book_status = "available" FROM reservation INNER JOIN book ON book.book_id = reservation.(SELECT DISTINCT book_id FROM reservation WHERE DATE("${reservation_date})> DATE("${date}")`;
    dbConn.query(sqlQuery, function(error,results){
        if(error) throw error;
        else if (!results.length){
            return;
        }
    });
    
    
    dbConn.query(`SELECT * FROM  reservation WHERE Request_date BETWEEN "${date}" AND "${reservation_date} ORDER BY Request_date ASC`, function (error, results){
        if (error) throw error;
        else if(!results.length){
            console.log("No Reservation for today"); 
        }
    });
});*/

module.exports = router;