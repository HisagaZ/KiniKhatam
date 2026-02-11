const TOTAL_PAGES = 604;
const CIRCUMFERENCE = 2 * Math.PI * 90;

const inputProgressCircle = document.getElementById("inputProgressCircle");
const resultProgressCircle = document.getElementById("resultProgressCircle");
const inputView = document.getElementById("inputView");
const resultView = document.getElementById("resultView");
const errorEl = document.getElementById("inputError");

// ===== Initialize Circles =====
if (inputProgressCircle) {
  inputProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
  inputProgressCircle.style.strokeDashoffset = CIRCUMFERENCE;
}

if (resultProgressCircle) {
  resultProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
}

// ===== Circle Update =====
function updateCircle(circle, value, total) {
  if (!circle) return;
  const percent = value / total;
  const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

// ===== Premium Number Flicker Animation =====
function animateNumber(elementId, finalValue, duration = 800) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let startTime = null;

  function flicker(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    if (progress < duration) {
      el.textContent = Math.floor(Math.random() * 99) + 1;
      requestAnimationFrame(flicker);
    } else {
      el.textContent = finalValue;
    }
  }

  requestAnimationFrame(flicker);
}

// ===== MAIN CALCULATION =====
function calculateAndShowResult() {
  const pagesInput = document.getElementById("pagesInput");
  const pagesTodayInput = document.getElementById("pagesTodayInput");
  const prayerSelect = document.getElementById("prayerSelect");

  let pagesRead = parseInt(pagesInput.value);
  let pagesToday = parseInt(pagesTodayInput.value);

  // ===== VALIDATION =====

  // Current page required
  if (isNaN(pagesRead) || pagesRead < 0) {
    errorEl.textContent = "Please enter your current page.";
    errorEl.style.display = "block";
    return;
  }

  // Pages today cannot exceed current page
  if (!isNaN(pagesToday) && pagesToday > pagesRead) {
    errorEl.textContent =
      "Pages read today cannot be more than current page.";
    errorEl.style.display = "block";
    return;
  }

  errorEl.style.display = "none";

  // Safe values
  pagesRead = Math.max(0, Math.min(pagesRead, TOTAL_PAGES));
  pagesToday = Math.max(0, pagesToday || 0);

  const selectedPrayer = prayerSelect
    ? prayerSelect.value
    : "fajr";

  let pagesLeftTotal = TOTAL_PAGES - pagesRead;

  // ===== DATE CALCULATION =====
  const targetDate = new Date("2026-03-19T23:59:59");
  const today = new Date();
  const timeDiff = targetDate - today;
  const daysRemaining = Math.max(
    1,
    Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  );

  // ===== TODAY CALCULATION =====
  let remainingToday =
    Math.ceil(pagesLeftTotal / daysRemaining) - pagesToday;
  remainingToday = Math.max(0, remainingToday);

  let prayersLeftToday = 5;

  switch (selectedPrayer) {
    case "fajr":
      prayersLeftToday = 5;
      break;
    case "zuhr":
      prayersLeftToday = 4;
      break;
    case "asr":
      prayersLeftToday = 3;
      break;
    case "maghrib":
      prayersLeftToday = 2;
      break;
    case "isha":
      prayersLeftToday = 1;
      break;
  }

  let pagesPerPrayerToday = Math.ceil(
    remainingToday / prayersLeftToday
  );

  // ===== FUTURE CALCULATION =====
  const pagesLeftForNextDay =
    pagesLeftTotal - pagesToday - remainingToday;

  const remainingDaysNext = Math.max(
    1,
    daysRemaining - 1
  );

  let dailyPagesNext = Math.ceil(
    pagesLeftForNextDay / remainingDaysNext
  );

  let dailyPerPrayerNext = Math.ceil(
    dailyPagesNext / 5
  );

  // ===== UPDATE INPUT CIRCLE =====
  updateCircle(inputProgressCircle, pagesRead, TOTAL_PAGES);
  document.getElementById("pageValueInput").textContent = pagesRead;
  document.getElementById("pageValueResult").textContent = pagesRead;

  // ===== SWITCH VIEW =====
  inputView.classList.add("hidden");
  resultView.classList.remove("hidden");

  // ===== Animate Numbers =====
  animateNumber("remainingToday", remainingToday);
  animateNumber("pagesPerPrayerToday", pagesPerPrayerToday);
  animateNumber("dailyPages", dailyPagesNext);
  animateNumber("dailyPrayerPages", dailyPerPrayerNext);

  // Animate result circle slightly delayed
  setTimeout(() => {
    updateCircle(resultProgressCircle, pagesRead, TOTAL_PAGES);
  }, 150);
}

// ===== Return to Input =====
function showInputView() {
  resultView.classList.add("hidden");
  inputView.classList.remove("hidden");
}

// ===== Live Input Circle Update =====
document
  .getElementById("pagesInput")
  .addEventListener("input", (e) => {
    let val = parseInt(e.target.value) || 0;
    val = Math.max(0, Math.min(val, TOTAL_PAGES));

    document.getElementById("pageValueInput").textContent = val;
    updateCircle(inputProgressCircle, val, TOTAL_PAGES);
  });

// ===== DATE FOOTER =====
const dateEl = document.getElementById("currentDate");
const todayDate = new Date();

const formattedDate = todayDate.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

if (dateEl) dateEl.textContent = formattedDate;





