"use strict";
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

Cu.import("resource://gre/modules/devtools/DevToolsUtils.jsm");
Cu.import("resource://gre/modules/devtools/Loader.jsm");
const { require } = devtools;

// Register a console listener, so console messages don't just disappear
// into the ether.
let errorCount = 0;
let listener = {
  observe: function (aMessage) {
    errorCount++;
    try {
      // If we've been given an nsIScriptError, then we can print out
      // something nicely formatted, for tools like Emacs to pick up.
      var scriptError = aMessage.QueryInterface(Ci.nsIScriptError);
      dump(aMessage.sourceName + ":" + aMessage.lineNumber + ": " +
           scriptErrorFlagsToKind(aMessage.flags) + ": " +
           aMessage.errorMessage + "\n");
      var string = aMessage.errorMessage;
    } catch (x) {
      // Be a little paranoid with message, as the whole goal here is to lose
      // no information.
      try {
        var string = "" + aMessage.message;
      } catch (x) {
        var string = "<error converting error message to string>";
      }
    }

    do_throw("head_dbg.js got console message: " + string + "\n");
  }
};

let consoleService = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);
consoleService.registerListener(listener);

function do_check_eq_paths(a, b) {
  do_check_true(Array.isArray(a));
  do_check_true(Array.isArray(b));
  do_check_eq(a.length, b.length);
  for (let i = 0; i < a.length; i++) {
    do_check_eq(a[i], b[i]);
  }
}

function dumpJSON(obj) {
  dump(JSON.stringify(obj, null, 2) + "\n");
}
