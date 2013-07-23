/* jshint indent: 2 */
/*
 * Copyright (C) 2013 Aramcheck. AC POC.
 * Rolando Lora <rolando.lora@gmail.com>
 * Cochabamba, Bolivia.
 *
 */

//
// Application entry point
//
Meteor.startup(function() {
  _.each(AC.ModelManager.getModels(), function(m) {
    m.registerIndexes();
  });
});
