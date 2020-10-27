const moment = require('moment');

function msgObj(user, msg){
  return {
    username: user,
    message: msg,
    time: moment().format("h:mm a")
  }
}

module.exports = msgObj;