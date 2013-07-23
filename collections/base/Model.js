/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * @class AC.Model
 */
AC.Model = AC.Base.extend({
  //
  // Model attributes
  //
  _attributes: {},

  //
  // Calculated attributes
  //
  _calculatedAttributes: {},

  //
  // Model constructor
  //
  constructor: function(instance) {
    var me = this;

    //
    // Reference model
    //
    instance.__model = me;

    //
    // Returns the collection instance
    //
    me.getInstance = function() {
      return instance;
    };

    //
    // Returns a cloned object with the defined attributes
    //
    me.clone = function() {
      var clone = {};
      _.each(me._attributes, function(v, k) {
        clone[k] = this[k];
      }, instance);

      return clone;
    };

    //
    // Calculate additional attributes
    //
    _.each(me._calculatedAttributes, function(v, k) {
      if (typeof(v) === "function") {
        this[k] = v(this);
      }
    }, instance);

    AC.Model.__super__.constructor.call(this);
  }
}, {
  //
  // Model indexes
  //
  _indexes: [],

  //
  // Collection name
  //
  _collectionName: undefined,

  //
  // Server methods
  //
  _serverMethods: undefined,
  getServerMethods: function() {
    var log, methodName, methods = {}, me = this;
    log = me.log();
    _.each(this._serverMethods, function(value, key) {
      methodName = me._collectionName + "." + key;
      methods[methodName] = value;
      log("Exposing method: ", methodName);
    });
    return methods;
  },

  //
  // Server method stubs
  //
  _serverMethodStubs: undefined,
  getServerMethodStubs: function() {
    var log, methodName, methods = {}, me = this;
    log = me.log();
    _.each(this._serverMethodStubs, function(value, key) {
      methodName = me._collectionName + "." + key;
      methods[methodName] = value;
      log("Exposing method: ", methodName);
    });
    return methods;
  },

  //
  // Static methods / client & server
  //
  _staticMethods: undefined,
  applyStaticMethods: function(meteorCollection) {
    var log, me = this;
    log = me.log();
    if (me._staticMethods && typeof(me._staticMethods) === "object" && meteorCollection) {
      _.each(me._staticMethods, function(value, key) {
        meteorCollection[key] = value;
        log("Binding static method: ", key);
      });
    }
  },

  //
  // Register indexes
  //
  registerIndexes: function() {
    var log, me = this, collection = global[me._collectionName];
    log = this.log();
    if (collection && _.isArray(this._indexes)) {
      _.each(this._indexes, function(i) {
        if (_.isArray(i) && i.length === 2) {
          collection._ensureIndex(i[0], i[1]);
        } else {
          collection._ensureIndex(i);
        }
        log("Registering index: ", me._collectionName, i);
      });
    }
  },

  //
  // Log singleton for base operation logging
  //
  log: function() {
    if (this._log === undefined) {
      this._log = console.log;
    }
    return this._log;
  }
});