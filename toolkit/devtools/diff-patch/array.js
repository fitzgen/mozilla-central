/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 * Diff two arrays.
 *
 * @param Array a
 *        The first array to compare.
 * @param Array b
 *        The second array to compare.
 * @param Function createInsert
 *        A function that creates an "insert" edit.
 */
module.exports = function (a, b, { createInsert, createDelete, createUpdate, cost }) {
  const m = a.length;
  const n = b.length;
  const d = createMatrix(m + 1, n + 1);

  // Fill in the base cases.
  d[0][0] = theEmptyDiffList;
  for (let i = 1; i <= m; i++) {
    // Trivial deletes
    d[i][0] = diffListNode(createDelete(a[i-1], 0),
                           d[i-1][0],
                           cost);
  }
  for (let j = 1; j <= n; j++) {
    // Trivial inserts
    d[0][j] = diffListNode(createInsert(b[j-1], j-1),
                           d[0][j-1],
                           cost);
  }

  // Use dynamic programming to efficiently find a solution by building upon the
  // solutions to sub-problems. This is similar to calculating edit distance,
  // but we keep track of the edits along the way rather than just counting
  // them.
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = min(
        // Insert item from `b`.
        diffListNode(createInsert(b[j-1], j-1),
                     d[i][j-1],
                     cost),
        // Delete item in `a`.
        diffListNode(createDelete(a[i-1], j),
                     d[i-1][j],
                     cost),
        // Change `a[i]` into `b[j]`.
        diffListNode(createUpdate(a[j-1], b[j-1], j-1),
                     d[i-1][j-1],
                     cost)
      );
    }
  }

  // Follow the path back through the matrix and collect aggregate our
  // differences.

  let reversed = [];
  for (let node = d[m][n]; node != null; node = node.prev) {
    reversed.push(node);
  }
  return reversed.reverse();
}

// Helpers

/**
 * Create a persistent, immutable, singly linked list of differences.
 *
 * `diffListNode`s have the following properties:
 *
 *   - cost: The aggregate length of all changes in and ahead of this node in
 *             this `diffListNode`.
 *   - difference: The sub-difference; an array of changes.
 *   - prev: If present, the `diffListNode` preceding this one.
 *
 * @param difference
 *        The difference for this node.
 * @param prev
 *        The `diffListNode` that is the preceding this one. Optional.
 * @returns a `diffListNode`.
 */
function diffListNode(difference=null, prev=null, cost=null) {
  const diffCost = difference ? cost(difference) : 0;
  return Object.preventExtensions(Object.create(null, {
    cost: {
      value: prev ? prev.cost + diffCost : diffCost,
      configurable: false,
      writable: false,
      enumerable: false
    },
    difference: {
      value: difference,
      configurable: false,
      writable: false,
      enumerable: false
    },
    prev: {
      value: prev,
      configurable: false,
      writable: false,
      enumerable: false
    }
  }));
};

const theEmptyDiffList = diffListNode();

/**
 * Create an m x n matrix.
 */
function createMatrix(m, n) {
  let d = new Array(m);
  for (let i = 0; i < m; i++) {
    d[i] = new Array(n);
  }
  return d;
}

/**
 * Return the diffListNode that has the least cost.
 */
function min(minDiff, ...choices) {
  for (let d of choices) {
    if (d.cost < minDiff.cost) {
      minDiff = d;
    }
  }
  return minDiff;
}

function dumpMatrix(d) {
  dump("===================================================\n");
  for (let col of d) {
    for (let row of col) {
      if (row) {
        dump(row.length);
        for (let i = 0, n = 5 - String(row.length).length; i < n; i++) {
          dump(" ");
        }
      } else {
        dump("null ");
      }
    }
    dump("\n");
  }
  dump("===================================================\n");
}

