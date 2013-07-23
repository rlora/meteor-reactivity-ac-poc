/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * @class AC.ModelManager
 */
AC.ModelManager = function() {
  var models = {};
  return {
    register: function(name, collection) {
      models[name] = collection;
    },
    get: function(name) {
      return models[name];
    },
    getNames: function() {
      return _.map(models, function(v, k) {
        return k;
      });
    },
    getModels: function() {
      return _.map(models, function(v) {
        return v;
      });
    },
    getCollections: function() {
      return _.map(models, function(v) {
        var scope = (typeof(window) === "object") ? window : global;
        return scope[v._collectionName];
      });
    },
    getCollectionNames: function() {
      return _.map(models, function(v) {
        return v._collectionName;
      });
    }
  };
}();