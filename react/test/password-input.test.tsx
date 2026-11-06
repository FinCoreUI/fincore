import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { PasswordInput } from "../password-input/index.tsx";

test("PasswordInput basic rendering and toggle behavior", () => {
  const { getByLabelText, getByRole } = render(
    React.createElement(PasswordInput, { label: "Account Password" })
  );

  const input = getByLabelText("Account Password") as HTMLInputElement;
  const toggleBtn = getByRole("button");

  assert.equal(input.tagName, "INPUT");
  assert.equal(input.type, "password");
  assert.equal(toggleBtn.getAttribute("aria-pressed"), "false");
  assert.equal(toggleBtn.textContent, "Show password");

  // Toggle to visible
  fireEvent.click(toggleBtn);
  assert.equal(input.type, "text");
  assert.equal(toggleBtn.getAttribute("aria-pressed"), "true");
  assert.equal(toggleBtn.textContent, "Hide password");

  // Toggle back to hidden
  fireEvent.click(toggleBtn);
  assert.equal(input.type, "password");
  assert.equal(toggleBtn.getAttribute("aria-pressed"), "false");
});

test("PasswordInput preserves input value during toggle", () => {
  const { getByLabelText, getByRole } = render(
    React.createElement(PasswordInput, {
      label: "Password",
      defaultValue: "SecretValue123!"
    })
  );

  const input = getByLabelText("Password") as HTMLInputElement;
  const toggleBtn = getByRole("button");

  assert.equal(input.value, "SecretValue123!");
  assert.equal(input.type, "password");

  fireEvent.click(toggleBtn);
  assert.equal(input.type, "text");
  assert.equal(input.value, "SecretValue123!");
});

test("PasswordInput controlled visibility and callbacks", () => {
  let toggled = false;
  let currentVisible = true;

  const { getByLabelText, getByRole, rerender } = render(
    React.createElement(PasswordInput, {
      label: "Password",
      visible: currentVisible,
      onVisibleChange: (v) => {
        toggled = true;
        currentVisible = v;
      }
    })
  );

  const input = getByLabelText("Password") as HTMLInputElement;
  const toggleBtn = getByRole("button");

  assert.equal(input.type, "text");
  assert.equal(toggleBtn.getAttribute("aria-pressed"), "true");

  fireEvent.click(toggleBtn);
  assert.equal(toggled, true);
  assert.equal(currentVisible, false);

  rerender(
    React.createElement(PasswordInput, {
      label: "Password",
      visible: false
    })
  );
  assert.equal(input.type, "password");
});

test("PasswordInput error state and accessible descriptions", () => {
  const { getByLabelText, getByRole, rerender } = render(
    React.createElement(PasswordInput, {
      label: "Password",
      helperText: "Minimum 8 characters."
    })
  );

  const input = getByLabelText("Password") as HTMLInputElement;
  assert.equal(input.getAttribute("aria-invalid"), null);

  rerender(
    React.createElement(PasswordInput, {
      label: "Password",
      errorMessage: "Password cannot be empty."
    })
  );
  assert.equal(input.getAttribute("aria-invalid"), "true");
});

test("PasswordInput disabled state disables both field and toggle", () => {
  const { getByLabelText, getByRole } = render(
    React.createElement(PasswordInput, {
      label: "Password",
      disabled: true
    })
  );

  const input = getByLabelText("Password") as HTMLInputElement;
  const toggleBtn = getByRole("button") as HTMLButtonElement;

  assert.equal(input.disabled, true);
  assert.equal(toggleBtn.disabled, true);

  // Clicking disabled toggle should not change type
  toggleBtn.click();
  assert.equal(input.type, "password");
});

test("PasswordInput forwardRef support", () => {
  const ref = createRef<HTMLInputElement>();
  render(
    React.createElement(PasswordInput, {
      label: "Password",
      ref
    })
  );
  assert.equal(ref.current?.tagName, "INPUT");
});

test("PasswordInput preserves short and long entered values without error", () => {
  const longValue = "A".repeat(120) + "!@#$%" + "z".repeat(120);
  const { getByLabelText, getByRole, rerender } = render(
    React.createElement(PasswordInput, {
      label: "Master Password",
      defaultValue: longValue
    })
  );

  const input = getByLabelText("Master Password") as HTMLInputElement;
  const toggleBtn = getByRole("button");

  assert.equal(input.value, longValue);
  assert.equal(input.type, "password");

  fireEvent.click(toggleBtn);
  assert.equal(input.type, "text");
  assert.equal(input.value, longValue);

  // Short value test
  rerender(
    React.createElement(PasswordInput, {
      label: "Master Password",
      defaultValue: "short1"
    })
  );
  fireEvent.click(toggleBtn);
  assert.equal(input.type, "password");
});
