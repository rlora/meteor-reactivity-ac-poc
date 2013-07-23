/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * @class AC.RoomModel
 */
AC.RoomModel = AC.Model.extend({
  //
  // Model attributes
  //
  _attributes: {
    "name": {}
  },

  //
  // Calculated attributes
  //
  _calculatedAttributes: {}

}, {
  //
  // Model indexes
  //
  _indexes: [{
    "name": 1
  }],

  //
  // Collection name
  //
  _collectionName: "Rooms",

  //
  // Server methods
  //
  _serverMethods: function() {
    if (Meteor.isServer) {
      return {};
    }
  }(),

  //
  // Server method stubs
  //
  _serverMethodStubs: function() {
    if (Meteor.isClient) {
      return {};
    }
  }(),

  //
  // Static methods
  //
  _staticMethods: function() {
    return {};
  }()
});

//
// Meteor collection
//
Rooms = new Meteor.Collection("rooms", {
  transform: function(room) {
    new AC.RoomModel(room);
    return room;
  }
});
AC.RoomModel.applyStaticMethods(Rooms);

//
// Before insert hook
//
Rooms.before("insert", function(userId, doc) {
  doc.updatedAt = doc.createdAt = new Date();
});

//
// Before update hook
//
Rooms.before("update", function(userId, selector, modifier, options) {
  if (modifier && modifier["$set"]) {
    modifier["$set"]["updatedAt"] = new Date();
  }
});

//
// Security Allow
//
Rooms.allow({
  insert: function(userId, doc) {
    console.log("Allow.insert: ", userId, doc);
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    console.log("Allow.update: ", userId, doc, fields, modifier);
    return true;
  },
  remove: function(userId, doc) {
    console.log("Allow.remove: ", userId, doc);
    return true;
  },
  transform: null
});

//
// Client subscriptions
//
if (Meteor.isClient) {
  Meteor.subscribe("rooms");
  Meteor.methods(AC.RoomModel.getServerMethodStubs());
}

//
// Server publish
//
if (Meteor.isServer) {
  Meteor.publish("rooms", function() {
    return Rooms.find();
  });
  Meteor.methods(AC.RoomModel.getServerMethods());
}
// Register model
AC.ModelManager.register("AC.RoomModel", AC.RoomModel);