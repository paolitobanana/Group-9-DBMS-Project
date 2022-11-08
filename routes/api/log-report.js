var express = require('express');

const jwt = require('jsonwebtoken')

const router= express.Router();

var dbConn = require('../../config/db');

// ACTIVITY REQUESTER
//
router.get('/report/:staff_id', (req,res) => {
    var token = req.headers.authorization;

    if(!token){
        res.status(400).json({success: false, msg: 'Error, Token was not found'});
        return;
    }

    token = req.headers.authorization.split(' ')[1];
    const decodedTOKEN = jwt.verify(token, process.env.TOKEN_SECRET);
    
    var staff_id = req.params.staff_id;
    var report_id = req.body.report_id
    var reservation_id = req.body.reservation_id;
    var transaction_id = req.body.transaction_id;

    dbConn.query(`SELECT * FROM activity_report WHERE Report_ID = ${report_id}`, function(errorRe,resultsRe){
        if (errorRe) throw errorRe;
        else if (!resultsRe){
            var json_report = [{
                "Report ID Search Error": "Report ID not fount"
            }];
        }
        else{
        json_report = [{
            "Report ID" : report_id,
            "Report Date": resultsRe[0].Report_Date
        }];
        
        dbConn.query(`SELECT * FROM reservation WHERE reservation_ID = ${reservation_id}`, function(errorR, resultsR){
            if(errorR) throw errorR;
            else if(!resultsR){
                var json_reservation = [{
                    "Reservation ID Search Error": "Reservation ID not Found"
                }]
            }
            else{
                json_reservation = [{
                    "Reservation ID" : reservation_id,
                    "Request_date" : resultsR[0].Request_date,
                    "Return_date" : resultsR[0].Return_date,
                    "Book ID": resultsR[0].book_id
                }];

                dbConn.query(`SELECT * FROM transaction WHERE Transaction_ID = ${transaction_id}`, function(errorT, resultsT){
                    if(errorR) throw errorT;
                    else if(!resultsT){
                        var json_transaction =[{
                            "Transaction ID Search Error": "Transaction ID not Found"
                        }];
                        var output = json_report.concat(json_reservation);
                        output = output.concat(json_transaction)
                        res.status(300).send(output)
                        return;
                    }
                    else{
                        json_transaction = [{
                            "Transaction ID" : transaction_id,
                            "User ID" : resultsT[0].User_id,
                            "Transaction Name" : resultsT[0].Transaction_name,
                            "Transaction Date" : resultsT[0].Transaction_date,
                            "Staff ID": resultsT[0].staff_id
                        }];
                        output = json_report.concat(json_reservation);
                        output = output.concat(json_transaction)
                        res.status(200).send(output)
                        
                    }
                });
            }
        });
        };
    });

});

module.exports = router;

