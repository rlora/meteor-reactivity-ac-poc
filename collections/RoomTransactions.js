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
      return {
        //
        // Create entry
        //
        "createEntry": function(roomId, action, name) {
          var room = Rooms.findOne(roomId);
          check(room, Object);
          check(action, String);
          check(name, String);
          RoomResidents.remove({
            "name": name
          });
          RoomTransactions.insert({
            "parent": roomId,
            "action": action,
            "name": name
          });
          if (action === "in") {
            RoomResidents.insert({
              "parent": roomId,
              "name": name
            });
          }
        },
        //
        // Simulate transactions using random data
        //
        "simulate": function() {
          var rooms, transactions = 300, result = Meteor.http.get(Meteor.absoluteUrl("/randomData.json"));
          // Reset transactions to avoid overloading
          RoomResidents.remove({});
          RoomTransactions.remove({});
          // Insert rooms only the first time
          rooms = Rooms.find().fetch();
          if (rooms.length === 0) {
            _.each(result.data.rooms, function(room) {
              Rooms.insert(room);
            });
            rooms = Rooms.find().fetch();
          }
          // Simulate entries
          _.times(transactions, function() {
            var person = result.data.people[_.random(result.data.people.length - 1)];
            Meteor.setTimeout(function() {
              var roomId = rooms[_.random(rooms.length - 1)]._id;
              Meteor.call("RoomTransactions.createEntry", roomId, "in", person);
              Meteor.setTimeout(function() {
                Meteor.call("RoomTransactions.createEntry", roomId, "out", person);
              }, _.random(1000, 1000 * 60));
            }, _.random(1000, 1000 * 60));
          });
        }
      };
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