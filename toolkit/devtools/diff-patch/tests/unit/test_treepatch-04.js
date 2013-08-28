/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test patching simple objects.

const { patch } = require("devtools/object-diff-patch");

function run_test() {
  testAddProperties();
  testRemoveProperties();
  testRemoveObject();
  testRemoveArray();
  testAssignProperties();
  testAssignObject();
}

function testAddProperties() {
  const o = patch({ foo: 10 }, [
    { path: ["bar"], edit: { assign: 11 } },
    { path: ["baz"], edit: { assign: 12 } },
  ]);
  do_check_eq(o.foo, 10);
  do_check_eq(o.bar, 11);
  do_check_eq(o.baz, 12);
}

function testRemoveProperties() {
  const o = patch({ foo: 10, bar: 11, baz: 12 }, [
    { path: ["bar"], edit: { delete: 11 }},
    { path: ["baz"], edit: { delete: 12 }},
  ]);
  do_check_eq(o.foo, 10);
  do_check_eq(o.bar, undefined);
  do_check_eq(o.baz, undefined);
}

function testRemoveObject() {
  const o = patch({ foo: {} }, [
    { path: ["foo"], edit: { delete: {} }},
  ]);
  do_check_eq(o.foo, undefined);
}

function testRemoveArray() {
  const o = patch({ foo: [] }, [
    { path: ["foo"], edit: { delete: [] }},
  ]);
  do_check_eq(o.foo, undefined);
}

function testAssignProperties() {
  const o = patch({ bar: 1 }, [
    { path: ["bar"], edit: { assign: 2 } }
  ]);
  do_check_eq(o.bar, 2);
}

function testAssignObject() {
  const o = patch(null, [
    { path: [], edit: { assign: {} } },
    { path: ["bar"], edit: { assign: 1 } }
  ]);
  do_check_eq(o.bar, 1);
}
