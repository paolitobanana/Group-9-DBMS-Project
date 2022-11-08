var express = require('express');

const jwt = require('jsonwebtoken')

const router= express.Router();

var dbConn = require('../../config/db');


//ADD
// @ROUTE /add-remove/add/:staff_id
// @DESC Addds new books to the book library, and the activity will be tracked in the log_library table
router.post('/add/:staff_id', (req,res)=> {
  var token = req.headers.authorization;

  if (!token){
    res.status(400).json({success: false, msg: 'Error, Token was not found'});
    return;
  }
  token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  var staff_id = req.params.staff_id;
  var book_title = req.body.book_title;
  var book_author = req.body.book_author;
  var book_publisher = req.body.book_publisher;
  var book_desc = req.body.book_desc;
  var book_status = req.body.book_status;
  var book_cost = req.body.book_cost;
  var book_version = req.body.book_version;
  var publish_date = req.body.publish_date;
  var activity_date = req.body.activity_date;

      sqlQuery = `INSERT INTO book(staff_id, Book_title, Book_author, Book_publisher, Book_desc, book_status, book_cost,Book_version,Publish_date) 
      VALUES (${staff_id}, "${book_title}", "${book_author}", "${book_publisher}", "${book_desc}", "${book_status}", ${book_cost}, "${book_version}", "${publish_date}")`;

      dbConn.query(sqlQuery, function(error, results){
          console.log(`Book ${results.insertId} has been added successfully by Admin ID : ${staff_id}`);
          console.log(results);
          res.status(400).json({
              "Library Storage Update" : "SUCCESSFUL" ,
              "Added by" : staff_id,
              "Book ID": results.insertId
      });
      sqlQuery = `INSERT INTO library_log(Book_ID, Staff_ID, Activity_Date) VALUES(${results.insertId}, ${staff_id}, "${activity_date}")`;

      dbConn.query(sqlQuery, function(err, resu){
        console.log(`Library_log ID(${resu.insertId}): Admin ID(${staff_id}) has added Book ID(${results.id})`);
        console.log(err);
      });
  });
});


//DELETE
// @ROUTE /add-remove/delete/:staff_id
// @DESC Removes books to the book library, and the activity will be logged in the log_library table
router.delete('/delete/:staff_id',(req, res) => {
  var token = req.headers.authorization;

  if (!token){
    res.status(400).json({success: false, msg: 'Error, Token was not found'});
    return;
  }
  token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  var staff_id = req.params.staff_id;
  var book_id = req.body.book_id;
  var activity_date = req.body.activity_date;
  
  dbConn.query(`SELECT book_id FROM book WHERE book_id = ${book_id}`, function(error, results_T, fields){
    if(error) throw error;

    else if (!results_T.length){
      console.log("Book ID does not exist!")
      res.status(300).json("Book ID does not exist!");
      return;
    }
    dbConn.query('SET foreign_key_checks = 0');
    sqlQuery = `DELETE FROM book WHERE book_id = ${book_id}`;
    dbConn.query(sqlQuery, function(error_D, results_D, fields_D){
      console.log("Book has been removed!");
      res.status(200).json({
        "Removal Status": "Success",
        "Removed Book ID number:" : book_id
      });
      sqlQuery = `INSERT INTO library_log(Book_ID, Staff_ID, Activity_Date) VALUES(${book_id}, ${staff_id}, "${activity_date}")`;

      dbConn.query(sqlQuery, function(err, resu){
        console.log(`Library_log ${resu.insertId}: Admin ${staff_id} removed Book ${book_id} `);
      });
    dbConn.query(`SET foreign_key_checks=1`);
    });
  });  
});


module.exports = router;