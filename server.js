// importing express framework
const express = require('express');
require('dotenv').config();

const app = express();

const viewRoutes = require('./routes/api/view.js');
const add_removeRoutes = require('./routes/api/add-remove.js');
const userauthRoutes = require('./routes/api/userauth.js');
const staffauthRoutes = require('./routes/api/staffauth.js');
const reservationRoutes = require('./routes/api/reservation.js');
const transactionRoutes = require('./routes/api/transaction.js');
const log_reportRoutes = require('./routes')

// initialization of middleware
app.use(express.json({extended: false}));
app.use('/view', viewRoutes);
app.use('/staffauth', staffauthRoutes);
app.use('/userauth', userauthRoutes);
app.use('/add-remove', add_removeRoutes);
app.use('/reservation', reservationRoutes);
app.use('/transaction', transactionRoutes);

// testing of API
app.get('/',(req, res) => res.send('API Running'));

const PORT = 6969;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
