"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
exports.sleep = sleep;
