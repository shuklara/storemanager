/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({email: "rahul.shukla@synerzip.com"}).remove(function () {
  User.create({
      provider: 'local',
      role: 'admin',
      name: 'Rahul Shukla',
      email: 'rahul.shukla@synerzip.com',
      enabled: true,
      password: process.env.adminPassword
    }, function () {
      console.log('finished populating users');
    }
  );
});
