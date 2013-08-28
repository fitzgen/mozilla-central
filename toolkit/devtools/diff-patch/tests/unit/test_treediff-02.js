/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test diffing simple arrays.

const { diff } = require("devtools/object-diff-patch");

function run_test() {
  testAssignArray();
  testInsertIntoArray();
  testAssignInsertArray();
  testDeleteFromArray();
  testAssignDeleteArray();
  testAssignSimpleArray();
}

function testAssignArray() {
  const d = diff([1,2,3], [3,2,1]);
  dumpJSON(d);
  const [assign3, assign1] = d;

  do_check_eq_paths(assign3.path, [0]);
  do_check_eq(assign3.edit.assign, 3);

  do_check_eq_paths(assign1.path, [2]);
  do_check_eq(assign1.edit.assign, 1);
}

function testInsertIntoArray() {
  const d = diff([], [4,5,6]);
  dumpJSON(d);
  const [insert4, insert5, insert6] = d;

  do_check_eq_paths(insert4.path, [0]);
  do_check_eq(insert4.edit.insert, 4);

  do_check_eq_paths(insert5.path, [1]);
  do_check_eq(insert5.edit.insert, 5);

  do_check_eq_paths(insert6.path, [2]);
  do_check_eq(insert6.edit.insert, 6);
}

function testAssignInsertArray() {
  const d = diff([2], [1,3]);
  dumpJSON(d);
  const [assign1, insert3] = d;

  do_check_eq_paths(assign1.path, [0]);
  do_check_eq(assign1.edit.assign, 1);

  do_check_eq_paths(insert3.path, [1]);
  do_check_eq(insert3.edit.insert, 3);
}

function testDeleteFromArray() {
  const [delete7, delete8, delete9] = diff([7,8,9], []);

  do_check_eq_paths(delete7.path, [0]);
  do_check_eq(delete7.edit.delete, 7);

  do_check_eq_paths(delete8.path, [0]);
  do_check_eq(delete8.edit.delete, 8);

  do_check_eq_paths(delete9.path, [0]);
  do_check_eq(delete9.edit.delete, 9);
}

function testAssignDeleteArray() {
  const [assign3, delete1] = diff([2, 1], [3]);

  do_check_eq_paths(assign3.path, [0]);
  do_check_eq(assign3.edit.assign, 3);

  do_check_eq_paths(delete1.path, [1]);
  do_check_eq(delete1.edit.delete, 1);
}

function testAssignSimpleArray() {
  const d = diff(null, [1]);
  dumpJSON(d);
  const [assignEmpty, insert1] = d;

  do_check_eq_paths(assignEmpty.path, []);
  do_check_eq(assignEmpty.edit.assign.length, 0);

  do_check_eq_paths(insert1.path, [0]);
  do_check_eq(insert1.edit.insert, 1);
}
