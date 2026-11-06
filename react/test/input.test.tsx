import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { Input } from "../input/index.tsx";

test("Input basic", () => {
  const { getByLabelText, getByText, container, rerender, getAllByRole } = render(React.createElement(Input, { label: "Email" }));
  const input = getByLabelText("Email");
  assert.equal(input.tagName, "INPUT");
  assert.ok(input.classList.contains("fc-input__field"));
  const label = getByText("Email");
  assert.ok(label.classList.contains("fc-input__label"));
  assert.equal(label.getAttribute("for"), input.getAttribute("id"));
  
  rerender(React.createElement(Input, { label: "Email", helperText: "We'll email you" }));
  const input2 = getByLabelText("Email");
  const helper = getByText("We'll email you");
  assert.ok(helper.classList.contains("fc-input__message"));
  assert.ok(input2.getAttribute("aria-describedby")?.includes(helper.id));
  
  rerender(React.createElement(Input, { label: "Email", helperText: "Helper", errorMessage: "Invalid email" }));
  const input3 = getByLabelText("Email");
  const error = getByText("Invalid email");
  assert.ok(error.classList.contains("fc-input__message--error"));
  assert.equal(container.querySelectorAll('[class*="fc-input__message"]').length, 1);
  assert.equal(input3.getAttribute("aria-invalid"), "true");
  
  const result = render(React.createElement(React.Fragment, null, 
    React.createElement(Input, { label: "A" }),
    React.createElement(Input, { label: "B" })
  ));
  const inputs = result.getAllByRole("textbox");
  assert.notEqual(inputs[0].getAttribute("id"), inputs[1].getAttribute("id"));
  
  const ref = createRef<HTMLInputElement>();
  rerender(React.createElement(Input, { label: "Ref", ref }));
  assert.equal(ref.current?.tagName, "INPUT");
  
  rerender(React.createElement(Input, { label: "X", disabled: true, required: true, type: "email" }));
  const input4 = getByLabelText("X");
  assert.equal(input4.hasAttribute("disabled"), true);
  assert.equal(input4.hasAttribute("required"), true);
  assert.equal(input4.getAttribute("type"), "email");
});
