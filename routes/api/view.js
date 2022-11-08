const express = require('express');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

var date = new Date();


const jwt = require('jsonwebtoken')

const app = express.Router();

var dbConn = require('../../config/db');

const router = require('./staffauth');

//Routes
//SELECT ALL
router.get('/showall', (req, res) => {
    var token = req.headers.authorization;


    if(!token){
        res.status(400).json({success: false, msg: 'Error, Token was not found'});
        return;
    }

    token = req.headers.authorization.split(' ')[1];
    const decodedTOKEN = jwt.verify(token, process.env.TOKEN_SECRET);

    sqlQuery = `SELECT * FROM Book`;
   
   dbConn.query( sqlQuery, function( error, results, fields ){ 
   
       if (error) throw error;
   
           res.status(200).json(results);  
   
     });
});


//SELECT MANY 
router.get('/search',(req,res)=>{
    var token = req.headers.authorization;

    if(!token){
        res.status(400).json({success: false, msg: 'Error, Token was not found'});
        return;
    }

    token = req.headers.authorization.split(' ')[1];
    const decodedTOKEN = jwt.verify(token, process.env.TOKEN_SECRET);
    
    var searchtitle = req.body.searchtitle;
    var searchauthor = req.body.searchauthor;
    var searchpub = req.body.searchpub;

    sqlQuery = `SELECT Book_title, Book_author, Book_publisher FROM book WHERE Book_title LIKE "${searchtitle}" OR Book_author LIKE "${searchauthor}" OR Book_publisher LIKE "${searchpub}"`;
    
    dbConn.query( sqlQuery, function( error, results, fields ){ 
        if (error) throw error;
        else if(!results.length){
            res.status(500).json({
                "No results found":
                "Please try again"
            })
            return;
        }
        res.status(200).json(results);  
      });
});

router.get('/show_avail',(req,res)=>{
    var token = req.headers.authorization;

    if(!token){
        res.status(400).json({success: false, msg: 'Error, Token was not found'});
        return;
    }

    token = req.headers.authorization.split(' ')[1];
    const decodedTOKEN = jwt.verify(token, process.env.TOKEN_SECRET);
    

    var searchtitle = req.body.searchtitle;
    var searchauthor = req.body.searchauthor;
    var searchpub = req.body.searchpub;

    var request_date = new Date (req.params.request_date);
    let reservation_date = request_date.addDays(3);

    sqlQuery = `SELECT * FROM book WHERE  book_status = "available"`;
    dbConn.query( sqlQuery, function( error, results, fields ){ 
        if (error) throw error;
        else if(!results.length){
            res.status(500).json({
                "No results found":
                "Please try again"
            })
            return;
        }
        res.status(200).json(results);  
      });
});


module.exports = router;