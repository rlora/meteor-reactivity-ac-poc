/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

//
// Handlebars helpers
//
Handlebars.registerHelper("formatDatetime", function(when) {
  return _.formatDatetime(when);
});
Handlebars.registerHelper("localize", function(/* arguments */) {
  var text = _.localize.apply(this, arguments);
  return new Handlebars.SafeString(text);
});
Handlebars.registerHelper("culture", function() {
  return Session.get(_.getSessionKey("culture")) ? Session.get(_.getSessionKey("culture")) : "en";
});
Handlebars.registerHelper("collectInRows", function(collection, columnsPerRow) {
  return _.collectInRows(collection, columnsPerRow);
});
Handlebars.registerHelper("collectInPagesAndRows", function(collection, rowsPerPage, columnsPerRow) {
  return _.collectInPagesAndRows(collection, rowsPerPage, columnsPerRow);
});
Handlebars.registerHelper("toMoney", function(value) {
  return _.toMoney(value);
});
Handlebars.registerHelper("humanizeDate", function(value) {
  return moment(value).fromNow();
});