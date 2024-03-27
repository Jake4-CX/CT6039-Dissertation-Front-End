import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

global.ResizeObserver = require('resize-observer-polyfill');

afterEach(() => {
  cleanup();
});