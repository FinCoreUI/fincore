import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import ReactTestUtils from "react-dom/test-utils";
import { PhoneInput } from "../phone-input/index.tsx";

test("PhoneInput onChange states", () => {
  const results: any[] = [];
  const { container } = render(
    React.createElement(PhoneInput, { 
      label: "Phone", 
      onChange: (r: any) => results.push(r) 
    })
  );
  const input = container.querySelector('.fc-phone-input__field') as HTMLInputElement;
  
  ReactTestUtils.Simulate.change(input, { target: { value: "" } });
  assert.ok(results.length > 0);
  const empty = results[results.length - 1];
  assert.equal(empty.status, "empty");
  assert.equal(empty.isValid, false);
  assert.equal(empty.inputValue, "");
  
  results.length = 0;
  ReactTestUtils.Simulate.change(input, { target: { value: "+123" } });
  const partial = results[results.length - 1];
  assert.equal(partial.inputValue, "+123");
  assert.equal(partial.isValid, false);
  assert.ok(partial.status === "incomplete" || partial.status === "invalid");
  assert.equal(partial.e164, undefined);
  
  results.length = 0;
  ReactTestUtils.Simulate.change(input, { target: { value: "+12125551234" } });
  const valid = results[results.length - 1];
  assert.equal(valid.isValid, true);
  assert.equal(valid.status, "valid");
  assert.equal(valid.e164, "+12125551234");
  
  results.length = 0;
  ReactTestUtils.Simulate.change(input, { target: { value: "abc" } });
  const invalid = results[results.length - 1];
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.e164, undefined);
});

test("PhoneInput country selection", () => {
  const { container } = render(
    React.createElement(PhoneInput, { 
      label: "Phone",
      defaultCountry: "GB"
    })
  );
  const select = container.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  assert.equal(select.value, "GB");
  
  const { container: c2 } = render(
    React.createElement(PhoneInput, { 
      label: "Phone2",
      country: "US",
      defaultCountry: "GB"
    })
  );
  const select2 = c2.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  assert.equal(select2.value, "US");
  
  const { container: c3 } = render(
    React.createElement(PhoneInput, { label: "Phone3" })
  );
  const input3 = c3.querySelector('.fc-phone-input__field') as HTMLInputElement;
  input3.value = "+44";
  const evt = new window.Event('change', { bubbles: true });
  Object.defineProperty(evt, 'target', { value: input3 });
  input3.dispatchEvent(evt);
  const select3 = c3.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  ReactTestUtils.Simulate.change(select3, { target: { value: "CA" } });
  assert.equal((c3.querySelector('.fc-phone-input__field') as HTMLInputElement).value, "+44");
  
  const { container: c4 } = render(
    React.createElement(PhoneInput, { label: "Phone4", countries: ["US", "CA"] })
  );
  const select4 = c4.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  const options = Array.from(select4.options).map(o => o.value).filter(v => v);
  assert.deepEqual(new Set(options), new Set(["US", "CA"]));
});

test("PhoneInput controlled/uncontrolled", () => {
  const { container } = render(
    React.createElement(PhoneInput, { label: "Phone", defaultValue: "+1" })
  );
  const input = container.querySelector('.fc-phone-input__field') as HTMLInputElement;
  assert.equal(input.value, "+1");
  
  const { container: c2 } = render(
    React.createElement(PhoneInput, { label: "Phone2", value: "+44" })
  );
  const input2 = c2.querySelector('.fc-phone-input__field') as HTMLInputElement;
  assert.equal(input2.value, "+44");
  
  const { container: c3 } = render(
    React.createElement(PhoneInput, { label: "Phone3" })
  );
  const input3 = c3.querySelector('.fc-phone-input__field') as HTMLInputElement;
  input3.value = "+123456";
  const evt = new window.Event('change', { bubbles: true });
  Object.defineProperty(evt, 'target', { value: input3 });
  input3.dispatchEvent(evt);
  assert.equal((c3.querySelector('.fc-phone-input__field') as HTMLInputElement).value, "+123456");
});
