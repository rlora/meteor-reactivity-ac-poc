/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * @class AC.RoomTransactionModel
 */
AC.RoomTransactionModel = AC.Model.extend({
  //
  // Model attributes
  //
  _attributes: {
    "parent": {},
    "name": {},
    "action": {}
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
  _collectionName: "RoomTransactions",

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
RoomTransactions = new Meteor.Collection("roomTransactions", {
  transform: function(roomTransaction) {
    new AC.RoomTransactionModel(roomTransaction);
    return roomTransaction;
  }
});
AC.RoomTransactionModel.applyStaticMethods(RoomTransactions);

//
// Before insert hook
//
RoomTransactions.before("insert", function(userId, doc) {
  doc.updatedAt = doc.createdAt = new Date();
});

//
// Before update hook
//
RoomTransactions.before("update", function(userId, selector, modifier, options) {
  if (modifier && modifier["$set"]) {
    modifier["$set"]["updatedAt"] = new Date();
  }
});

//
// Security Allow
//
RoomTransactions.allow({
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
  Meteor.subscribe("roomTransactions");
  Meteor.methods(AC.RoomTransactionModel.getServerMethodStubs());
}

//
// Server publish
//
if (Meteor.isServer) {
  Meteor.publish("roomTransactions", function() {
    return RoomTransactions.find();
  });
  Meteor.methods(AC.RoomTransactionModel.getServerMethods());
}
// Register model
AC.ModelManager.register("AC.RoomTransactionModel", AC.RoomTransactionModel);