/* -*- Mode: js; js-indent-level: 2; -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

// Test patching complex objects.

const { diff, patch } = require("devtools/object-diff-patch");
Cu.import("resource://gre/modules/reflect.jsm");

function run_test() {
  testAssignObjectArray();
  testNestedArrayShifts();
  testAssignNestedObject();
  testDeleteNestedObject();
  // testSmallDifference();
  // testLargeDifference();
}

function testAssignObjectArray() {
  const a = patch({ foo: 1 }, [
    { path: ["foo"], edit: { delete: 1 } },
    { path: [], edit: { assign: [] } },
    { path: [0], edit: { insert: 3 } },
  ]);
  do_check_eq(a.length, 1);
  do_check_eq(a[0], 3);
}

function testNestedArrayShifts() {
  const a = patch([], [
    { "path": [0], "edit": { "insert": {} } },
    { "path": [0, "foo"], "edit": { "assign": 1 } },
    { "path": [1], "edit": { "insert": {} } },
    { "path": [1, "bar"], "edit": { "assign": 2 } },
  ]);
  do_check_eq(a.length, 2);
  do_check_eq(a[0].foo, 1);
  do_check_eq(a[1].bar, 2);
}

function testAssignNestedObject() {
  const o = patch({}, diff({}, { foo: { bar: 1 }, baz: { bang: 2 } }));
  do_check_eq(Object.keys(o).length, 2);
  do_check_eq(o.foo.bar, 1);
  do_check_eq(Object.keys(o.foo).length, 1);
  do_check_eq(o.baz.bang, 2);
  do_check_eq(Object.keys(o.baz).length, 1);
}

function testDeleteNestedObject() {
  const difference = diff({ foo: { bar: 1 },
                            baz: { bang: 2 } },
                          {});
  dumpJSON(difference);
  const o = patch({ foo: { bar: 1 },
                    baz: { bang: 2 } },
                  difference);
  do_check_eq(o.foo, undefined);
  do_check_eq(o.baz, undefined);
}

function testSmallDifference() {
  const foo = Reflect.parse("const a = 10;");
  const bar = Reflect.parse("const b = 10;");

  const newAst = patch(foo, diff(foo, bar));
  checkEquivalentASTs(newAst, bar);
}

function testLargeDifference() {
  const foo = Reflect.parse("" + function main() {
    // let a = 10;
    // let b = 3;
    // return a + b;
    a + b;
  });
  const bar = Reflect.parse("" + function main() {
    // for (let i = 0; i < 10; i ++) {
    //   console.log(i);
    // }
    console.log(b);
  });

  const difference = diff(foo, bar);
  dump(JSON.stringify(difference, null, 2) + "\n");
  const newAst = patch(foo, difference);
  checkEquivalentASTs(bar, newAst);
}

const isObject = (obj) => typeof obj === "object" && obj !== null;
const zip = (a, b) => {
  let pairs = [];
  for (let i = 0; i < a.length && i < b.length; i++) {
    pairs.push([a[i], b[i]]);
  }
  return pairs;
};

function checkEquivalentASTs(expected, actual, prop = []) {
  dump("FITZGEN: checking: " + prop.join(" ") + "\n");
  dump("FITZGEN:   expected = " + JSON.stringify(expected, null, 2) + "\n");
  dump("FITZGEN:   actual = " + JSON.stringify(actual, null, 2) + "\n");

  if (!isObject(expected)) {
    return void do_check_eq(expected, actual);
  }

  do_check_true(isObject(actual));

  if (Array.isArray(expected)) {
    do_check_true(Array.isArray(actual));
    do_check_eq(expected.length, actual.length);
    let i = 0;
    for (let [e, a] of zip(expected, actual)) {
      checkEquivalentASTs(a, e, prop.concat([i++]));
    }
    return;
  }

  const expectedKeys = Object.keys(expected)
    .filter(k => expected[k] !== undefined)
    .sort();
  const actualKeys = Object.keys(actual)
    .filter(k => expected[k] !== undefined)
    .sort();
  do_check_eq(expectedKeys.length, actualKeys.length);
  for (let [ek, ak] of zip(expectedKeys, actualKeys)) {
    do_check_eq(ek, ak);
    checkEquivalentASTs(expected[ek], actual[ak], prop.concat([ek]));
  }
}
