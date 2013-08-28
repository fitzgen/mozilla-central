/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test diffing simple values.

const { diff } = require("devtools/object-diff-patch");

function run_test() {
  testNumbers();
  testStrings();
  testNull();
  testUndefined();
  testNaN();
  testInfinity();
}

function testNumbers() {
  const [{ path, edit }] = diff(10, 5);
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, 5);
}

function testStrings() {
  const [{ path, edit }] = diff("foo", "bar");
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, "bar");
}

function testNull() {
  let [{ path, edit }] = diff(null, 10);
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, 10);

  ([{ path, edit }] = diff(10, null));
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, null);
}

function testUndefined() {
  let [{ path, edit }] = diff(undefined, 10);
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, 10);

  ([{ path, edit }] = diff(10, undefined));
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, undefined);
}

function testNaN() {
  let [{ path, edit }] = diff(NaN, 10);
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, 10);

  ([{ path, edit }] = diff(10, NaN));
  do_check_eq_paths(path, []);
  do_check_true(isNaN(edit.assign));
}

function testInfinity() {
  let [{ path, edit }] = diff(Infinity, 10);
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, 10);

  ([{ path, edit }] = diff(10, Infinity));
  do_check_eq_paths(path, []);
  do_check_eq(edit.assign, Infinity);
}
