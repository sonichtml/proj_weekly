"use strict";
/*
 * GET users listing.
 */

var tof = require('../lib/tof');

exports.list = function(req, res){
  res.send("hello");
};
exports.hi = function(req, res){
  res.send("hi");
};

exports.isLogin = function(req, res){
  var user = req.cookies.user;
  // return false
  
  if(user && user.uid) {
    res.locals.user = user;
    // console.log(user);
    return true;
  } else {
    res.locals.user = null;
    return false;
  }
};

exports.tofLogin = function(req, res){
  var url = req.protocol || 'http';
  url += "://";
  url += req.get('host');
  url += req.originalUrl; 
  res.redirect('http://passport.oa.com/modules/passport/signin.ashx?url='+encodeURIComponent(url));
};

exports.auth = function(req, res, next) {
  if('undefined' === typeof process.env.NODE_ENV || 'production' !== process.env.NODE_ENV) {
    var isLogin = exports.isLogin(req, res);
    var ticket = req.query.ticket || '';
    if(!isLogin){
      if(!ticket) {
        exports.tofLogin(req, res);
      } else {
        tof.passport(ticket, function(_user){
          if('undefined' !== typeof _user.uid && _user.uid) {
            res.locals.user = _user;
            res.cookie('user',_user, {maxAge:86400000});
          }
          //var path = req.query['path'] || '/';
          next();
        });
      }
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = exports;

