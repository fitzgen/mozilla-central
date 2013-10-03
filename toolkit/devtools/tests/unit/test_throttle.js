/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test DevToolsUtils.throttle

const { setTimeout } = require("sdk/timers");

function run_test() {
  test_throttle();
  do_test_pending();
}

function test_throttle() {
  const testFuncCalledWith = [];
  const testFunc = DevToolsUtils.throttle(20, (n) => {
    do_print("testFunc called with: " + n);
    testFuncCalledWith.push(n);
  });

  // The first call should fire, then we should throttle all the other calls
  // until the 20ms waiting time is up, at which point we should call the
  // function with the last supplied arguments.

  testFunc(1);
  testFunc(2);
  testFunc(3);
  testFunc(4);
  testFunc(5);
  testFunc(6);
  testFunc(7);
  testFunc(8);
  testFunc(9);
  testFunc(10);

  setTimeout(() => {
    do_check_eq(testFuncCalledWith.length, 1);
    do_check_eq(testFuncCalledWith[0], 1);
  }, 10);

  setTimeout(() => {
    do_check_eq(testFuncCalledWith.length, 2);
    do_check_eq(testFuncCalledWith[1], 10);

    do_test_finished();
  }, 50);
}
