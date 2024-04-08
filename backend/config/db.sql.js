
// const mysql = require('mysql');



// var con = mysql.createConnection({
//     host: "apexcomtel.com",
//     port: 3306,
//     database: "apexindia_rdl",
//     user: "apexindia_rdl",
//     password: "sias"
// })



// con.connect((error)=>{
//     if (error) {console.log(error); return}
//     console.log("connected")
// })

// module.exports = con;
const mysql = require('mysql');

// Create a connection pool
var pool = mysql.createPool({
    connectionLimit: 10, // Adjust according to your needs
    host: "apexcomtel.com",
    port: 3306,
    database: "apexindia_rdl",
    user: "apexindia_rdl",
    password: "sias"
});

// Get a connection from the pool
pool.getConnection((error, connection) => {
    if (error) {
        console.log("Error getting connection from pool:", error);
        return;
    }
    
    console.log("Connected to MySQL database through connection pool");
    

    
});

module.exports = pool;

