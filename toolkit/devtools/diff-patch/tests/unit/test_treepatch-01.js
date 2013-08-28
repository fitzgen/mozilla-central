/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test diffing complex objects.

const { diff } = require("devtools/object-diff-patch");
Cu.import("resource://gre/modules/reflect.jsm");

function run_test() {
  testEquivalent();
  // testNestedArrayShifts();
  // testAssignObjectArray();
  // testSmallDifference();
  // testLargeDifference();
}

function testEquivalent() {
  const foo = Reflect.parse("const a = 10;");
  const bar = Reflect.parse("const a = 10;");
  const difference = diff(foo, bar);
  dump("FITZGEN: foo = " + JSON.stringify(foo, null, 2) + "\n");
  dump("FITZGEN: bar = " + JSON.stringify(bar, null, 2) + "\n");
  dump("FITZGEN: difference = " + JSON.stringify(difference, null, 2) + "\n");
  do_check_eq(diff(foo, bar).length, 0);
}

function testNestedArrayShifts() {
  const [insertObj1, assign1, insertObj2, assign2] = diff([], [{ foo: 1 }, { bar: 2 }]);

  do_check_eq_paths(insertObj1.path, [0]);
  do_check_eq(Object.keys(insertObj1.edit.insert).length, 0);

  do_check_eq_paths(assign1.path, [0, "foo"]);
  do_check_eq(assign1.edit.assign, 1);

  do_check_eq_paths(insertObj2.path, [1]);
  do_check_eq(Object.keys(insertObj2.edit.insert).length, 0);

  do_check_eq_paths(assign2.path, [1, "bar"]);
  do_check_eq(assign2.edit.assign, 2);
}

function testAssignObjectArray() {
  const [delete1, assignEmpty, insert3] = diff({ foo: 1 }, [3]);

  do_check_eq_paths(delete1.path, ["foo"]);
  do_check_eq(delete1.edit.delete, 1);

  do_check_eq_paths(assignEmpty.path, []);
  do_check_eq(assignEmpty.edit.assign.length, 0);

  do_check_eq_paths(insert3.path, [0]);
  do_check_eq(insert3.edit.insert, 3);
}

function testSmallDifference() {
  const foo = Reflect.parse("const a = 10;");
  const bar = Reflect.parse("const b = 10;");
  const [assignB] = diff(foo, bar);
  do_check_eq_paths(assignB.path, ["body", 0, "declarations", 0, "id", "name"]);
  do_check_eq(assignB.edit.assign, "b");
}

function testLargeDifference() {
  const foo = Reflect.parse("" + function main() {
    // let a = 10;
    // let b = 3;
    return a + b;
  });
  const bar = Reflect.parse("" + function main() {
    // for (let i = 0; i < 10; i ++) {
      console.log(i);
    // }
  });

  const difference = diff(foo, bar);

  // Just test that we didn't get one big delete and one big insert on the body
  // of the program.
  do_check_true(difference.length > 2);
  do_check_true(difference.every(edit => {
    return !(edit.path.length === 2
             && edit.path[0] === "body"
             && edit.path[1] === 0);
  }));
}
