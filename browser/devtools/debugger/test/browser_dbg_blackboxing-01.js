/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Test that if we blackbox a source and then refresh, it is still blackboxed.
 */

const TAB_URL = EXAMPLE_URL + "binary_search.html";

var gPane = null;
var gTab = null;
var gDebuggee = null;
var gDebugger = null;

function test()
{
  let scriptShown = false;
  let framesAdded = false;
  let resumed = false;
  let testStarted = false;

  debug_tab_pane(TAB_URL, function(aTab, aDebuggee, aPane) {
    resumed = true;
    gTab = aTab;
    gDebuggee = aDebuggee;
    gPane = aPane;
    gDebugger = gPane.panelWin;

    testBlackboxSource();
  });
}

function testBlackboxSource() {
  once(gDebugger, "Debugger:SourceShown", function () {
    const checkbox = gDebugger.document.querySelector(".side-menu-widget-item-checkbox");
    ok(checkbox, "Should get the checkbox for blackboxing the source");
    ok(checkbox.checked, "Should not be blackboxed by default");

    once(gDebugger, "Debugger:BlackboxChange", function (event) {
      const sourceClient = event.detail;
      ok(sourceClient.isBlackBoxed, "The source should be blackboxed now");
      ok(!checkbox.checked, "The checkbox should no longer be checked.");

      testBlackboxReload();
    });

    checkbox.click();
  });
}

function testBlackboxReload() {
  once(gDebugger, "Debugger:SourceShown", function () {
    const checkbox = gDebugger.document.querySelector(".side-menu-widget-item-checkbox");
    ok(checkbox, "Should get the checkbox for blackboxing the source");
    ok(!checkbox.checked, "Should still be blackboxed");

    closeDebuggerAndFinish();
  });

  gDebuggee.location.reload();
}

function once(target, event, callback) {
  target.addEventListener(event, function _listener(...args) {
    target.removeEventListener(event, _listener, false);
    callback.apply(null, args);
  }, false);
}

registerCleanupFunction(function() {
  removeTab(gTab);
  gPane = null;
  gTab = null;
  gDebuggee = null;
  gDebugger = null;
});
