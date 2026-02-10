const TOTAL_PAGES = 604;
const CIRCUMFERENCE = 2 * Math.PI * 90;

const inputProgressCircle = document.getElementById("inputProgressCircle");
const resultProgressCircle = document.getElementById("resultProgressCircle");
const inputView = document.getElementById("inputView");
const resultView = document.getElementById("resultView");

// ===== INIT CIRCLES =====
if (inputProgressCircle) {
  inputProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
  inputProgressCircle.style.strokeDashoffset = CIRCUMFERENCE;
}

if (resultProgressCircle) {
  resultProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
}

// ===== CIRCLE UPDATE =====
function updateCircle(circle, value, total) {
  if (!circle) return;
  const percent = value / total;
  const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

// ===== PREMIUM FLICKER ANIMATION =====
function animateStat(element, finalValue, options = {}) {
  if (!element) return;

  const {
    duration = 800,
    flickerMin = 1,
    flickerMax = 99
  } = options;

  let start = null;

  function flicker(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const randomValue =
      Math.floor(Math.random() * (flickerMax - flickerMin + 1)) + flickerMin;

    element.textContent = randomValue;

    if (elapsed < duration) {
      requestAnimationFrame(flicker);
    } else {
      element.textContent = finalValue;

      // subtle settle pop
      element.style.transform = "scale(1.08)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 120);
    }
  }

  requestAnimationFrame(flicker);
}

// ===== MAIN CALCULATION =====
function calculateAndShowResult() {
  const pagesInput = document.getElementById("pagesInput");
  const pagesTodayInput = document.getElementById("pagesTodayInput");
  const prayerSelect = document.getElementById("prayerSelect");

  // 1. Inputs
  let pagesRead = Math.max(0, Math.min(parseInt(pagesInput.value) || 0, TOTAL_PAGES));
  let pagesToday = Math.max(0, parseInt(pagesTodayInput.value) || 0);
  const selectedPrayer = prayerSelect ? prayerSelect.value : "fajr";

  // 2. Total pages left
  const pagesLeftTotal = TOTAL_PAGES - pagesRead;

  // 3. Days remaining
  const targetDate = new Date("2026-03-19T23:59:59");
  const today = new Date();
  const daysRemaining = Math.max(
    1,
    Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
  );

  // 4. Remaining pages today
  let remainingToday =
    Math.ceil(pagesLeftTotal / daysRemaining) - pagesToday;
  remainingToday = Math.max(0, remainingToday);

  // 5. Prayers left today (5 → 1)
  let prayersLeftToday = 5;
  switch (selectedPrayer) {
    case "fajr": prayersLeftToday = 5; break;
    case "zuhr": prayersLeftToday = 4; break;
    case "asr": prayersLeftToday = 3; break;
    case "maghrib": prayersLeftToday = 2; break;
    case "isha": prayersLeftToday = 1; break;
  }

  // 6. Pages per prayer today
  const pagesPerPrayerToday =
    prayersLeftToday > 0
      ? Math.ceil(remainingToday / prayersLeftToday)
      : 0;

  // 7. Next day projection
  const pagesLeftForNextDay =
    pagesLeftTotal - pagesToday - remainingToday;

  const remainingDaysNext = Math.max(1, daysRemaining - 1);
  const dailyPagesNext =
    Math.ceil(pagesLeftForNextDay / remainingDaysNext);

  const dailyPerPrayerNext = Math.ceil(dailyPagesNext / 5);

  // ===== UPDATE UI =====
  updateCircle(inputProgressCircle, pagesRead, TOTAL_PAGES);
  document.getElementById("pageValueInput").textContent = pagesRead;
  document.getElementById("pageValueResult").textContent = pagesRead;

  // 🔥 Animated stats
  animateStat(
    document.getElementById("remainingToday"),
    remainingToday
  );

  animateStat(
    document.getElementById("pagesPerPrayerToday"),
    pagesPerPrayerToday,
    { flickerMax: Math.max(20, pagesPerPrayerToday * 2) }
  );

  animateStat(
    document.getElementById("dailyPages"),
    dailyPagesNext
  );

  animateStat(
    document.getElementById("dailyPrayerPages"),
    dailyPerPrayerNext
  );

  inputView.classList.add("hidden");
  resultView.classList.remove("hidden");

  setTimeout(() => {
    updateCircle(resultProgressCircle, pagesRead, TOTAL_PAGES);
  }, 50);
}

// ===== FOOTER DATE =====
const dateEl = document.getElementById("currentDate");
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// ===== VIEW SWITCH =====
function showInputView() {
  resultView.classList.add("hidden");
  inputView.classList.remove("hidden");
}

// ===== LIVE INPUT =====
document.getElementById("pagesInput").addEventListener("input", (e) => {
  let val = Math.max(0, Math.min(parseInt(e.target.value) || 0, TOTAL_PAGES));
  document.getElementById("pageValueInput").textContent = val;
  updateCircle(inputProgressCircle, val, TOTAL_PAGES);
});

document.getElementById("pagesTodayInput")?.addEventListener("input", (e) => {
  e.target.value = Math.max(0, parseInt(e.target.value) || 0);
});




