const BASE_RATE = 0.007;
const VAT = 0.16;

const MONTH_RATES = {
  3: 0.035,
  6: 0.055,
  9: 0.085,
  12: 0.115,
};

const tabs = document.querySelectorAll(".calc-tab");
const regularLine = document.getElementById("regularLine");
const monthsLine = document.getElementById("monthsLine");

const stepRegularInput = document.getElementById("step-regular-input");
const stepRegularResult = document.getElementById("step-regular-result");
const stepMonthsSelect = document.getElementById("step-months-select");
const stepMonthsResult = document.getElementById("step-months-result");

const amountRegular = document.getElementById("amountRegular");
const amountMonths = document.getElementById("amountMonths");

const btnRegularNext = document.getElementById("btnRegularNext");
const btnRegularReset = document.getElementById("btnRegularReset");
const btnMonthsCalculate = document.getElementById("btnMonthsCalculate");
const btnMonthsReset = document.getElementById("btnMonthsReset");

const regularResultTitle = document.getElementById("regularResultTitle");
const regularResultAmount = document.getElementById("regularResultAmount");
const regularCommission = document.getElementById("regularCommission");
const regularVat = document.getElementById("regularVat");
const regularTotalFee = document.getElementById("regularTotalFee");

const monthsResultTitle = document.getElementById("monthsResultTitle");
const monthsResultAmount = document.getElementById("monthsResultAmount");
const monthsBaseAmount = document.getElementById("monthsBaseAmount");
const monthsExtraRate = document.getElementById("monthsExtraRate");
const monthsExtraAmount = document.getElementById("monthsExtraAmount");
const monthsVat = document.getElementById("monthsVat");
const monthsTotalFee = document.getElementById("monthsTotalFee");
const monthsTotalRate = document.getElementById("monthsTotalRate");

const monthsPicker = document.getElementById("monthsPicker");
const monthsInlinePicker = document.getElementById("monthsInlinePicker");

let selectedMonths = 3;

function formatMoney(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

function showStep(step) {
  [
    stepRegularInput,
    stepRegularResult,
    stepMonthsSelect,
    stepMonthsResult,
  ].forEach((el) => {
    el.classList.remove("active");
  });
  step.classList.add("active");
}

function setMode(mode) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });

  regularLine.classList.toggle("active", mode === "regular");
  monthsLine.classList.toggle("active", mode === "months");

  if (mode === "regular") {
    showStep(stepRegularInput);
  } else {
    showStep(stepMonthsSelect);
  }
}

function setMonths(months) {
  selectedMonths = Number(months);

  document.querySelectorAll(".month-chip").forEach((btn) => {
    btn.classList.toggle(
      "active",
      Number(btn.dataset.month) === selectedMonths,
    );
  });

  if (stepMonthsResult.classList.contains("active")) {
    calculateMonths();
  }
}

function calculateRegular() {
  const amount = parseFloat(amountRegular.value);

  if (!amount || amount <= 0) {
    amountRegular.focus();
    return;
  }

  const commission = amount * BASE_RATE;
  const vat = commission * VAT;
  const totalFee = commission + vat;
  const received = amount - totalFee;

  regularResultTitle.textContent = `Para una venta de ${formatMoney(amount)} recibes`;
  regularResultAmount.textContent = formatMoney(received);
  regularCommission.textContent = formatMoney(commission);
  regularVat.textContent = formatMoney(vat);
  regularTotalFee.textContent = formatMoney(totalFee);

  showStep(stepRegularResult);
}

function calculateMonths() {
  const amount = parseFloat(amountMonths.value);

  if (!amount || amount <= 0) {
    amountMonths.focus();
    return;
  }

  const extraRate = MONTH_RATES[selectedMonths] || 0;
  const baseCommission = amount * BASE_RATE;
  const extra = amount * extraRate;
  const vat = (baseCommission + extra) * VAT;
  const totalFee = baseCommission + extra + vat;
  const received = amount - totalFee;
  const totalRate = BASE_RATE + extraRate + (BASE_RATE + extraRate) * VAT;

  monthsResultTitle.textContent = `Para una venta de ${formatMoney(amount)} recibes`;
  monthsResultAmount.textContent = formatMoney(received);
  monthsBaseAmount.textContent = formatMoney(baseCommission);
  monthsExtraRate.textContent = `${(extraRate * 100).toFixed(2)}%`;
  monthsExtraAmount.textContent = formatMoney(extra);
  monthsVat.textContent = formatMoney(vat);
  monthsTotalFee.textContent = formatMoney(totalFee);
  monthsTotalRate.textContent = `${(totalRate * 100).toFixed(2)}%`;

  showStep(stepMonthsResult);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setMode(tab.dataset.mode));
});

btnRegularNext.addEventListener("click", calculateRegular);
btnRegularReset.addEventListener("click", () => {
  amountRegular.value = "";
  showStep(stepRegularInput);
  amountRegular.focus();
});

btnMonthsCalculate.addEventListener("click", calculateMonths);
btnMonthsReset.addEventListener("click", () => {
  amountMonths.value = "";
  showStep(stepMonthsSelect);
  amountMonths.focus();
});

[monthsPicker, monthsInlinePicker].forEach((container) => {
  container.addEventListener("click", (event) => {
    const btn = event.target.closest(".month-chip");
    if (!btn) return;
    setMonths(btn.dataset.month);
  });
});

amountRegular.addEventListener("keydown", (event) => {
  if (event.key === "Enter") calculateRegular();
});

amountMonths.addEventListener("keydown", (event) => {
  if (event.key === "Enter") calculateMonths();
});

setMode("regular");
setMonths(3);
