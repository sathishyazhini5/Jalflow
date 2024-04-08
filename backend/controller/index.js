const service = require('./service')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Received username:", username);
    console.log("Received password:", password);
    try {
        const user = await service.loginUser(username, password);
        console.log("User:", user);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updatedata = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await service.updatePassword(username, password);
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const fetchAlldata = async (req, res) => {
    try {
        const data = await service.getAllData();
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getSingledata = async (req, res) => {
    const mobileNumber = req.params.rdl_mobile_No;
    try {
        const data = await service.getDataByMobileNumber(mobileNumber);
        console.log("Response:", data); 
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const getduration = async (req, res) => {
    const { startDate, endDate, mobileNumber } = req.body;
    try {
        // Check if startDate, endDate, and mobileNumber are defined and are strings
        if (
            typeof startDate !== 'string' || 
            !startDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/) ||
            typeof endDate !== 'string' ||
            !endDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/) ||
            typeof mobileNumber !== 'string'
        ) {
            throw new Error('Invalid input format');
        }

        const duration = await service.getCumulativeDataByTimeanddate(startDate, endDate, mobileNumber);
        console.log(duration);
        res.json({ success: true, duration });
    } catch (error) {
        console.error("Error fetching duration:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const fetchAlldatafromsite = async (req, res) => {
    try {
        const data = await service.getAllDatafromsite()
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const getSiteData =  async(req,res) =>
{
    try {
        const data = await service.getSiteData()
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const getLastDateAndCum =  async (req, res) => {
    try {
        const rdl_mobile_No = req.body.rdl_mobile_No; // Assuming rdl_mobile_No is in the request body

        if (!rdl_mobile_No) {
            throw new Error("rdl_mobile_No is required");
        }

        const data = await  service.getMaxCumFlowByMobileNumber(rdl_mobile_No);
        console.log(data)
        
        if (data.max_date === null && data.cum_flow_m3 === null) {
            res.status(404).json({
                success: false,
                message: "No data found for the provided rdl_mobile_No"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Error fetching max cumulative flow data:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {           
    fetchAlldata,
    login,
    updatedata,
    getSingledata,
    getduration,
    fetchAlldatafromsite,
    getSiteData,
    getLastDateAndCum
 

}