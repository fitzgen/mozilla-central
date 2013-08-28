/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Public API

module.exports = {
  diff: diff,
  patch: patch
};

/**
 * Return the difference between two JS values `a` and `b` such that patching
 * `a` with the difference will make it equivalent to `b`.
 *
 * A difference is a list of changes. A change has a path and an edit.
 *
 * @param {any} a
 *        The first JS value to compare.
 * @param {any} b
 *        The second JS value to compare.
 * @returns array of { path, edit }
 */
function diff(a, b, _path=[]) {
  if (eq(a, b)) {
    return [];
  }

  if (isSimple(a)) {
    return assignObjectChanges(b, _path);
  }

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  const bothAreArrays = aIsArray && bIsArray;
  const oneIsArray = (aIsArray || bIsArray) && !bothAreArrays;

  if (isSimple(b) || oneIsArray) {
    return deleteObjectChanges(a, _path).concat(assignObjectChanges(b, _path));
  }

  if (bothAreArrays) {
    return arrayDiff(a, b, _path);
  }

  // Both are objects.
  return objectDiff(a, b, _path);
}

/**
 * Returns `obj` patched with `difference`.
 *
 * Note that `obj` might be modified in place.
 *
 * @param {any} obj
 *        The JS value we are applying the difference to.
 * @param Array difference
 *        The array of { path, edit } as returned by `diff`.
 * @returns The patched object.
 */
function patch(obj, difference) {
  if (difference.length === 0) {
    return obj;
  }

  const [{ path, edit }] = difference;
  const lastPath = path[path.length - 1];

  if ("assign" in edit) {
    obj = assign(obj, path, edit.assign);
  } else if ("insert" in edit) {
    if ((lastPath|0) !== lastPath) {
      throw new Error(
        "Bad path. Can only insert into arrays with integer indexing, got "
          + lastPath);
    }
    insert(obj, path, edit.insert);
  } else if ("delete" in edit) {
    if (!path.length) {
      throw new Error("Bad path. Must have a path to apply a 'delete' edit.");
    }
    if ((lastPath|0) === lastPath) {
      arrayDelete(obj, path, edit.delete);
    } else {
      objectDelete(obj, path, edit.delete);
    }
  } else {
    throw new Error("Unknown edit type: " + uneval(edit));
  }

  return patch(obj, difference.slice(1));
}

// Patching helper functions

function dumpJSON(obj) {
  dump(JSON.stringify(obj, null, 2) + "\n");
}

/**
 * Check that the simple values a and b are equivalent. Empty objects and empty
 * arrays are also permitted.
 */
function eq(a, b) {
  if (a === b) {
    return true;
  }
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }
  if (isSimple(a) || isSimple(b)) {
    return false;
  }
  if (!(isEmpty(a) && isEmpty(b))) {
    return false;
  }
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  const bothAreArrays = aIsArray && bIsArray;
  const oneIsArray = (aIsArray || bIsArray) && !bothAreArrays;
  return !oneIsArray;
}

/**
 * Assign `value` to the property referenced by `path` starting at `obj`.
 */
function assign(obj, path, value) {
  if (path.length === 0) {
    return value;
  }
  const [prop] = path;
  if (path.length > 1 && !obj.hasOwnProperty(prop)) {
    throw new Error("Bad path found when patching object. path = "
                    + uneval(path)
                    + ", obj = " + uneval(obj));
  }
  obj[prop] = assign(obj[prop], path.slice(1), value);
  return obj;
}

/**
 * Insert `value` to the property referenced by `path` starting at `obj`.
 */
function insert(obj, path, value) {
  const [prop] = path;
  if (path.length === 1) {
    if (!Array.isArray(obj)) {
      throw new Error("Bad path. Can only insert into arrays.");
    }
    obj.splice(prop, 0, value);
    return;
  }
  if (!obj.hasOwnProperty(prop)) {
    throw new Error("Bad path found when patching object.");
  }
  insert(obj[prop], path.slice(1), value);
}

/**
 * Delete `value` from the array at the property referenced by `path` starting
 * at `obj`.
 */
function arrayDelete(obj, path, value) {
  const [prop] = path;
  if (path.length === 1) {
    if (!Array.isArray(obj)) {
      throw new Error("Bad path. With integer indexing, can only delete from arrays.");
    }
    const valToBeDeleted = obj[prop];
    if (!eq(valToBeDeleted, value)) {
      throw new Error("Expected to delete " + value + ", instead found " + valToBeDeleted);
    }
    obj.splice(prop, 1);
    return;
  }
  if (!obj.hasOwnProperty(prop)) {
    throw new Error("Bad path found when patching object.");
  }
  arrayDelete(obj[prop], path.slice(1), value);
}

/**
 * Delete `value` from the object at the property referenced by `path` starting
 * at `obj`.
 */
function objectDelete(obj, path, value) {
  const [prop] = path;
  if (path.length === 1) {
    const valToBeDeleted = obj[prop];
    if (!eq(valToBeDeleted, value)) {
      throw new Error("Expected to delete " + value + ", instead found " + valToBeDeleted);
    }
    obj[prop] = undefined;
    return;
  }
  if (!obj.hasOwnProperty(prop)) {
    throw new Error("Bad path found when patching object.");
  }
  objectDelete(obj[prop], path.slice(1), value);
}

// Diffing helper functions

const arrayDiff = require("./diff-array");
const isObject = obj => typeof obj === "object" && obj !== null;
const isSimple = obj => !isObject(obj);
const propIsntUndef = obj => k => obj[k] !== undefined;
const definedProperties = obj => Object.keys(obj).filter(propIsntUndef(obj));
const isEmpty = obj => definedProperties(obj).length === 0;
const isSimpleOrEmpty = obj => isSimple(obj) || isEmpty(obj);

/**
 * Yields [key, value] pairs for objects and arrays.
 */
function iterItems(obj) {
  if (Array.isArray(obj)) {
    let i = 0;
    for (let val of obj) {
      yield [i++, val];
    }
  } else if (isObject(obj)) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  } else {
    throw new Error("Can't iterate over " + obj);
  }
}

// Change constructors.
const prettyStack = stack => stack.split(/\n/g).map(l => l.split(/ \-> /g).pop());
const changes = {
  insert: (path, value) =>
    ({ path: path, edit: { insert: value } }),
  assign: (path, value) =>
    ({ path: path, edit: { assign: value } }),
  delete: (path, value) =>
    ({ path: path, edit: { delete: value } })
};

function simplestForType(obj) {
  if (isSimple(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return [];
  }
  return {};
}

/**
 * Return the list of changes that will create and insert the given object.
 */
function insertObjectChanges(obj, path) {
  if (isSimple(obj)) {
    return [changes.insert(path, obj)];
  }

  let difference = [changes.insert(path, simplestForType(obj))];
  for (let [key, value] of iterItems(obj)) {
    [].push.apply(difference, diff(undefined, value, path.concat(key)));
  }
  return difference;
}

/**
 * Return the list of changes that will break down and delete the given object.
 */
function deleteObjectChanges(obj, path) {
  if (isSimple(obj)) {
    return [changes.delete(path, obj)];
  }

  let difference = [];
  for (let [key, value] of iterItems(obj)) {
    [].push.apply(difference, diff(value, undefined, path.concat(key)));
    difference.pop();
    difference.push(changes.delete(path.concat(key), simplestForType(value)));
  }
  return difference;
}

/**
 * Return the list of changes that will assign the given path to the given
 * object.
 */
function assignObjectChanges(obj, path) {
  if (isSimple(obj)) {
    return [changes.assign(path, obj)];
  }

  let difference = [changes.assign(path, simplestForType(obj))];
  for (let [key, value] of iterItems(obj)) {
    [].push.apply(difference, diff(undefined, value, path.concat(key)));
    if (Array.isArray(obj)) {
      let change = difference.pop();
      difference.push(changes.insert(change.path, change.edit.assign));
    }
  }
  return difference;
}

/**
 * Diff two objects.
 */
function objectDiff(a, b, path) {
  const aProps = new Set(definedProperties(a));
  const bProps = new Set(definedProperties(b));
  const difference = [];

  for (let x of aProps) {
    if (bProps.has(x)) {
      // Properties of the same name in `a` and `b`, which might need to be
      // updated.
      [].push.apply(difference, diff(a[x], b[x], path.concat(x)));
    } else {
      // Properties missing from `b` that must be removed from `a`.
      [].push.apply(difference, deleteObjectChanges(a[x], path.concat(x)));
    }
  }

  // Properties found in `b` that must be added to `a`.
  for (let x of bProps) {
    if (!aProps.has(x)) {
      [].push.apply(difference, assignObjectChanges(b[x], path.concat(x)));
    }
  }

  return difference;
}
