//var remoteDB = require('./lib/remoteDB.js');

var getUserData =function(userData, userId) {
    const bixbyUserId = userId
    return remoteDB.getUserData(bixbyUserId)
}
var	updateUserData = function(userData, userId) {
      const bixbyUserId = userId
      return remoteDB.putUserData(bixbyUserId, userData)
}
var prepareUserData =  function(userData, userId) {
  var data = getUserData(userData, userId);
  return data;
}

module.exports={
  getUserData:getUserData,
  updateUserData:updateUserData,
  prepareUserData:prepareUserData
}

