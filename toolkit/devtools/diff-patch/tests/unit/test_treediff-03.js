/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test diffing simple objects.

const { diff } = require("devtools/object-diff-patch");

function run_test() {
  testAddProperties();
  testRemoveProperties();
  testAssignProperties();
  testAssignObject();
  testDeleteObject();
  testSameObject();
}

function testAddProperties() {
  const d = diff({
    foo: 10
  }, {
    foo: 10,
    bar: 11,
    baz: 12
  });
  const [addBar, addBaz] = d;

  do_check_eq_paths(addBar.path, ["bar"]);
  do_check_eq(addBar.edit.assign, 11);

  do_check_eq_paths(addBaz.path, ["baz"]);
  do_check_eq(addBaz.edit.assign, 12);
}

function testRemoveProperties() {
  const [delBar, delBaz] = diff({
    foo: 10,
    bar: 11,
    baz: 12
  }, {
    foo: 10
  });

  do_check_eq_paths(delBar.path, ["bar"]);
  do_check_eq(delBar.edit.delete, 11);

  do_check_eq_paths(delBaz.path, ["baz"]);
  do_check_eq(delBaz.edit.delete, 12);
}

function testAssignProperties() {
  const [assignBar] = diff({ bar: 1 }, { bar: 2 });
  do_check_eq_paths(assignBar.path, ["bar"]);
  do_check_eq(assignBar.edit.assign, 2);
}

function testAssignObject() {
  const [assignEmpty, assign1] = diff(null, { bar: 1 });

  do_check_eq_paths(assignEmpty.path, []);
  do_check_eq(Object.keys(assignEmpty.edit.assign).length, 0);

  do_check_eq_paths(assign1.path, ["bar"]);
  do_check_eq(assign1.edit.assign, 1);
}

function testDeleteObject() {
  const difference = diff({ delete: { me: 1 } }, null);
  dump("FITZGEN: difference = "); dumpJSON(difference);
  do_check_eq(difference.length, 5);
  const [del1, delObj1, delDelete, delObj2, assignNull] = difference;

  do_check_eq_paths(del1.path, ["delete", "me"]);
  do_check_eq(del1.edit.delete, 1);

  do_check_eq_paths(delObj1.path, ["delete"]);
  do_check_eq(Object.keys(delObj1.edit.delete).length, 0);

  do_check_eq_paths(delDelete.path, ["delete"]);
  do_check_eq(Object.keys(delDelete.edit.delete).length, 0);

  do_check_eq_paths(delObj2.path, []);
  do_check_eq(Object.keys(delObj2.edit.delete).length, 0);

  do_check_eq_paths(assignNull.path, []);
  do_check_eq(assignNull.edit.assign, null);
}

function testSameObject() {
  let d = diff({}, {});
  do_check_eq(d.length, 0);

  d = diff({ foo: 1 }, { foo: 1 });
  do_check_eq(d.length, 0);

  d = diff({ foo: { bar: 3 }, baz: 2 }, { foo: { bar: 3 }, baz: 2 });
  do_check_eq(d.length, 0);
}
