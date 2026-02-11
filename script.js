// ===== CONSTANTS =====
const TOTAL_PAGES = 604;



// ===== ELEMENTS =====
const inputView = document.getElementById("inputView");
const resultView = document.getElementById("resultView");
const errorEl = document.getElementById("inputError");
const inputProgressCircle = document.getElementById("inputProgressCircle");
const resultProgressCircle = document.getElementById("resultProgressCircle");
const pagesInputField = document.getElementById("pagesInput");

// ===== QUOTES PRESET =====
const quotes = [
  "“The most beloved deeds to Allah are those done consistently, even if small.” — Sahih al-Bukhari & Sahih Muslim",
  "“Take on only as much as you can do, for Allah does not grow weary until you do.” — Sahih al-Bukhari",
  "“Do not belittle any good deed, even meeting your brother with a cheerful face.” — Sahih Muslim",
  "“Give charity, even if it is a smile.” — Sahih Muslim",
  "“The strong believer is better and more beloved to Allah than the weak believer…” — Sahih Muslim"
];

// ===== RANDOM QUOTE =====
function displayRandomQuote() {
  const quoteEl = document.getElementById("dailyQuote");
  if (!quoteEl) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[randomIndex];
}

// ===== CIRCLE UPDATE =====
function updateCircle(circle, value, total) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  const offset = circumference - (value / total) * circumference;
  circle.style.strokeDashoffset = offset;
}

// ===== LIVE PROGRESS UPDATE =====
pagesInputField.addEventListener("input", function () {
  let value = parseInt(this.value);

  if (isNaN(value) || value < 0) value = 0;
  if (value > TOTAL_PAGES) value = TOTAL_PAGES;

  document.getElementById("pageValueInput").textContent = value;
  updateCircle(inputProgressCircle, value, TOTAL_PAGES);
});

// ===== NUMBER ANIMATION =====
function animateNumber(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const increment = Math.ceil(target / 40);

  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 20);
}

// ===== CALCULATE FUNCTION =====
function calculateAndShowResult() {
  const pagesInput = document.getElementById("pagesInput");
  const pagesTodayInput = document.getElementById("pagesTodayInput");
  const targetDateInput = document.getElementById("targetDateInput");

  // Get the elements for results
  const diffTimeEl = document.getElementById("diffTime");

  let pagesRead = parseInt(pagesInput.value);
  let pagesToday = parseInt(pagesTodayInput.value);

  // ===== VALIDATION =====
  if (isNaN(pagesRead) || pagesRead < 0) {
    errorEl.textContent = "Please enter your current page.";
    errorEl.style.display = "block";
    return;
  }

  pagesToday = isNaN(pagesToday) ? 0 : pagesToday;

  if (pagesToday > pagesRead) {
    errorEl.textContent = "Pages read today cannot exceed current page.";
    errorEl.style.display = "block";
    return;
  }

  const targetDate = new Date(targetDateInput.value);
  if (isNaN(targetDate.getTime())) {
    errorEl.textContent = "Please enter a valid target date.";
    errorEl.style.display = "block";
    return;
  }

  errorEl.style.display = "none";

  // ===== SAFE VALUES =====
  pagesRead = Math.min(Math.max(pagesRead, 0), TOTAL_PAGES);
  pagesToday = Math.max(pagesToday, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate - today;
  const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  const pagesLeft = TOTAL_PAGES - pagesRead;

  // Calculate status at start of today to get a stable daily goal
  const totalLeftAtStartOfToday = pagesLeft + pagesToday;
  const dailySuggested = Math.ceil(totalLeftAtStartOfToday / daysRemaining);

  // Remaining for today's quota
  const remainingToday = Math.max(0, dailySuggested - pagesToday);
  const dailyPerPrayer = Math.ceil(dailySuggested / 5);

  // ===== UPDATE UI =====
  document.getElementById("pageValueInput").textContent = pagesRead;
  document.getElementById("pageValueResult").textContent = pagesRead;

  updateCircle(inputProgressCircle, pagesRead, TOTAL_PAGES);

  inputView.classList.add("hidden");
  resultView.classList.remove("hidden");

  animateNumber("pagesLeft", pagesLeft);

  // Updating 'diffTime' element (labeled "Days Left" in HTML)
  if (diffTimeEl) animateNumber("diffTime", daysRemaining);

  animateNumber("remainingToday", remainingToday);
  animateNumber("dailyPages", dailySuggested);
  animateNumber("dailyPrayerPages", dailyPerPrayer);

  setTimeout(() => {
    updateCircle(resultProgressCircle, pagesRead, TOTAL_PAGES);
  }, 150);

  displayRandomQuote();
}


// ===== RETURN TO INPUT VIEW =====
function showInputView() {
  resultView.classList.add("hidden");
  inputView.classList.remove("hidden");
}

// ===== DISPLAY CURRENT DATE (AUTO LOCALE) =====
function displayCurrentDate() {
  const dateEl = document.getElementById("currentDate");
  if (!dateEl) return;

  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  dateEl.textContent = today.toLocaleDateString(navigator.language, options);
}

displayCurrentDate();





