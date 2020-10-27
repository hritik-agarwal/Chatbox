const users = [];

function userJoin(id, username, room){
  users.push({id, username, room});
  return {id, username, room};
}

function getCurrUser(id){
  return users.find(user => user.id === id);
}

function userLeave(id){
  const index = users.findIndex(user => user.id === id);
  return users.splice(index, 1);
}

function getRoomUsers(room){
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin, getCurrUser, userLeave, getRoomUsers
};
