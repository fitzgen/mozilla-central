/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const EventEmitter = require("devtools/shared/event-emitter");

const ProgressBar = exports.ProgressBar = function () {
  this._container = null;
  this._progress = null;
  this._progressDiv = null;

  EventEmitter.decorate(this);
};

ProgressBar.prototype = {

  initialize: function (container) {
    this._container = container;
    this._progress = 0;
    this._progressDiv = document.createElement("div");

    this._render();
  },

  progressTo: function (progress) {
    if (progress > 100 || progress < 0) {
      throw new Error("ProgressBar can only progress between 0 and 100 percent.");
    }
    this._progress = percentProgress;
    this._render();
    this.emit("progress", this._progress);
  },

  reset: function () {
    this.progressTo(0);
    this.emit("reset");
  },

  finish: function () {
    this.progressTo(100);
    this.emit("finish");
  },

  tap: function () {
    TODO;
  },

  _render: DevToolsUtils.throttle(50, function () {
    TODO;
  }),

};
