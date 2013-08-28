/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test patching simple values.

const { patch } = require("devtools/object-diff-patch");

function run_test() {
  testNumbers();
  testStrings();
  testNull();
  testUndefined();
  testNaN();
  testInfinity();
  testNested();
}

function testNumbers() {
  do_check_eq(5, patch(10, [{ path: [], edit: { assign: 5 } }]));
}

function testStrings() {
  do_check_eq("bar", patch("foo", [{ path: [], edit: { assign: "bar" } }]));
}

function testNull() {
  do_check_eq(10, patch(null, [{ path: [], edit: { assign: 10 } }]));
  do_check_eq(null, patch(10, [{ path: [], edit: { assign: null } }]));
}

function testUndefined() {
  do_check_eq(10, patch(undefined, [{ path: [], edit: { assign: 10 } }]));
  do_check_eq(undefined, patch(10, [{ path: [], edit: { assign: undefined } }]));
}

function testNaN() {
  do_check_eq(10, patch(NaN, [{ path: [], edit: { assign: 10 } }]));
  do_check_true(isNaN(patch(10, [{ path: [], edit: { assign: NaN } }])));
}

function testInfinity() {
  do_check_eq(10, patch(Infinity, [{ path: [], edit: { assign: 10 } }]));
  do_check_eq(Infinity, patch(10, [{ path: [], edit: { assign: Infinity } }]));
}

function testNested() {
  const obj = patch({ foo: { bar: 10 } },
                    [{ path: ["foo", "bar"], edit: { assign: 13 } }]);
  do_check_eq(obj.foo.bar, 13);
}
