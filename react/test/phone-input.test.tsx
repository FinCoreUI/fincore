import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { PhoneInput } from "../phone-input/index.tsx";

test("PhoneInput basic", () => {
  const { getByLabelText } = render(React.createElement(PhoneInput, { label: "Phone" }));
  const input = getByLabelText("Phone") as HTMLInputElement;
  assert.equal(input.tagName, "INPUT");
  assert.ok(input.classList.contains("fc-phone-input__field"));
  assert.equal(input.getAttribute("type"), "tel");
  
  // Empty
  assert.equal(input.value, "");
  
  // Controlled preserves editing string
  const { container: c2 } = render(React.createElement(PhoneInput, { label: "Phone", value: "+1" }));
  assert.equal((c2.querySelector('.fc-phone-input__field') as HTMLInputElement).value, "+1");
});

test("PhoneInput accessibility", () => {
  const { getByLabelText, getByText, rerender } = render(React.createElement(PhoneInput, { label: "Phone", helperText: "Include country code" }));
  const input = getByLabelText("Phone") as HTMLInputElement;
  const helper = getByText("Include country code");
  assert.ok(helper.classList.contains("fc-phone-input__message"));
  assert.ok(input.getAttribute("aria-describedby")?.includes(helper.id));
  
  rerender(React.createElement(PhoneInput, { label: "Phone", errorMessage: "Invalid number" }));
  const input2 = getByLabelText("Phone") as HTMLInputElement;
  const error = getByText("Invalid number");
  assert.ok(error.classList.contains("fc-phone-input__message--error"));
  assert.equal(input2.getAttribute("aria-invalid"), "true");
  
  const ref = createRef<HTMLInputElement>();
  rerender(React.createElement(PhoneInput, { label: "Phone", ref }));
  assert.equal(ref.current?.tagName, "INPUT");
  
  rerender(React.createElement(PhoneInput, { label: "Phone", disabled: true, required: true }));
  const input3 = getByLabelText("Phone") as HTMLInputElement;
  assert.equal(input3.hasAttribute("disabled"), true);
  assert.equal(input3.hasAttribute("required"), true);
});
