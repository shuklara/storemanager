/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.findOne({email: "rahul.shukla@synerzip.com"},function (err,user) {
  if(!user){
    User.create({
        provider: 'local',
        role: 'admin',
        name: 'Rahul Shukla',
        email: 'rahul.shukla@synerzip.com',
        enabled: true,
        password: process.env.adminPassword || 'admin'
      }, function () {
        console.log('finished populating users');
      }
    );
  }
});
