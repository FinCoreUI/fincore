import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import ReactTestUtils from "react-dom/test-utils";
import { PhoneInput } from "../phone-input/index.tsx";

test("Nigeria (+234)", () => {
  const { container } = render(
    React.createElement(PhoneInput, { label: "Phone", defaultCountry: "NG" })
  );
  const select = container.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  assert.equal(select.value, "NG");
  const options = Array.from(select.options);
  const ngOption = options.find(o => o.value === "NG");
  assert.ok(ngOption);
  
  const results: any[] = [];
  const { container: c2 } = render(
    React.createElement(PhoneInput, { label: "Phone2", onChange: (r:any)=>results.push(r) })
  );
  const input2 = c2.querySelector('.fc-phone-input__field') as HTMLInputElement;
  ReactTestUtils.Simulate.change(input2, { target: { value: "+2348031234567" } });
  const valid = results[results.length - 1];
  assert.equal(valid.status, "valid");
  assert.equal(valid.isValid, true);
  assert.equal(valid.e164, "+2348031234567");
  
  const { container: c3 } = render(React.createElement(PhoneInput, { label: "Phone3" }));
  const input3 = c3.querySelector('.fc-phone-input__field') as HTMLInputElement;
  input3.value = "08031234567";
  const evt = new window.Event('change', { bubbles: true });
  Object.defineProperty(evt, 'target', { value: input3 });
  input3.dispatchEvent(evt);
  assert.equal((c3.querySelector('.fc-phone-input__field') as HTMLInputElement).value, "08031234567");
  
  const results2: any[] = [];
  const { container: c4 } = render(
    React.createElement(PhoneInput, { label: "Phone4", onChange: (r:any)=>results2.push(r) })
  );
  const input4 = c4.querySelector('.fc-phone-input__field') as HTMLInputElement;
  ReactTestUtils.Simulate.change(input4, { target: { value: "+234803" } });
  const partial = results2[results2.length - 1];
  assert.equal(partial.isValid, false);
});

test("US and Canada shared calling code +1", () => {
  const { container } = render(
    React.createElement(PhoneInput, { label: "Phone", countries: ["US", "CA"] })
  );
  const select = container.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  const options = Array.from(select.options).map(o => o.value).filter(v => v);
  assert.deepEqual(new Set(options), new Set(["US", "CA"]));
  
  const results: any[] = [];
  const { container: c2 } = render(
    React.createElement(PhoneInput, { label: "Phone2", countries: ["US", "CA"], onChange: (r:any)=>results.push(r) })
  );
  const input2 = c2.querySelector('.fc-phone-input__field') as HTMLInputElement;
  ReactTestUtils.Simulate.change(input2, { target: { value: "+1" } });
  const partial = results[results.length - 1];
  assert.equal(partial.isValid, false);
  
  const { container: c3 } = render(
    React.createElement(PhoneInput, { label: "Phone3", countries: ["US", "CA"], country: "CA" })
  );
  const select3 = c3.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  assert.equal(select3.value, "CA");
  
  const { container: c4 } = render(
    React.createElement(PhoneInput, { label: "Phone4", countries: ["US", "CA"] })
  );
  const input4 = c4.querySelector('.fc-phone-input__field') as HTMLInputElement;
  input4.value = "+1234567890";
  const evt = new window.Event('change', { bubbles: true });
  Object.defineProperty(evt, 'target', { value: input4 });
  input4.dispatchEvent(evt);
  const select4 = c4.querySelector('.fc-phone-input__country-select') as HTMLSelectElement;
  ReactTestUtils.Simulate.change(select4, { target: { value: "US" } });
  assert.equal((c4.querySelector('.fc-phone-input__field') as HTMLInputElement).value, "+1234567890");
});
