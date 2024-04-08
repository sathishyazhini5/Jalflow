const express = require('express');
const router = express.Router();
const index = require('../controller/index');

let routes = (app) => {

   router.post('/login',index.login)
   router.get('/fetchdata',index.fetchAlldata)
   router.put('/update',index.updatedata)
   router.get('/getsingledata/:rdl_mobile_No',index.getSingledata)
   router.get('/getdate/:recv_date',index.getduration)
   router.get('/getalldatafromsite',index.fetchAlldatafromsite)
   router.get('/getSitedata',index.getSiteData)
   router.get('/getlastdatecum',index.getLastDateAndCum)

   app.use("/api",router)
};

module.exports = routes
