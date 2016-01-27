/**
 * Created by synerzip on 8/1/16.
 */

var async = require('async');
var _ = require('lodash');
async.each(_.values({1:{name:"Rahul"},2:{name:"Shukla"}}),function(a,callback){
  console.log(a);
  callback();
},function(err){
  console.log("Done")
});
