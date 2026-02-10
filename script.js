const TOTAL_PAGES = 604;
const CIRCUMFERENCE = 2 * Math.PI * 90;

const inputProgressCircle = document.getElementById("inputProgressCircle");
const resultProgressCircle = document.getElementById("resultProgressCircle");
const inputView = document.getElementById("inputView");
const resultView = document.getElementById("resultView");

// Initialize Circles
if (inputProgressCircle) {
  inputProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
  inputProgressCircle.style.strokeDashoffset = CIRCUMFERENCE;
}

if (resultProgressCircle) {
  resultProgressCircle.style.strokeDasharray = CIRCUMFERENCE;
}

function updateCircle(circle, value, total) {
  if (!circle) return;
  const percent = value / total;
  const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

function calculateAndShowResult() {
  const pagesInput = document.getElementById("pagesInput");
  const pagesTodayInput = document.getElementById("pagesTodayInput");
  const prayerSelect = document.getElementById("prayerSelect");

  // 1. Get inputs
  let pagesRead = parseInt(pagesInput.value) || 0;
  pagesRead = Math.max(0, Math.min(pagesRead, TOTAL_PAGES));

  let pagesToday = parseInt(pagesTodayInput.value) || 0;
  pagesToday = Math.max(0, pagesToday);

  const selectedPrayer = prayerSelect ? prayerSelect.value : "fajr";

  // 2. Total pages left
  let pagesLeftTotal = TOTAL_PAGES - pagesRead;

  // 3. Days remaining
  const targetDate = new Date("2026-03-19T23:59:59");
  const today = new Date();
  const timeDiff = targetDate - today;
  const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  // 4. Remaining pages for today (timeline-based)
  let remainingToday = Math.ceil(pagesLeftTotal / daysRemaining) - pagesToday;
  remainingToday = Math.max(0, remainingToday);

  // 5. Remaining prayers today based on current prayer (Fajr=5 → Isha=1)
  let prayersLeftToday = 5;
  switch (selectedPrayer) {
    case "fajr": prayersLeftToday = 5; break;
    case "zuhr": prayersLeftToday = 4; break;
    case "asr": prayersLeftToday = 3; break;
    case "maghrib": prayersLeftToday = 2; break;
    case "isha": prayersLeftToday = 1; break;
  }

  // 6. Pages per prayer today
  let pagesPerPrayerToday = Math.ceil(remainingToday / prayersLeftToday);

  // 7. Pages left for next day projection
  const pagesLeftForNextDay = pagesLeftTotal - pagesToday - remainingToday;

  // 8. Daily pages for next day
  const remainingDaysNext = Math.max(1, daysRemaining - 1);
  let dailyPagesNext = Math.ceil(pagesLeftForNextDay / remainingDaysNext);

  // 9. Daily pages per prayer for next day
  let dailyPerPrayerNext = Math.ceil(dailyPagesNext / 5);

  // 10. Update UI
  updateCircle(inputProgressCircle, pagesRead, TOTAL_PAGES);
  document.getElementById("pageValueInput").textContent = pagesRead;

  document.getElementById("pageValueResult").textContent = pagesRead;

  document.getElementById("remainingToday").textContent = remainingToday;
  document.getElementById("pagesPerPrayerToday").textContent = pagesPerPrayerToday;
  document.getElementById("dailyPages").textContent = dailyPagesNext;
  document.getElementById("dailyPrayerPages").textContent = dailyPerPrayerNext;

  inputView.classList.add("hidden");
  resultView.classList.remove("hidden");

  setTimeout(() => {
    updateCircle(resultProgressCircle, pagesRead, TOTAL_PAGES);
  }, 50);
}

// ===== CURRENT DATE FOOTER =====
const dateEl = document.getElementById("currentDate");
const today = new Date();
const formattedDate = today.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
});
dateEl.textContent = formattedDate;

function showInputView() {
  resultView.classList.add("hidden");
  inputView.classList.remove("hidden");
}

// Event listeners
document.getElementById("pagesInput").addEventListener("input", (e) => {
  let val = parseInt(e.target.value) || 0;
  val = Math.max(0, Math.min(val, TOTAL_PAGES));
  document.getElementById("pageValueInput").textContent = val;
  updateCircle(inputProgressCircle, val, TOTAL_PAGES);
});

document.getElementById("pagesTodayInput")?.addEventListener("input", (e) => {
  let val = parseInt(e.target.value) || 0;
  val = Math.max(0, val);
});


