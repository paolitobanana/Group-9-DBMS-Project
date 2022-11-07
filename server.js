// importing express framework
const express = require('express');
require('dotenv').config();

const app = express();

const viewRoutes = require('./routes/api/view.js');
const add_removeRoutes = require('./routes/api/add-remove.js');
const userauthRoutes = require('./routes/api/userauth.js');
const staffauthRoutes = require('./routes/api/staffauth.js');

// initialization of middleware
app.use(express.json({extended: false}));
app.use('/view', viewRoutes);
app.use('/staffauth', staffauthRoutes);
app.use('/userauth', userauthRoutes);
app.use('/add-remove', add_removeRoutes)

// testing of API
app.get('/',(req, res) => res.send('API Running'));

const PORT = 6969;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));