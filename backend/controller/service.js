const  mongoose = require('mongoose')
const db = require('../config/db.sql')
const bcrypt = require('bcrypt')


const loginUser = (username, password)=> {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM `user_detail_tbl` WHERE `username` = ?";
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                console.log("Query results:", results); 
                if (results.length > 0) {
                    const user = results[0];
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (isPasswordValid) {
                        resolve(user); 
                    } else {
                        resolve(null); 
                    }
                } else {
                    resolve(null); 
                }
            }
        });
    });
};


const updatePassword = async (username, newPassword)=> {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return new Promise((resolve, reject) => {
            const query = "UPDATE `user_detail_tbl` SET `password` = ? WHERE `username` = ?";
            db.query(query, [hashedPassword, username], (err, result) => {
                if (err) {
                    console.error("Error updating password:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

const getAllData = async ()=> {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM `analog_digital_params_table_vtc_common`";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

const getDataByMobileNumber = async (mobileNumber) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM `analog_digital_params_table_vtc_common` WHERE `rdl_mobile_No` = ?";
        db.query(query, [mobileNumber], (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
// const getCumulativeDataByDate = async (startDate, endDate, mobileNumber) => {
//     return new Promise((resolve, reject) => {
//         // Check if startDate, endDate, and mobileNumber are defined and are strings
//         if (
//             typeof startDate !== 'string' || 
//             !startDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
//         ) {
//             reject(new Error('Invalid startDate format or undefined'));
//             return;
//         }

//         if (
//             typeof endDate !== 'string' ||
//             !endDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
//         ) {
//             reject(new Error('Invalid endDate format or undefined'));
//             return;
//         }

//         if (typeof mobileNumber !== 'string') {
//             reject(new Error('Invalid mobileNumber format or undefined'));
//             return;
//         }

//         // Capture the start time
//         const startTime = Date.now();

//         const query = `
//         SELECT 
//         DATE(log_date) as recd_date,
//         MAX(cumulative_flow) - MIN(cumulative_flow) as cf 
//     FROM 
//         your_table_name 
//     WHERE 
//         rdl_mobile_no = ? AND DATE(log_date) = ? 
//     GROUP BY 
//         DATE(log_date), rdl_mobile_no
    
//         `;
        

//         db.query(query, [startDate, endDate, mobileNumber], (err, results) => {
//             // Capture the end time
//             const endTime = Date.now();

//             if (err) {
//                 console.error("Error executing query:", err);
//                 reject(err);
//             } else {
//                 console.log("Query results:", results);
//                 console.log("SQL Query:", query);

//                 let totalDifference = 0;

//                 if (results && results.length > 0) {
//                     results.forEach(result => {
//                         const difference = result.last_cumulative - result.first_cumulative;
//                         console.log(`Date: ${result.log_date}, Difference: ${difference}`);
//                         totalDifference += difference;
//                     });
//                 }

//                 console.log("Overall Cumulative Difference:", totalDifference);
//                 console.log(`Time taken: ${endTime - startTime} ms`); // Calculate and log the time taken
//                 resolve(totalDifference);
//             }
//         });
//     });
// }
const getCumulativeDataByDate = async (startDate, endDate, mobileNumber) => {
    return new Promise((resolve, reject) => {
        // Check if startDate, endDate, and mobileNumber are defined and are strings
        if (
            typeof startDate !== 'string' || 
            !startDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
        ) {
            reject(new Error('Invalid startDate format or undefined'));
            return;
        }

        if (
            typeof endDate !== 'string' ||
            !endDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
        ) {
            reject(new Error('Invalid endDate format or undefined'));
            return;
        }

        if (typeof mobileNumber !== 'string') {
            reject(new Error('Invalid mobileNumber format or undefined'));
            return;
        }

        // Capture the start time
        const startTime = Date.now();

        const query = `
            SELECT 
                log_date,
                cum_flow_m3 as cumulative
            FROM 
                analog_digital_params_table_vtc_common 
            WHERE 
                log_date BETWEEN ? AND ?
                AND rdl_mobile_No = ?
            ORDER BY 
                log_date ASC
            LIMIT 1

            UNION

            SELECT 
                log_date,
                cum_flow_m3 as cumulative
            FROM 
                analog_digital_params_table_vtc_common 
            WHERE 
                log_date BETWEEN ? AND ?
                AND rdl_mobile_No = ?
            ORDER BY 
                log_date DESC
            LIMIT 1
        `;

        db.query(query, [startDate, endDate, mobileNumber, startDate, endDate, mobileNumber], (err, results) => {
            // Capture the end time
            const endTime = Date.now();

            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                console.log("Query results:", results);
                console.log("SQL Query:", query);

                let firstCumulative = 0;
                let lastCumulative = 0;

                if (results && results.length === 2) {
                    firstCumulative = results[0].cumulative;
                    lastCumulative = results[1].cumulative;
                }

                const difference = lastCumulative - firstCumulative;
                console.log(`First Cumulative: ${firstCumulative}, Last Cumulative: ${lastCumulative}, Difference: ${difference}`);
                console.log(`Time taken: ${endTime - startTime} ms`); // Calculate and log the time taken
                resolve(difference);
            }
        });
    });
}



const getAllDatafromsite = async ()=> {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM `site_detail_tbl`";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

const getSiteData = async() =>
{
    return new Promise((resolve, reject) => {
        const query = "SELECT site_name , site_location , dev_phone_no FROM site_detail_tbl";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}



const getMaxCumFlowByMobileNumber = (rdl_mobile_No) => {
    return new Promise((resolve, reject) => {
        if (!rdl_mobile_No) {
            reject(new Error("rdl_mobile_No is required"));
            return;
        }

        const query = `
            SELECT max(recv_date) as max_date, cum_flow_m3 
            FROM analog_digital_params_table_vtc_common 
            WHERE rdl_mobile_No = ?`;

        db.query(query, [rdl_mobile_No], (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                if (results.length === 0 || results[0].max_date === null) {
                    console.log(`No data found for rdl_mobile_No: ${rdl_mobile_No}`);
                    resolve({
                        max_date: null,
                        cum_flow_m3: null
                    });
                } else {
                    resolve(results[0]); 
                }
            }
        });
    });
};


const getCumulativeDataByTimeanddate = async (startDate, endDate, mobileNumber) => {
    return new Promise((resolve, reject) => {
        // Check if startDate, endDate, and mobileNumber are defined and are strings
        if (
            typeof startDate !== 'string' || 
            !startDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
        ) {
            reject(new Error('Invalid startDate format or undefined'));
            return;
        }

        if (
            typeof endDate !== 'string' ||
            !endDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/)
        ) {
            reject(new Error('Invalid endDate format or undefined'));
            return;
        }

        if (typeof mobileNumber !== 'string') {
            reject(new Error('Invalid mobileNumber format or undefined'));
            return;
        }

        const startTime = Date.now();

        const query = `
            SELECT 
                DATE(recv_date) as date,
                MIN(cum_flow_m3) as first_cumulative,
                MAX(cum_flow_m3) as last_cumulative
            FROM 
                analog_digital_params_table_vtc_common 
            WHERE 
                recv_date BETWEEN ? AND ?
                AND rdl_mobile_No = ?
            GROUP BY 
                DATE(recv_date)
        `;

        db.query(query, [startDate, endDate, mobileNumber], (err, results) => {
            const endTime = Date.now();

            if (err) {
                console.error("Error executing query:", err);
                reject(err);
            } else {
                console.log("Query results:", results); // Logging query results

                const responseData = [];

                results.forEach((row) => {
                    const dailyCumulative = row.last_cumulative - row.first_cumulative;
                    const dailyData = {
                        date: row.date,
                        first_cumulative: row.first_cumulative,
                        last_cumulative: row.last_cumulative,
                        daily_cumulative: dailyCumulative
                    };

                    console.log(`Date: ${dailyData.date}, First Cumulative: ${dailyData.first_cumulative}, Last Cumulative: ${dailyData.last_cumulative}, Daily Cumulative: ${dailyData.daily_cumulative}`);
                    
                    responseData.push(dailyData);
                });

                console.log(`Total Cumulative: ${responseData.reduce((acc, curr) => acc + curr.daily_cumulative, 0)}`);
                console.log(`Time taken: ${endTime - startTime} ms`);
                
                resolve(responseData);
            }
        });
    });
}






module.exports = {
    loginUser,
    updatePassword,
    getAllData,
    getDataByMobileNumber,
    getCumulativeDataByDate,
    getAllDatafromsite,
    getSiteData,
    getMaxCumFlowByMobileNumber,
    getCumulativeDataByTimeanddate
    
    
}