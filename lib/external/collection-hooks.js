/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * Forked from: http://stackoverflow.com/questions/13143450/how-to-alter-object-server-side-before-save-in-meteor
 */
(function () {

  var directInsert, directUpdate, directRemove, triggeredInsert, triggeredUpdate, triggeredRemove;

  function delegate() {
    var i, len, c;
    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    var verb = args.shift();

    if (this._x_matb33_hooks && this._x_matb33_hooks[type] && this._x_matb33_hooks[type][verb]) {
      for (i = 0, len = this._x_matb33_hooks[type][verb].length; i < len; i++) {
        c = this._x_matb33_hooks[type][verb][i];
        if (typeof c === "function") {
          if (c.apply(this, args) === false) {
            return false;
          }
        }
      }
    }
  }

  function getUserId() {
    if (Meteor._CurrentInvocation.get()) {
      return Meteor.userId();
    } else {
      // this.userId will likely not be defined because no one usually
      // invokes collection.insert with a `.call(this)`... But if they
      // do, userId will be available to the end-callback.
      return this.userId || null;
    }
  }

  directInsert = Meteor.Collection.prototype.insert;
  directUpdate = Meteor.Collection.prototype.update;
  directRemove = Meteor.Collection.prototype.remove;

  // These are invoked when the method is called directly on the collection
  // from either the server or client. These are adapted to match the
  // function signature of the triggered version (adding userId)

  Meteor.Collection.prototype.insert = function (doc, callback) {
    var result, userId = getUserId.call(this);

    if (delegate.call(this, "before", "insert", userId, doc, callback) !== false) {
      result = directInsert.call(this, doc, callback);
      delegate.call(this, "after", "insert", userId, doc, callback);
    }

    return result;
  };

  Meteor.Collection.prototype.update = function (selector, modifier, options, callback) {
    var result, previous, userId = getUserId.call(this);

    if (delegate.call(this, "before", "update", userId, selector, modifier, options, callback) !== false) {
      previous = this._collection.find(selector, {reactive: false}).fetch();
      result = directUpdate.call(this, selector, modifier, options, callback);
      delegate.call(this, "after", "update", userId, selector, modifier, options, previous, callback);
    }

    return result;
  };

  Meteor.Collection.prototype.remove = function (selector, callback) {
    var result, previous, userId = getUserId.call(this);

    if (delegate.call(this, "before", "remove", userId, selector, callback) !== false) {
      previous = this._collection.find(selector, {reactive: false}).fetch();
      result = directRemove.call(this, selector, callback);
      delegate.call(this, "after", "remove", userId, selector, previous, callback);
    }

    return result;
  };

  if (Meteor.isServer) {
    triggeredInsert = Meteor.Collection.prototype._validatedInsert;
    triggeredUpdate = Meteor.Collection.prototype._validatedUpdate;
    triggeredRemove = Meteor.Collection.prototype._validatedRemove;

    // These are triggered on the server, but only when a client initiates
    // the method call. They act similarly to observes, but simply hi-jack
    // _validatedInsert. Note that the "before" hook doesn't care/know about
    // allow/deny rules, so be wary of this in terms of security and
    // integrity.

    Meteor.Collection.prototype._validatedInsert = function (userId, doc, callback) {
      var result;

      if (delegate.call(this, "before", "insert", userId, doc, callback) !== false) {
        result = triggeredInsert.call(this, userId, doc);
        if (result === undefined) {
          delegate.call(this, "after", "insert", userId, doc, callback);
        }
      }

      return result;
    };

    Meteor.Collection.prototype._validatedUpdate = function (userId, selector, modifier, options, callback) {
      var result, previous;

      if (delegate.call(this, "before", "update", userId, selector, modifier, options, previous, callback) !== false) {
        previous = this._collection.find(selector, {reactive: false}).fetch();
        result = triggeredUpdate.call(this, userId, selector, modifier, options);
        if (result === undefined) {
          delegate.call(this, "after", "update", userId, selector, modifier, options, previous, callback);
        }
      }

      return result;
    };

    Meteor.Collection.prototype._validatedRemove = function (userId, selector, callback) {
      var result, previous;

      if (delegate.call(this, "before", "remove", userId, selector, previous, callback) !== false) {
        previous = this._collection.find(selector, {reactive: false}).fetch();
        result = triggeredRemove.call(this, userId, selector);
        if (result === undefined) {
          delegate.call(this, "after", "remove", userId, selector, previous, callback);
        }
      }

      return result;
    };
  }

  _.each(["before", "after"], function (type) {
    Meteor.Collection.prototype[type] = function (verb, callback) {
      if (!this._x_matb33_hooks) this._x_matb33_hooks = {};
      if (!this._x_matb33_hooks[type]) this._x_matb33_hooks[type] = {};
      if (!this._x_matb33_hooks[type][verb]) this._x_matb33_hooks[type][verb] = [];

      this._x_matb33_hooks[type][verb].push(callback);
    };
  });

  if (Meteor.isClient) {
    Meteor.Collection.prototype.when = function (condition, callback) {
      var self = this;
      Deps.autorun(function (c) {
        if (condition.call(self._collection)) {
          c.stop();
          callback.call(self._collection);
        }
      });
    };
  }

})();