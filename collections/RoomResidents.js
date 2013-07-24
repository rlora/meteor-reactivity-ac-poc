/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * @class AC.RoomResidentModel
 */
AC.RoomResidentModel = AC.Model.extend({
  //
  // Model attributes
  //
  _attributes: {
    "parent": {},
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
    "parent": 1
  }, {
    "name": 1
  }, {
    "parent": 1,
    "name": 1
  }],

  //
  // Collection name
  //
  _collectionName: "RoomResidents",

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
RoomResidents = new Meteor.Collection("roomResidents", {
  transform: function(roomResident) {
    new AC.RoomResidentModel(roomResident);
    return roomResident;
  }
});
AC.RoomResidentModel.applyStaticMethods(RoomResidents);

//
// Before insert hook
//
RoomResidents.before("insert", function(userId, doc) {
  doc.updatedAt = doc.createdAt = new Date();
});

//
// Before update hook
//
RoomResidents.before("update", function(userId, selector, modifier, options) {
  if (modifier && modifier["$set"]) {
    modifier["$set"]["updatedAt"] = new Date();
  }
});

//
// Security Allow
//
RoomResidents.allow({
  insert: function(userId, doc) {
    console.log("Allow.insert: ", userId, doc);
    return false;
  },
  update: function(userId, doc, fields, modifier) {
    console.log("Allow.update: ", userId, doc, fields, modifier);
    return false;
  },
  remove: function(userId, doc) {
    console.log("Allow.remove: ", userId, doc);
    return false;
  },
  transform: null
});

//
// Client subscriptions
//
if (Meteor.isClient) {
  Meteor.subscribe("roomResidents");
  Meteor.methods(AC.RoomResidentModel.getServerMethodStubs());
}

//
// Server publish
//
if (Meteor.isServer) {
  Meteor.publish("roomResidents", function() {
    return RoomResidents.find();
  });
  Meteor.methods(AC.RoomResidentModel.getServerMethods());
}
// Register model
AC.ModelManager.register("AC.RoomResidentModel", AC.RoomResidentModel);