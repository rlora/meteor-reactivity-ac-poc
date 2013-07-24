/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */
Template.RoomResidents.info = function() {
  var count = 0, residents = {}, room = Rooms.findOne(Session.get("roomId"));
  if (room && room._id) {
    residents = RoomResidents.find({
      "parent": room._id
    });
    count = residents.count();
  }
  return {
    "room": room,
    "residents": residents,
    "count": count
  };
};