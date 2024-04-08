const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();
const pool = require('./config/db.sql')
require("./config/routes")(app)


const port = process.env.PORT || 5005;
app.listen(port,()=>{
    console.log(`server listening on port:${port}`);
});
