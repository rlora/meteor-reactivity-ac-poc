/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */
Template.Rooms.rooms = function() {
  var rooms = Rooms.find({}).fetch();
  return _.collectInRows(rooms, 3);
};

Template.Room.room = function() {
  var transactions = RoomTransactions.find({
    "parent": this._id
  }, {
    "sort": {
      "createdAt": -1
    }
  });

  return {
    "transactions": transactions
  };
};