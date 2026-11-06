"use strict";

/*
 * Application code for the FinCore transaction-history example.
 *
 * FinCore supplies the Button and Input CSS only. This file owns the demo
 * dataset, filtering, rendering, status text and focus return.
 */

const LOCALE = "en-US";
const CURRENCY = "USD";

const transactions = [
  {
    id: "demo-01",
    date: "2026-10-24",
    description: "Weekly grocery shop at the local market",
    reference: "CARD-4821-1024",
    amountCents: -8420,
    status: "Completed",
  },
  {
    id: "demo-02",
    date: "2026-10-23",
    description: "Monthly salary payment",
    reference: "PAY-2026-10-0912",
    amountCents: 420000,
    status: "Completed",
  },
  {
    id: "demo-03",
    date: "2026-10-22",
    description: "Monthly rent payment",
    reference: "DD-RENT-4821",
    amountCents: -185000,
    status: "Completed",
  },
  {
    id: "demo-04",
    date: "2026-10-21",
    description:
      "International transfer to a supplier for quarterly software licensing and support renewal",
    reference: "REF-2026-Q4-SW-LICENCE-004821",
    amountCents: -249900,
    status: "Pending",
  },
  {
    id: "demo-05",
    date: "2026-10-20",
    description: "Coffee and breakfast",
    reference: "CARD-4821-1020",
    amountCents: -1275,
    status: "Completed",
  },
  {
    id: "demo-06",
    date: "2026-10-19",
    description: "Refund for cancelled hotel booking",
    reference: "RFND-77120",
    amountCents: 32450,
    status: "Completed",
  },
  {
    id: "demo-07",
    date: "2026-10-18",
    description: "Electricity and gas bill",
    reference: "DD-UTIL-3310",
    amountCents: -14230,
    status: "Completed",
  },
  {
    id: "demo-08",
    date: "2026-10-17",
    description: "Transfer to savings account",
    reference: "SAV-2026-1017",
    amountCents: -50000,
    status: "Completed",
  },
  {
    id: "demo-09",
    date: "2026-10-16",
    description: "Annual design software subscription",
    reference: "SUB-2026-0042",
    amountCents: -29900,
    status: "Failed",
  },
  {
    id: "demo-10",
    date: "2026-10-15",
    description: "Interest earned on current balance",
    reference: "INT-2026-1015",
    amountCents: 1842,
    status: "Completed",
  },
];

const TOTAL = transactions.length;

const currencyFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const form = document.getElementById("example-filter-form");
const filterInput = document.getElementById("example-filter");
const clearButton = document.getElementById("example-clear");
const tableRows = document.getElementById("example-rows");
const tableWrap = document.getElementById("example-table-wrap");
const listView = document.getElementById("example-list");
const emptyState = document.getElementById("example-empty");
const emptyTerm = document.getElementById("example-empty-term");
const statusRegion = document.getElementById("example-status");

function formatAmount(amountCents) {
  const sign = amountCents < 0 ? "-" : "+";
  return sign + currencyFormat.format(Math.abs(amountCents) / 100);
}

function formatDate(isoDate) {
  return dateFormat.format(new Date(`${isoDate}T12:00:00Z`));
}

function buildRow(transaction) {
  const row = document.createElement("tr");
  row.dataset.transactionId = transaction.id;

  const dateCell = document.createElement("td");
  dateCell.className = "example-date";
  const time = document.createElement("time");
  time.dateTime = transaction.date;
  time.textContent = formatDate(transaction.date);
  dateCell.append(time);

  const descriptionCell = document.createElement("td");
  descriptionCell.className = "example-description";
  descriptionCell.textContent = transaction.description;

  const referenceCell = document.createElement("td");
  referenceCell.className = "example-reference";
  referenceCell.textContent = transaction.reference;

  const amountCell = document.createElement("td");
  amountCell.className = "example-amount";

  const amount = document.createElement("span");
  amount.className = "example-amount-value";
  amount.textContent = formatAmount(transaction.amountCents);

  const separator = document.createElement("span");
  separator.className = "example-sr-only";
  separator.textContent = ", ";

  const direction = document.createElement("span");
  direction.className = "example-direction";
  direction.textContent = transaction.amountCents < 0 ? "Debit" : "Credit";

  amountCell.append(amount, separator, direction);

  const statusCell = document.createElement("td");
  statusCell.className = "example-status-cell";
  statusCell.textContent = transaction.status;

  row.append(dateCell, descriptionCell, referenceCell, amountCell, statusCell);
  return row;
}

function buildCard(transaction) {
  const item = document.createElement("li");
  item.className = "example-card";
  item.dataset.transactionId = transaction.id;

  const head = document.createElement("div");
  head.className = "example-card__head";

  const description = document.createElement("p");
  description.className = "example-card__description";
  description.textContent = transaction.description;

  const amountBlock = document.createElement("p");
  amountBlock.className = "example-card__amount";

  const amount = document.createElement("span");
  amount.className = "example-amount-value";
  amount.textContent = formatAmount(transaction.amountCents);

  const separator = document.createElement("span");
  separator.className = "example-sr-only";
  separator.textContent = ", ";

  const direction = document.createElement("span");
  direction.className = "example-direction";
  direction.textContent = transaction.amountCents < 0 ? "Debit" : "Credit";

  amountBlock.append(amount, separator, direction);
  head.append(description, amountBlock);

  const meta = document.createElement("dl");
  meta.className = "example-card__meta";

  const addMeta = (label, value) => {
    const term = document.createElement("dt");
    term.textContent = label;

    const definition = document.createElement("dd");
    if (typeof value === "string") definition.textContent = value;
    else definition.append(value);

    meta.append(term, definition);
  };

  const time = document.createElement("time");
  time.dateTime = transaction.date;
  time.textContent = formatDate(transaction.date);

  addMeta("Date", time);
  addMeta("Status", transaction.status);
  addMeta("Reference", transaction.reference);

  item.append(head, meta);
  return item;
}

function render(records, term) {
  tableRows.replaceChildren(...records.map(buildRow));
  listView.replaceChildren(...records.map(buildCard));

  const hasResults = records.length > 0;
  tableWrap.hidden = !hasResults;
  listView.hidden = !hasResults;
  emptyState.hidden = hasResults;

  if (hasResults) {
    statusRegion.textContent = term
      ? `Showing ${records.length} of ${TOTAL} demo transactions matching “${term}”.`
      : `Showing all ${TOTAL} demo transactions.`;
    return;
  }

  emptyTerm.textContent = `“${term}”`;
  statusRegion.textContent = `No demo transactions match “${term}”.`;
}

function applyFilter() {
  const term = filterInput.value.trim();
  const normalised = term.toLowerCase();
  const records = normalised
    ? transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(normalised),
      )
    : transactions;

  render(records, term);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilter();
});

clearButton.addEventListener("click", () => {
  filterInput.value = "";
  render(transactions, "");
  filterInput.focus();
});

render(transactions, "");
