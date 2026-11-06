import { JSDOM } from "jsdom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "node:test";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
if (!global.navigator) {
  global.navigator = dom.window.navigator;
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

afterEach(() => {
  cleanup();
  if (document.body) {
    document.body.innerHTML = "";
  }
});
