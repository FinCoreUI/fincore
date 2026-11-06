"use strict";

/*
 * Application code for the FinCore payment-form example.
 *
 * FinCore supplies the Button and Input CSS only. This file owns validation,
 * review state, reset behaviour and focus management. No network request is
 * made and no payment is submitted.
 */

const DEMO_BANKS = new Map([
  ["northwind bank", "Northwind Bank"],
  ["harbor credit union", "Harbor Credit Union"],
  ["summit savings", "Summit Savings"],
]);

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formSection = document.getElementById("payment-form-section");
const form = document.getElementById("payment-form");
const statusRegion = document.getElementById("payment-status");
const clearButton = document.getElementById("payment-clear");
const reviewSection = document.getElementById("payment-review");
const reviewHeading = document.getElementById("payment-review-heading");
const editButton = document.getElementById("payment-edit");
const resetButton = document.getElementById("payment-reset");

const recipientInput = document.getElementById("recipient-name");
const recipientMessage = document.getElementById("recipient-name-message");
const accountInput = document.getElementById("account-number");
const accountMessage = document.getElementById("account-number-message");
const bankInput = document.getElementById("bank-name");
const bankMessage = document.getElementById("bank-name-message");
const referenceInput = document.getElementById("payment-reference");
const referenceMessage = document.getElementById("payment-reference-message");
const amountInput = document.getElementById("amount");
const amountMessage = document.getElementById("amount-message");

const reviewRecipient = document.getElementById("review-recipient");
const reviewAccount = document.getElementById("review-account");
const reviewBank = document.getElementById("review-bank");
const reviewReference = document.getElementById("review-reference");
const reviewAmount = document.getElementById("review-amount");

function validateRecipient(value) {
  const recipient = value.trim();
  if (recipient.length < 2) {
    return { error: "Enter a fictional recipient name with at least 2 characters." };
  }
  return { value: recipient };
}

function validateAccount(value) {
  const account = value.replace(/[\s-]/g, "").trim();
  if (!/^\d{6,17}$/.test(account)) {
    return { error: "Enter a demo account number with 6 to 17 digits." };
  }
  return { value: account };
}

function validateBank(value) {
  const canonical = DEMO_BANKS.get(value.trim().toLowerCase());
  if (!canonical) {
    return { error: "Choose Northwind Bank, Harbor Credit Union or Summit Savings." };
  }
  return { value: canonical };
}

function validateReference(value) {
  const reference = value.trim();
  if (reference.length > 18) {
    return { error: "Use 18 characters or fewer for the payment reference." };
  }
  if (reference && !/^[A-Za-z0-9 -]+$/.test(reference)) {
    return { error: "Use letters, numbers, spaces or hyphens in the payment reference." };
  }
  return { value: reference };
}

function validateAmount(value) {
  const amountText = value.trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(amountText)) {
    return { error: "Enter a demo amount between $1.00 and $5,000.00, for example 250.00." };
  }

  const amount = Number(amountText.replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
    return { error: "Enter a demo amount between $1.00 and $5,000.00, for example 250.00." };
  }

  return { value: amount };
}

const fields = [
  {
    name: "recipient",
    input: recipientInput,
    message: recipientMessage,
    validate: validateRecipient,
  },
  {
    name: "account",
    input: accountInput,
    message: accountMessage,
    validate: validateAccount,
  },
  {
    name: "bank",
    input: bankInput,
    message: bankMessage,
    validate: validateBank,
  },
  {
    name: "reference",
    input: referenceInput,
    message: referenceMessage,
    validate: validateReference,
  },
  {
    name: "amount",
    input: amountInput,
    message: amountMessage,
    validate: validateAmount,
  },
];

for (const field of fields) {
  field.helper = field.message.textContent.trim();
}

function setFieldError(field, message) {
  field.input.setAttribute("aria-invalid", "true");
  field.message.textContent = message;
  field.message.classList.add("fc-input__message--error");
}

function clearFieldError(field) {
  field.input.removeAttribute("aria-invalid");
  field.message.textContent = field.helper;
  field.message.classList.remove("fc-input__message--error");
}

function clearErrors() {
  for (const field of fields) clearFieldError(field);
}

function validateFields() {
  const values = {};
  let firstInvalid = null;

  for (const field of fields) {
    const result = field.validate(field.input.value);
    if (result.error) {
      setFieldError(field, result.error);
      if (!firstInvalid) firstInvalid = field;
    } else {
      clearFieldError(field);
      values[field.name] = result.value;
    }
  }

  return { values, firstInvalid };
}

function populateReview(values) {
  reviewRecipient.textContent = values.recipient;
  reviewAccount.textContent = values.account;
  reviewBank.textContent = values.bank;
  reviewReference.textContent = values.reference || "Not provided";
  reviewAmount.textContent = currencyFormat.format(values.amount);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const { values, firstInvalid } = validateFields();
  if (firstInvalid) {
    statusRegion.textContent = "Please correct the highlighted fields before reviewing.";
    firstInvalid.input.focus();
    return;
  }

  populateReview(values);
  formSection.hidden = true;
  reviewSection.hidden = false;
  statusRegion.textContent = "Reviewing demo payment. No payment has been sent.";
  reviewHeading.focus();
});

clearButton.addEventListener("click", () => {
  form.reset();
  clearErrors();
  formSection.hidden = false;
  reviewSection.hidden = true;
  statusRegion.textContent = "Demo payment form cleared. Enter new demo details.";
  recipientInput.focus();
});

editButton.addEventListener("click", () => {
  formSection.hidden = false;
  reviewSection.hidden = true;
  clearErrors();
  statusRegion.textContent = "Editing demo payment details.";
  recipientInput.focus();
});

resetButton.addEventListener("click", () => {
  form.reset();
  clearErrors();
  formSection.hidden = false;
  reviewSection.hidden = true;
  statusRegion.textContent = "Demo payment form cleared. Enter new demo details.";
  recipientInput.focus();
});

clearErrors();
