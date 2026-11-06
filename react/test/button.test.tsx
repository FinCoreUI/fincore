import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { Button } from "../button/index.tsx";

test("Button basic", () => {
  const { getByRole, rerender } = render(React.createElement(Button, null, "Click me"));
  const btn = getByRole("button");
  assert.equal(btn.tagName, "BUTTON");
  assert.ok(btn.classList.contains("fc-button"));
  assert.ok(btn.classList.contains("fc-button--primary"));
  assert.equal(btn.getAttribute("type"), "button");
  
  rerender(React.createElement(Button, { variant: "secondary" }, "Secondary"));
  assert.ok(getByRole("button").classList.contains("fc-button--secondary"));
  
  rerender(React.createElement(Button, { variant: "ghost" }, "Ghost"));
  assert.ok(getByRole("button").classList.contains("fc-button--ghost"));
  
  rerender(React.createElement(Button, { type: "submit" }, "Submit"));
  assert.equal(getByRole("button").getAttribute("type"), "submit");
  
  rerender(React.createElement(Button, { disabled: true }, "Disabled"));
  assert.equal(getByRole("button").hasAttribute("disabled"), true);
  
  rerender(React.createElement(Button, { className: "custom" }, "Test"));
  const b = getByRole("button");
  assert.ok(b.classList.contains("fc-button"));
  assert.ok(b.classList.contains("custom"));
  
  let clicked = false;
  rerender(React.createElement(Button, { onClick: () => { clicked = true; } }, "Click"));
  getByRole("button").click();
  assert.equal(clicked, true);
  
  const ref = createRef<HTMLButtonElement>();
  rerender(React.createElement(Button, { ref }, "Ref"));
  assert.equal(ref.current?.tagName, "BUTTON");
});
