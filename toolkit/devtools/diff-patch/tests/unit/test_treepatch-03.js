/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test patching simple arrays.

const { patch } = require("devtools/object-diff-patch");

function run_test() {
  testAssignArray();
  testInsertIntoArray();
  testInsertIntoTwoArrays();
  testInsertAssignArray();
  testDeleteFromArray();
  testAssignDeleteArray();
  testAssignSimpleArray();
}

function testAssignArray() {
  const a = patch([1,2,3], [
    { path: [0], edit: { assign: 3 } },
    { path: [2], edit: { assign: 1 } },
  ]);
  do_check_eq(a.length, 3);
  do_check_eq(a[0], 3);
  do_check_eq(a[1], 2);
  do_check_eq(a[2], 1);
}

function testInsertIntoArray() {
  const a = patch([], [
    { path: [0], edit: { insert: 4 } },
    { path: [1], edit: { insert: 5 } },
    { path: [2], edit: { insert: 6 } },
  ]);
  do_check_eq(a.length, 3);
  do_check_eq(a[0], 4);
  do_check_eq(a[1], 5);
  do_check_eq(a[2], 6);
}

function testInsertIntoTwoArrays() {
  const a = patch({ foo: [], bar: [] }, [
    { path: ["foo", 0], edit: { insert: "uno" } },
    { path: ["bar", 0], edit: { insert: "dos" } },
  ]);
  do_check_eq(a.foo.length, 1);
  do_check_eq(a.foo[0], "uno");
  do_check_eq(a.bar.length, 1);
  do_check_eq(a.bar[0], "dos");
}

function testInsertAssignArray() {
  const a = patch([2], [
    { path: [0], edit: { assign: 1 } },
    { path: [1], edit: { insert: 3 } },
  ]);
  do_check_eq(a[0], 1);
  do_check_eq(a[1], 3);
}

function testDeleteFromArray() {
  const a = patch([7,8,9], [
    { path: [0], edit: { delete: 7 } },
    { path: [0], edit: { delete: 8 } },
    { path: [0], edit: { delete: 9 } },
  ]);
  do_check_eq(a.length, 0);
}

function testAssignDeleteArray() {
  const a = patch([2, 1], [
    { path: [0], edit: { assign: 3 } },
    { path: [1], edit: { delete: 1 } },
  ]);
  do_check_eq(a.length, 1);
  do_check_eq(a[0], 3);
}

function testAssignSimpleArray() {
  const a = patch(null, [
    { path: [], edit: { assign: [] } },
    { path: [0], edit: { insert: 1 } },
  ]);
  do_check_eq(a.length, 1);
  do_check_eq(a[0], 1);
}
