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
  var occupancy, transactions = RoomTransactions.find({
    "parent": this._id
  }, {
    "limit": 6,
    "sort": {
      "createdAt": -1
    }
  });
  occupancy = RoomResidents.find({
    "parent": this._id
  }).count();

  return {
    "transactions": transactions,
    "occupancy": occupancy,
    "occupancyPercentage": 100 * (occupancy / this.capacity),
    "remainingPercentage": 100 * (1 - (occupancy / this.capacity))
  };
};

Template.Room.events({
  "click a[data-room-id]": function(e) {
    var link, roomId = e.target.getAttribute("data-room-id");
    if (roomId === null) {
      link = $(e.target).parents("a[data-room-id]")[0];
      roomId = link.getAttribute("data-room-id");
    }
    if (roomId) {
      Session.set("roomId", roomId);
      $(".room-residents").modal();
    }
  }
});

Template.Rooms.events({
  "click button[data-action]": function(e) {
    Meteor.call("RoomTransactions.simulate");
  }
});