/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

/**
 * Underscore Mixins
 */
_.mixin({
  pluckPairs: function(jsObject) {
    if (typeof(jsObject) === "object") {
      return _.map(jsObject, function(value, key) {
        return {"name": key, "content": value};
      });
    }
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },
  ucfirst: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  },
  formatDatetime: function(date) {
    return moment(date).format("DD-MMM-YYYY HH:mm");
  },
  deparam: function(paramString) {
    var result = {};
    if (!paramString) {
      return result;
    }
    $.each(paramString.split("&"), function(index, value) {
      if (value) {
        var param = value.split("=");
        result[param[0]] = param[1];
      }
    });
    return result;
  },
  toInt: function(value) {
    return Math.floor(value);
  },
  toMoney: function(value) {
    return _.str.numberFormat(value, 2);
  },
  buildUrl: function(/* arguments */) {
    var parts = [];
    if (typeof(Session) !== "undefined") {
      parts.push(Session.get(_.getSessionKey("culture")));
    }
    _.each(arguments, function(a){
      parts.push(a);
    });
    return parts.join("/");
  },
  collectInRows: function(collection, columnsPerRow) {
    var rows = _.reduce(collection, function(memo, e) {
      if (memo.length === 0 || (memo[memo.length - 1].length % columnsPerRow) === 0) {
        memo.push([e]);
      } else {
        memo[memo.length - 1].push(e);
      }
      return memo;
    }, []);
    return rows;
  },
  collectInPagesAndRows: function(collection, rowsPerPage, columnsPerRow) {
    var rows = _.reduce(collection, function(memo, e) {
      if (memo.length === 0 || (memo[memo.length - 1].length % columnsPerRow) === 0) {
        memo.push([e]);
      } else {
        memo[memo.length - 1].push(e);
      }
      return memo;
    }, []);
    return _.collectInRows(rows, rowsPerPage);
  },
  joinOrderedCollections: function(masterCollection, collection, joinField, attributeName) {
    var joinFields = [joinField, joinField], result = [];
    if (_.isArray(masterCollection) && _.isArray(collection)) {
      if (_.str.contains(joinField, ":")) {
        joinFields = joinField.split(":");
      }
      result = _.map(masterCollection, function(record) {
        var joinedRecord = _.find(collection, function(r) {
          return r[joinFields[0]] == record[joinFields[1]];
        });
        if (joinedRecord) {
          joinedRecord[attributeName] = record;
        }
        return joinedRecord;
      });
    }
    return _.compact(result);
  },
  initializeDebugMode: function() {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;
      template.rendered = function () {
        console.log("Performance", name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
  }
});