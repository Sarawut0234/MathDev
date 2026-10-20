const form = document.querySelector("#converter-form");
const numberInput = document.querySelector("#number-input");
const fromBaseInput = document.querySelector("#from-base");
const toBaseSelect = document.querySelector("#to-base");
const customBaseControl = document.querySelector("#custom-base-control");
const customBaseInput = document.querySelector("#custom-base");
const inputHint = document.querySelector("#input-hint");
const errorMessage = document.querySelector("#error-message");
const resultValue = document.querySelector("#result-value");
const resultMeta = document.querySelector("#result-meta");
const stepsSubtitle = document.querySelector("#steps-subtitle");
const stepsContent = document.querySelector("#steps-content");
const copyButton = document.querySelector("#copy-button");
const swapButton = document.querySelector("#swap-button");

const baseNames = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal",
};

function selectedToBase() {
  return toBaseSelect.value === "custom"
    ? Number(customBaseInput.value)
    : Number(toBaseSelect.value);
}

function formatBase(base) {
  return baseNames[base] || `ฐาน ${base}`;
}

function parseInteger(value, base) {
  let digits = value.trim().toUpperCase();
  let sign = 1n;

  if (digits.startsWith("-")) {
    sign = -1n;
    digits = digits.slice(1);
  } else if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }

  if (!digits) {
    throw new Error("กรุณากรอกตัวเลขที่ต้องการแปลง");
  }

  let result = 0n;
  const baseBigInt = BigInt(base);
  for (const character of digits) {
    const digit = character >= "0" && character <= "9"
      ? character.charCodeAt(0) - 48
      : character.charCodeAt(0) - 55;

    if (digit < 0 || digit >= base) {
      throw new Error(`เลข "${character}" ใช้ไม่ได้ในฐาน ${base}`);
    }
    result = result * baseBigInt + BigInt(digit);
  }

  return { value: result * sign, digits };
}

function convertToBase(value, base) {
  if (value === 0n) return "0";
  const isNegative = value < 0n;
  let remaining = isNegative ? -value : value;
  const baseBigInt = BigInt(base);
  let result = "";

  while (remaining > 0n) {
    const digit = Number(remaining % baseBigInt);
    result = digit.toString(36).toUpperCase() + result;
    remaining /= baseBigInt;
  }

  return `${isNegative ? "-" : ""}${result}`;
}

function digitValue(character) {
  return character >= "0" && character <= "9"
    ? character.charCodeAt(0) - 48
    : character.charCodeAt(0) - 55;
}

function renderSteps(digits, fromBase, toBase, convertedValue, output) {
  const rows = Array.from(digits, (digit, index) => {
    const power = digits.length - index - 1;
    return `${digitValue(digit)} × ${fromBase}<sup>${power}</sup>`;
  });
  const expanded = Array.from(digits, (digit, index) => {
    const power = digits.length - index - 1;
    return `${digitValue(digit)} × ${fromBase}^${power}`;
  });
  const sign = convertedValue < 0n ? "−" : "";
  const magnitude = convertedValue < 0n ? -convertedValue : convertedValue;
  const baseBigInt = BigInt(toBase);
  const divisions = [];
  let remaining = magnitude;

  if (remaining === 0n) {
    divisions.push(`0 ÷ ${toBase} = 0 เศษ 0`);
  } else {
    while (remaining > 0n) {
      const quotient = remaining / baseBigInt;
      const remainder = remaining % baseBigInt;
      divisions.push(`${remaining} ÷ ${toBase} = ${quotient} เศษ ${remainder.toString(36).toUpperCase()}`);
      remaining = quotient;
    }
  }

  const remainderOrder = magnitude === 0n
    ? "0"
    : convertToBase(magnitude, toBase).split("").reverse().join("");
  const formula = `${sign}(${expanded.join(" + ")})`;

  stepsContent.innerHTML = `
    <p>1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${formula} = ${convertedValue}</strong></span></p>
    <p>2. นำฐานสิบไปหารด้วย ${toBase} ซ้ำ ๆ แล้วอ่านเศษจากล่างขึ้นบน:</p>
    <p class="formula">${divisions.join("<br />")}</p>
    <p>3. อ่านเศษย้อนกลับ ได้ <strong>${output}</strong><span class="formula"> (${remainderOrder})</span> ในฐาน ${toBase}</p>
  `;
  stepsSubtitle.textContent = `แปลงจากฐาน ${fromBase} เป็นฐาน ${toBase}`;
}

function convert() {
  const fromBase = Number(fromBaseInput.value);
  const toBase = selectedToBase();

  if (!Number.isInteger(fromBase) || fromBase < 2 || fromBase > 36) {
    throw new Error("ฐานต้นทางต้องเป็นจำนวนเต็มตั้งแต่ 2 ถึง 36");
  }
  if (!Number.isInteger(toBase) || toBase < 2 || toBase > 36) {
    throw new Error("ฐานปลายทางต้องเป็นจำนวนเต็มตั้งแต่ 2 ถึง 36");
  }

  const parsed = parseInteger(numberInput.value, fromBase);
  const output = convertToBase(parsed.value, toBase);
  resultValue.textContent = output;
  resultMeta.innerHTML = `ฐาน ${toBase} <span>·</span> ${formatBase(toBase)}`;
  inputHint.textContent = `เลขฐาน ${fromBase}`;
  renderSteps(parsed.digits, fromBase, toBase, parsed.value, output);
  errorMessage.hidden = true;
}

function tryConvert() {
  try {
    convert();
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  }
}

function updateBaseControls() {
  customBaseControl.hidden = toBaseSelect.value !== "custom";
  tryConvert();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  tryConvert();
});

numberInput.addEventListener("input", tryConvert);
fromBaseInput.addEventListener("input", tryConvert);
toBaseSelect.addEventListener("change", updateBaseControls);
customBaseInput.addEventListener("input", tryConvert);

swapButton.addEventListener("click", () => {
  const fromBase = Number(fromBaseInput.value);
  const toBase = selectedToBase();
  if (!Number.isInteger(fromBase) || fromBase < 2 || fromBase > 36
    || !Number.isInteger(toBase) || toBase < 2 || toBase > 36) {
    errorMessage.textContent = "กรุณาเลือกฐานตั้งแต่ 2 ถึง 36 ก่อนสลับ";
    errorMessage.hidden = false;
    return;
  }

  const previousValue = resultValue.textContent;
  fromBaseInput.value = String(toBase);
  const presetOption = Array.from(toBaseSelect.options).find((option) => Number(option.value) === fromBase);
  if (presetOption) {
    toBaseSelect.value = presetOption.value;
    customBaseControl.hidden = true;
  } else {
    toBaseSelect.value = "custom";
    customBaseInput.value = String(fromBase);
    customBaseControl.hidden = false;
  }
  numberInput.value = previousValue;
  tryConvert();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultValue.textContent);
    copyButton.querySelector("span").textContent = "คัดลอกแล้ว";
    window.setTimeout(() => {
      copyButton.querySelector("span").textContent = "คัดลอก";
    }, 1400);
  } catch {
    errorMessage.textContent = "คัดลอกไม่ได้ กรุณาเลือกผลลัพธ์แล้วคัดลอกด้วยตนเอง";
    errorMessage.hidden = false;
  }
});

document.querySelectorAll(".base-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    fromBaseInput.value = chip.dataset.from;
    const presetOption = Array.from(toBaseSelect.options)
      .find((option) => option.value === chip.dataset.to);
    toBaseSelect.value = presetOption ? presetOption.value : "custom";
    if (!presetOption) customBaseInput.value = chip.dataset.to;
    customBaseControl.hidden = Boolean(presetOption);
    tryConvert();
    numberInput.focus();
  });
});

const calcForm = document.querySelector("#calc-form");
const calcAInput = document.querySelector("#calc-a");
const calcBInput = document.querySelector("#calc-b");
const calcOperatorSelect = document.querySelector("#calc-operator");
const calcBaseInput = document.querySelector("#calc-base");
const calcError = document.querySelector("#calc-error");
const calcResult = document.querySelector("#calc-result");
const calcResultMeta = document.querySelector("#calc-result-meta");
const calcStepsSubtitle = document.querySelector("#calc-steps-subtitle");
const calcStepsContent = document.querySelector("#calc-steps-content");
const calcCopyButton = document.querySelector("#calc-copy-button");

const operatorNames = {
  "+": "บวก",
  "−": "ลบ",
  "×": "คูณ",
  "÷": "หาร",
};

function toDigitString(value) {
  return value.toString(36).toUpperCase();
}

function columnAddition(aDigits, bDigits, base) {
  const width = Math.max(aDigits.length, bDigits.length);
  const left = aDigits.padStart(width, "0");
  const right = bDigits.padStart(width, "0");
  const lines = [];
  const resultDigits = [];
  let carry = 0;

  for (let index = width - 1; index >= 0; index -= 1) {
    const column = width - index;
    const sum = digitValue(left[index]) + digitValue(right[index]) + carry;
    const digit = sum % base;
    const nextCarry = Math.floor(sum / base);
    resultDigits.unshift(toDigitString(digit));
    lines.push(
      `หลักที่ ${column}: ${digitValue(left[index])} + ${digitValue(right[index])}`
      + `${carry ? ` + ${carry} (ทด)` : ""} = ${sum} → ได้ ${toDigitString(digit)}`
      + `${nextCarry ? ` ทด ${nextCarry}` : ""}`,
    );
    carry = nextCarry;
  }

  if (carry > 0) resultDigits.unshift(toDigitString(carry));
  return { lines, result: resultDigits.join("") };
}

function columnSubtraction(aDigits, bDigits, base) {
  const width = Math.max(aDigits.length, bDigits.length);
  const left = aDigits.padStart(width, "0");
  const right = bDigits.padStart(width, "0");
  const lines = [];
  const resultDigits = [];
  let borrow = 0;

  for (let index = width - 1; index >= 0; index -= 1) {
    const column = width - index;
    const bottom = digitValue(right[index]);
    let top = digitValue(left[index]) - borrow;
    let borrowed = 0;

    if (top < bottom) {
      top += base;
      borrowed = 1;
    }

    const difference = top - bottom;
    resultDigits.unshift(toDigitString(difference));
    lines.push(
      `หลักที่ ${column}: ${digitValue(left[index])}`
      + `${borrow ? ` − ${borrow} (ยืม)` : ""} − ${bottom}`
      + `${borrowed ? ` → ยืม ${base} ได้ ${top}` : ""} = ${difference}`,
    );
    borrow = borrowed;
  }

  return { lines, result: resultDigits.join("").replace(/^0+(?=.)/, "") };
}

function renderCalcSteps({ operator, base, a, b, resultText, quotientText, remainderText }) {
  const aDecimal = a.value;
  const bDecimal = b.value;
  const baseLabel = `ฐาน ${base}`;
  const parts = [];

  if ((operator === "+" || operator === "−") && a.value >= 0n && b.value >= 0n) {
    const negative = operator === "−" && a.value < b.value;
    const left = negative ? b : a;
    const right = negative ? a : b;
    const columns = operator === "+"
      ? columnAddition(left.digits, right.digits, base)
      : columnSubtraction(left.digits, right.digits, base);
    const decimalCheck = operator === "+" ? aDecimal + bDecimal : aDecimal - bDecimal;

    parts.push(`1. เขียนตัวเลขให้หลักตรงกัน แล้ว${operatorNames[operator]}ทีละหลักใน${baseLabel}:`);
    parts.push(`<span class="formula">${columns.lines.join("<br />")}</span>`);
    parts.push(
      `2. ตรวจสอบด้วยฐานสิบ: <span class="formula"><strong>${aDecimal} ${operator} ${bDecimal} = ${decimalCheck}</strong></span>`,
    );
    parts.push(`3. ผลลัพธ์คือ <strong>${resultText}</strong> ใน${baseLabel}`);
  } else if (operator === "×") {
    parts.push(
      `1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${a.digits} = ${aDecimal}</strong></span> และ `
      + `<span class="formula"><strong>${b.digits} = ${bDecimal}</strong></span>`,
    );
    parts.push(`2. คูณในฐานสิบ: <span class="formula"><strong>${aDecimal} × ${bDecimal} = ${aDecimal * bDecimal}</strong></span>`);
    parts.push(`3. แปลงผลลัพธ์กลับเป็น${baseLabel} ได้ <strong>${resultText}</strong>`);
  } else if (operator === "÷") {
    parts.push(
      `1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${a.digits} = ${aDecimal}</strong></span> และ `
      + `<span class="formula"><strong>${b.digits} = ${bDecimal}</strong></span>`,
    );
    parts.push(
      `2. หารในฐานสิบ: <span class="formula"><strong>${aDecimal} ÷ ${bDecimal} = ${aDecimal / bDecimal} `
      + `เศษ ${aDecimal % bDecimal}</strong></span>`,
    );
    parts.push(
      `3. แปลงกลับเป็น${baseLabel}: ผลหาร = <strong>${quotientText}</strong>`
      + `${remainderText ? `, เศษ = <strong>${remainderText}</strong>` : ""}`,
    );
  } else {
    parts.push(
      `1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${a.digits} = ${aDecimal}</strong></span> และ `
      + `<span class="formula"><strong>${b.digits} = ${bDecimal}</strong></span>`,
    );
    parts.push(`2. ${operatorNames[operator]}ในฐานสิบ: <span class="formula"><strong>${aDecimal} ${operator} ${bDecimal} = ${aDecimal + bDecimal}</strong></span>`);
    parts.push(`3. แปลงผลลัพธ์กลับเป็น${baseLabel} ได้ <strong>${resultText}</strong>`);
  }

  calcStepsContent.innerHTML = parts.map((part) => `<p>${part}</p>`).join("");
  calcStepsSubtitle.textContent = `${operatorNames[operator]}ใน${baseLabel}`;
}

function calculate() {
  const base = Number(calcBaseInput.value);
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new Error("ฐานที่ใช้คำนวณต้องเป็นจำนวนเต็มตั้งแต่ 2 ถึง 36");
  }

  const a = parseInteger(calcAInput.value, base);
  const b = parseInteger(calcBInput.value, base);
  const operator = calcOperatorSelect.value;
  let resultText = "";
  let quotientText = "";
  let remainderText = "";

  if (operator === "+") {
    resultText = convertToBase(a.value + b.value, base);
  } else if (operator === "−") {
    resultText = convertToBase(a.value - b.value, base);
  } else if (operator === "×") {
    resultText = convertToBase(a.value * b.value, base);
  } else {
    if (b.value === 0n) {
      throw new Error("ตัวหารต้องไม่เป็นศูนย์");
    }
    const quotient = a.value / b.value;
    const remainder = a.value % b.value;
    quotientText = convertToBase(quotient, base);
    remainderText = convertToBase(remainder, base);
    resultText = quotientText;
  }

  calcResult.textContent = resultText;
  calcResultMeta.innerHTML = operator === "÷"
    ? `ฐาน ${base} <span>·</span> ${formatBase(base)} <span>·</span> เศษ ${remainderText}`
    : `ฐาน ${base} <span>·</span> ${formatBase(base)}`;
  renderCalcSteps({ operator, base, a, b, resultText, quotientText, remainderText });
  calcError.hidden = true;
}

function tryCalculate() {
  try {
    calculate();
  } catch (error) {
    calcError.textContent = error.message;
    calcError.hidden = false;
  }
}

function activateTab(name) {
  if (name !== "practice" && practiceState.player) {
    saveScore();
    stopTimer();
  }
  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.tab === name;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(".dock-tab").forEach((button) => {
    const isActive = button.dataset.tab === name;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== name;
  });
  if (name === "practice") {
    practiceStepsCard.hidden = practiceStepsContent.innerHTML === "";
  }
  if (name === "leaderboard") renderLeaderboard();
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

document.querySelectorAll(".dock-tab").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

/* ---------- มือถือ: ย่อ/ขยายการ์ด "วิธีคิด" แบบพับได้ ---------- */

const stepsToggles = [...document.querySelectorAll(".steps-toggle")];
const stepsCards = stepsToggles.map((toggle) => {
  const card = toggle.closest(".steps-card");
  return { toggle, card, body: card ? card.querySelector(".steps-content") : null };
});
const compactLayoutQuery = window.matchMedia("(max-width: 900px)");
let stepsCollapsed = false;

function paintStepsToggles() {
  stepsCards.forEach(({ toggle, card, body }) => {
    if (!card || !body) return;
    const expanded = !stepsCollapsed;
    toggle.setAttribute("aria-expanded", String(expanded));
    body.hidden = !expanded;
    card.classList.toggle("is-collapsed", !expanded);
  });
}

stepsToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    stepsCollapsed = !stepsCollapsed;
    paintStepsToggles();
  });
});

/* บนเดสก์ท็อปไม่มีปุ่มพับ การ์ดวิธีคิดจึงต้องแสดงเนื้อหาเสมอ */
compactLayoutQuery.addEventListener("change", (event) => {
  if (!event.matches && stepsCollapsed) {
    stepsCollapsed = false;
    paintStepsToggles();
  }
});

paintStepsToggles();

calcForm.addEventListener("submit", (event) => {
  event.preventDefault();
  tryCalculate();
});

calcAInput.addEventListener("input", tryCalculate);
calcBInput.addEventListener("input", tryCalculate);
calcBaseInput.addEventListener("input", tryCalculate);
calcOperatorSelect.addEventListener("change", tryCalculate);

calcCopyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(calcResult.textContent);
    calcCopyButton.querySelector("span").textContent = "คัดลอกแล้ว";
    window.setTimeout(() => {
      calcCopyButton.querySelector("span").textContent = "คัดลอก";
    }, 1400);
  } catch {
    calcError.textContent = "คัดลอกไม่ได้ กรุณาเลือกผลลัพธ์แล้วคัดลอกด้วยตนเอง";
    calcError.hidden = false;
  }
});

/* ---------- แท็บสไลด์: เลือกบท ดูสไลด์ และเลื่อนหน้า ---------- */

const slidesChapters = document.querySelector("#slides-chapters");
const slidesImage = document.querySelector("#slides-image");
const slidesTitle = document.querySelector("#slides-title");
const slidesMeta = document.querySelector("#slides-meta");
const slidesPrev = document.querySelector("#slides-prev");
const slidesNext = document.querySelector("#slides-next");
const slidesPosition = document.querySelector("#slides-position");
const slidesLength = document.querySelector("#slides-length");
const slidesProgressFill = document.querySelector("#slides-progress-fill");
const slidesProgressTrack = document.querySelector(".slides-progress-track");
const slidesThumbs = document.querySelector("#slides-thumbs");
const slidesTotal = document.querySelector("#slides-total");
const slidesToPractice = document.querySelector("#slides-to-practice");

const slidesState = { chapter: 0, index: 0 };

function currentSlideChapter() {
  return SLIDE_CHAPTERS[slidesState.chapter];
}

function slideImagePath(chapterId, number) {
  return `/slides/${chapterId}/slide-${String(number).padStart(2, "0")}.jpg`;
}

function renderSlideChapters() {
  slidesChapters.innerHTML = SLIDE_CHAPTERS.map((chapter, index) => `
    <button class="slides-chapter" type="button" role="tab"
      aria-selected="${index === slidesState.chapter}"
      data-chapter="${index}"
      class="${index === slidesState.chapter ? "is-active" : ""}">
      <span class="slides-chapter-label">${chapter.label}</span>
      <span class="slides-chapter-title">${chapter.title}</span>
      <span class="slides-chapter-count">${chapter.count} สไลด์</span>
    </button>
  `).join("");

  slidesChapters.querySelectorAll(".slides-chapter").forEach((button) => {
    button.addEventListener("click", () => {
      slidesState.chapter = Number(button.dataset.chapter);
      slidesState.index = 0;
      renderSlideChapters();
      renderSlideThumbs();
      renderSlide();
    });
  });
}

function renderSlideThumbs() {
  const chapter = currentSlideChapter();
  slidesThumbs.innerHTML = chapter.slides.map((slide, index) => `
    <button class="slides-thumb ${index === slidesState.index ? "is-active" : ""}" type="button"
      data-index="${index}" title="${slide.t}" aria-label="สไลด์ที่ ${slide.n}: ${slide.t}">
      <img src="${slideImagePath(chapter.id, slide.n)}" alt="" loading="lazy" />
      <span>${slide.n}</span>
    </button>
  `).join("");

  slidesThumbs.querySelectorAll(".slides-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      slidesState.index = Number(button.dataset.index);
      renderSlide();
    });
  });
}

function renderSlide() {
  const chapter = currentSlideChapter();
  const slide = chapter.slides[slidesState.index];
  const total = chapter.slides.length;

  slidesImage.src = slideImagePath(chapter.id, slide.n);
  slidesImage.alt = `${chapter.label} ${chapter.title} สไลด์ที่ ${slide.n}: ${slide.t}`;
  slidesTitle.textContent = slide.t;
  slidesMeta.textContent = `${chapter.label} · ${chapter.title} · สไลด์ ${slide.n}/${total}`;
  slidesPosition.textContent = String(slide.n);
  slidesLength.textContent = String(total);
  slidesProgressFill.style.width = `${((slidesState.index + 1) / total) * 100}%`;
  slidesProgressTrack.setAttribute("aria-valuemax", String(total));
  slidesProgressTrack.setAttribute("aria-valuenow", String(slide.n));
  slidesPrev.disabled = slidesState.index === 0;
  slidesNext.disabled = slidesState.index === total - 1;

  slidesThumbs.querySelectorAll(".slides-thumb").forEach((button, index) => {
    const isActive = index === slidesState.index;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.scrollIntoView({ block: "nearest", inline: "center" });
  });
}

function stepSlide(delta) {
  const chapter = currentSlideChapter();
  const next = slidesState.index + delta;
  if (next < 0 || next >= chapter.slides.length) return;
  slidesState.index = next;
  renderSlide();
}

slidesPrev.addEventListener("click", () => stepSlide(-1));
slidesNext.addEventListener("click", () => stepSlide(1));

slidesToPractice.addEventListener("click", () => {
  activateTab("practice");
  const group = document.querySelector('input[name="practice-group"][value="all"]');
  if (group) {
    group.checked = true;
    syncPracticeGroups();
  }
});

slidesTotal.textContent = String(SLIDE_CHAPTERS.reduce((sum, chapter) => sum + chapter.count, 0));
renderSlideChapters();
renderSlideThumbs();
renderSlide();

/* ---------- เปิดสไลด์ดูเต็มหน้าจอ (lightbox) ---------- */

const slidesOpen = document.querySelector("#slides-open");
const slidesLightbox = document.querySelector("#slides-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxSub = document.querySelector("#lightbox-sub");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");
const lightboxChapters = document.querySelector("#lightbox-chapters");
const lightboxThumbs = document.querySelector("#lightbox-thumbs");
const lightboxPosition = document.querySelector("#lightbox-position");
const lightboxLength = document.querySelector("#lightbox-length");

const lightboxState = { open: false, chapter: 0, index: 0, restoreFocus: null };
let lightboxSwapTimer = 0;
const lightboxNeighbors = new Set();

function lightboxSlide() {
  const chapter = SLIDE_CHAPTERS[lightboxState.chapter];
  return { chapter, slide: chapter.slides[lightboxState.index], total: chapter.slides.length };
}

function renderLightboxChapters() {
  lightboxChapters.innerHTML = SLIDE_CHAPTERS.map((chapter, index) => `
    <button class="lightbox-chapter ${index === lightboxState.chapter ? "is-active" : ""}" type="button"
      role="tab" aria-selected="${index === lightboxState.chapter}" data-chapter="${index}">
      ${chapter.label}
    </button>
  `).join("");

  lightboxChapters.querySelectorAll(".lightbox-chapter").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxState.chapter = Number(button.dataset.chapter);
      lightboxState.index = 0;
      paintLightbox();
    });
  });
}

function renderLightboxThumbs() {
  const { chapter } = lightboxSlide();
  lightboxThumbs.innerHTML = chapter.slides.map((slide, index) => `
    <button class="lightbox-thumb ${index === lightboxState.index ? "is-active" : ""}" type="button"
      data-index="${index}" aria-label="สไลด์ที่ ${slide.n}: ${slide.t}">
      <img src="${slideImagePath(chapter.id, slide.n)}" alt="" loading="lazy" />
      <span>${slide.n}</span>
    </button>
  `).join("");

  lightboxThumbs.querySelectorAll(".lightbox-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.index);
      const direction = target === lightboxState.index ? 0 : target > lightboxState.index ? 1 : -1;
      lightboxState.index = target;
      paintLightbox(direction);
    });
  });

  const active = lightboxThumbs.querySelector(".lightbox-thumb.is-active");
  if (active) active.scrollIntoView({ block: "nearest", inline: "center" });
}

function preloadLightboxNeighbors() {
  const { chapter } = lightboxSlide();
  [lightboxState.index - 1, lightboxState.index + 1].forEach((index) => {
    const slide = chapter.slides[index];
    if (!slide) return;
    const key = `${chapter.id}-${slide.n}`;
    if (lightboxNeighbors.has(key)) return;
    lightboxNeighbors.add(key);
    const image = new Image();
    image.src = slideImagePath(chapter.id, slide.n);
  });
}

function paintLightbox(direction = 0) {
  const { chapter, slide, total } = lightboxSlide();

  lightboxImage.src = slideImagePath(chapter.id, slide.n);
  lightboxImage.alt = `${chapter.label} ${chapter.title} สไลด์ที่ ${slide.n}: ${slide.t}`;
  lightboxTitle.textContent = slide.t;
  lightboxSub.textContent = `${chapter.label} · ${chapter.title}`;
  lightboxPosition.textContent = String(slide.n);
  lightboxLength.textContent = String(total);
  lightboxPrev.disabled = lightboxState.index === 0;
  lightboxNext.disabled = lightboxState.index === total - 1;

  renderLightboxChapters();
  renderLightboxThumbs();
  preloadLightboxNeighbors();

  lightboxImage.classList.remove("is-swap-prev", "is-swap-next");
  if (direction !== 0) {
    void lightboxImage.offsetWidth;
    lightboxImage.classList.add(direction > 0 ? "is-swap-next" : "is-swap-prev");
    window.clearTimeout(lightboxSwapTimer);
    lightboxSwapTimer = window.setTimeout(() => {
      lightboxImage.classList.remove("is-swap-prev", "is-swap-next");
    }, 340);
  }
}

function stepLightbox(delta) {
  const { total } = lightboxSlide();
  const next = lightboxState.index + delta;
  if (next < 0 || next >= total) return;
  lightboxState.index = next;
  paintLightbox(delta);
}

function openLightbox() {
  if (lightboxState.open) return;
  lightboxState.chapter = slidesState.chapter;
  lightboxState.index = slidesState.index;
  lightboxState.open = true;
  const active = document.activeElement;
  lightboxState.restoreFocus = active instanceof HTMLElement && active !== document.body ? active : slidesOpen;
  slidesLightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
  paintLightbox();
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightboxState.open) return;
  lightboxState.open = false;
  slidesLightbox.hidden = true;
  document.body.classList.remove("is-lightbox-open");

  slidesState.chapter = lightboxState.chapter;
  slidesState.index = lightboxState.index;
  renderSlideChapters();
  renderSlideThumbs();
  renderSlide();

  const focusTarget = lightboxState.restoreFocus;
  lightboxState.restoreFocus = null;
  if (focusTarget && document.contains(focusTarget)) focusTarget.focus();
}

slidesOpen.addEventListener("click", openLightbox);
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => stepLightbox(-1));
lightboxNext.addEventListener("click", () => stepLightbox(1));

slidesLightbox.querySelectorAll("[data-lightbox-close]").forEach((element) => {
  element.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  const isTyping = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement;

  if (lightboxState.open) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (!isTyping && event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    } else if (!isTyping && event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    } else if (event.key === "Tab") {
      // อยู่ในหน้าต่างสไลด์เท่านั้น
      const focusables = slidesLightbox.querySelectorAll("button:not(:disabled)");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return;
  }

  if (document.querySelector("#panel-slides").hidden || isTyping) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepSlide(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    stepSlide(1);
  }
});

const practiceForm = document.querySelector("#practice-form");
const practiceAnswer = document.querySelector("#practice-answer");
const practiceError = document.querySelector("#practice-error");
const practiceTag = document.querySelector("#practice-tag");
const practiceCount = document.querySelector("#practice-count");
const practiceQuestion = document.querySelector("#practice-question");
const practiceHint = document.querySelector("#practice-hint");
const practiceDetail = document.querySelector("#practice-detail");
const practiceFeedback = document.querySelector("#practice-feedback");
const practiceNewButton = document.querySelector("#practice-new");
const practiceSkipButton = document.querySelector("#practice-skip");
const practiceResetButton = document.querySelector("#practice-reset");
const practiceBaseSelect = document.querySelector("#practice-base");
const practiceLevelSelect = document.querySelector("#practice-level");
const practiceLevelSlidesSelect = document.querySelector("#practice-level-slides");
const practiceBaseGroup = document.querySelector("#practice-base-group");
const practiceLogicGroup = document.querySelector("#practice-logic-group");
const practiceKmapGroup = document.querySelector("#practice-kmap-group");
const practiceBaseFilters = document.querySelector("#practice-base-filters");
const practiceSlideFilters = document.querySelector("#practice-slide-filters");
const practiceStepsSubtitle = document.querySelector("#practice-steps-subtitle");
const practiceStepsContent = document.querySelector("#practice-steps-content");
const practiceStepsCard = document.querySelector("#practice-steps-card");
const scoreCorrect = document.querySelector("#score-correct");
const scoreWrong = document.querySelector("#score-wrong");
const scoreStreak = document.querySelector("#score-streak");
const practiceGate = document.querySelector("#practice-gate");
const practiceBody = document.querySelector("#practice-body");
const practiceNameForm = document.querySelector("#practice-name-form");
const practiceNameInput = document.querySelector("#practice-name");
const practiceNameError = document.querySelector("#practice-name-error");
const practicePlayerName = document.querySelector("#practice-player-name");
const practiceChangeName = document.querySelector("#practice-change-name");
const practiceSettings = document.querySelector("#practice-settings");
const practiceSetup = document.querySelector("#practice-setup");
const practiceNextButton = document.querySelector("#practice-next");
const practiceTimer = document.querySelector("#practice-timer");
const practiceTimerValue = document.querySelector("#practice-timer-value");
const practiceTimerFill = document.querySelector("#practice-timer-fill");
const practiceTimerTrack = document.querySelector(".timer-track");
const practiceProgress = document.querySelector("#practice-progress");
const practiceProgressValue = document.querySelector("#practice-progress-value");
const practiceProgressFill = document.querySelector("#practice-progress-fill");
const practiceProgressTrack = document.querySelector(".set-progress-track");
const practiceSummary = document.querySelector("#practice-summary");
const summaryName = document.querySelector("#summary-name");
const summaryCorrect = document.querySelector("#summary-correct");
const summaryWrong = document.querySelector("#summary-wrong");
const summaryTotal = document.querySelector("#summary-total");
const summaryAverage = document.querySelector("#summary-average");
const summaryNote = document.querySelector("#summary-note");
const summaryAgain = document.querySelector("#summary-again");
const summaryLeaderboard = document.querySelector("#summary-leaderboard");
const leaderboardPodium = document.querySelector("#leaderboard-podium");
const leaderboardBody = document.querySelector("#leaderboard-body");
const leaderboardEmpty = document.querySelector("#leaderboard-empty");

const practiceTypeNames = {
  convert: "แปลงฐาน",
  add: "บวก",
  subtract: "ลบ",
  multiply: "คูณ",
  divide: "หาร",
  complement: "คอมพลีเมนต์",
  gate: "ลอจิกเกต",
  truth: "ตารางความจริง",
  demorgan: "De Morgan",
  minterm: "Minterm",
  group: "จัดกลุ่ม K-map",
  simplify: "ลดรูป K-map",
  cell: "อ่านช่อง K-map",
};

const practiceLevels = {
  easy: { min: 1, max: 2, label: "ง่าย" },
  medium: { min: 2, max: 3, label: "ปานกลาง" },
  hard: { min: 3, max: 5, label: "ยาก" },
};

const practiceState = {
  question: null,
  answered: false,
  index: 0,
  correct: 0,
  wrong: 0,
  streak: 0,
  player: "",
  remaining: 0,
  elapsed: 0,
  totalSeconds: 0,
  timerId: null,
  timedOut: false,
  entryId: "",
  queue: [],
  retry: [],
  round: 1,
  finished: false,
};

const QUESTION_SECONDS = 300;
const SET_SIZE = 10;
const MAX_ROUNDS = 3;
const LEADERBOARD_KEY = "mathdev.leaderboard.v1";
const PLAYER_KEY = "mathdev.player.v1";

const baseDigitSets = {
  2: "0, 1",
  8: "0–7",
  10: "0–9",
  16: "0–9, A–F",
};

function digitSet(base) {
  return baseDigitSets[base] || `0–9 และ A–${toDigitString(base - 1)}`;
}

function baseLine(base) {
  return `${base} · ${formatBase(base)} — ใช้ตัวเลข ${digitSet(base)}`;
}

function placeValues(digits, base) {
  return Array.from(digits, (digit, index) => {
    const power = digits.length - index - 1;
    return `${digit}×${base}<sup>${power}</sup>`;
  }).join(" + ");
}

function detailLines(rows) {
  return rows
    .map(([label, value]) => `<p><span class="detail-label">${label}</span> ${value}</p>`)
    .join("");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDigits(base, length) {
  const digits = [];
  for (let index = 0; index < length; index += 1) {
    const maxDigit = index === 0 ? base - 1 : base - 1;
    const digit = index === 0 ? randomInt(1, maxDigit) : randomInt(0, maxDigit);
    digits.push(toDigitString(digit));
  }
  return digits.join("");
}

/* ---------- ตัวช่วยสร้างโจทย์จากเนื้อหาในสไลด์ (บทที่ 1–3) ---------- */

function detailBlock(label, value) {
  return `<div class="detail-row"><span class="detail-label">${label}</span><div class="detail-value">${value}</div></div>`;
}

function addOneBinary(bits) {
  const characters = bits.split("");
  let carry = 1;
  for (let index = characters.length - 1; index >= 0 && carry === 1; index -= 1) {
    if (characters[index] === "0") {
      characters[index] = "1";
      carry = 0;
    } else {
      characters[index] = "0";
    }
  }
  return characters.join("");
}

const logicGates = {
  AND: { rule: "เอาต์พุตเป็น 1 เมื่ออินพุตทุกตัวเป็น 1", ones: 1 },
  OR: { rule: "เอาต์พุตเป็น 0 เมื่ออินพุตทุกตัวเป็น 0", ones: 3 },
  NAND: { rule: "นิเสธของ AND — เอาต์พุตเป็น 0 เมื่ออินพุตทุกตัวเป็น 1", ones: 3 },
  NOR: { rule: "นิเสธของ OR — เอาต์พุตเป็น 1 เมื่ออินพุตทุกตัวเป็น 0", ones: 1 },
  XOR: { rule: "เอาต์พุตเป็น 1 เมื่ออินพุตทั้งสองต่างกัน", ones: 2 },
  XNOR: { rule: "เอาต์พุตเป็น 1 เมื่ออินพุตทั้งสองเหมือนกัน", ones: 2 },
};

function evalGate(gate, x, y) {
  switch (gate) {
    case "AND": return x & y;
    case "OR": return x | y;
    case "NAND": return (x & y) === 1 ? 0 : 1;
    case "NOR": return (x | y) === 1 ? 0 : 1;
    case "XOR": return x ^ y;
    default: return (x ^ y) === 1 ? 0 : 1;
  }
}

function gateTruthTable(gate) {
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y]) => [x, y, evalGate(gate, x, y)]);
}

function truthTableHtml(gate) {
  const rows = gateTruthTable(gate)
    .map(([x, y, z]) => `<tr><td>${x}</td><td>${y}</td><td>${z}</td></tr>`)
    .join("");
  return `<table class="mini-table"><thead><tr><th>X</th><th>Y</th><th>Z</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function kmapLayout(variableCount) {
  if (variableCount === 2) {
    return { rows: ["0", "1"], cols: ["0", "1"], rowVars: "A", colVars: "B" };
  }
  if (variableCount === 3) {
    return { rows: ["0", "1"], cols: ["00", "01", "11", "10"], rowVars: "A", colVars: "BC" };
  }
  return { rows: ["00", "01", "11", "10"], cols: ["00", "01", "11", "10"], rowVars: "AB", colVars: "CD" };
}

function kmapHtml(variableCount, ones, highlight) {
  const layout = kmapLayout(variableCount);
  const head = layout.cols.map((column) => `<th>${column}</th>`).join("");
  const body = layout.rows
    .map((row) => {
      const cells = layout.cols
        .map((column) => {
          const minterm = parseInt(row + column, 2);
          const isOne = ones.includes(minterm);
          const classes = [isOne ? "is-one" : "", minterm === highlight ? "is-highlight" : ""]
            .filter(Boolean)
            .join(" ");
          return `<td class="${classes}"><span class="kmap-value">${isOne ? 1 : 0}</span><span class="kmap-index">${minterm}</span></td>`;
        })
        .join("");
      return `<tr><th>${row}</th>${cells}</tr>`;
    })
    .join("");
  return `<table class="kmap-table"><thead><tr><th class="kmap-corner">${layout.rowVars}\\${layout.colVars}</th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function mintermsForFixed(variableCount, variableIndex, value) {
  const list = [];
  for (let minterm = 0; minterm < 2 ** variableCount; minterm += 1) {
    const bits = minterm.toString(2).padStart(variableCount, "0");
    if (Number(bits[variableIndex]) === value) list.push(minterm);
  }
  return list;
}

function slideLevelCount(level) {
  return level === "easy" ? 2 : level === "medium" ? 3 : 4;
}

function buildComplementQuestion(level) {
  const bits = level === "hard" ? 8 : 4;
  const digits = randomDigits(2, bits);
  const kind = Math.random() < 0.5 ? "1" : "2";
  const onesComplement = digits.split("").map((digit) => (digit === "0" ? "1" : "0")).join("");
  const twosComplement = addOneBinary(onesComplement);
  const answer = kind === "1" ? onesComplement : twosComplement;

  return {
    type: "complement",
    answer,
    answerBase: 2,
    prompt: `จงหา <strong>${kind}’s complement</strong> ของ <span class="mono">${digits}</span> (${bits} บิต)`,
    hint: `ตอบเป็นเลขฐานสอง ${bits} บิต`,
    detail: detailBlock("ดูสไลด์", "บทที่ 1 · Complements of Numbers (1’s และ 2’s complement)"),
    steps: `<p>1. 1’s complement คือการกลับบิตทุกตัว (เปลี่ยน 0 เป็น 1, เปลี่ยน 1 เป็น 0)</p>
      <p class="formula">${digits} → ${onesComplement}</p>
      <p>2. 2’s complement = 1’s complement แล้วบวก 1</p>
      <p class="formula">${onesComplement} + 1 = ${twosComplement}</p>
      <p>3. คำตอบคือ <strong>${answer}</strong></p>`,
    stepsSubtitle: `หา ${kind}’s complement ของเลขฐานสอง ${bits} บิต`,
  };
}

function buildGateQuestion() {
  const names = Object.keys(logicGates);
  const gate = names[randomInt(0, names.length - 1)];
  const x = randomInt(0, 1);
  const y = randomInt(0, 1);
  const z = evalGate(gate, x, y);

  return {
    type: "gate",
    answer: String(z),
    answerBase: 10,
    prompt: `เกต <strong>${gate}</strong> มีอินพุต X = ${x}, Y = ${y} จงหาค่าเอาต์พุต Z`,
    hint: "ตอบเป็น 0 หรือ 1",
    detail: detailBlock("ตารางความจริงของเกตนี้", truthTableHtml(gate))
      + detailBlock("ดูสไลด์", `บทที่ 2 · ${gate} Gate`),
    steps: `<p>1. เกต ${gate}: ${logicGates[gate].rule}</p>
      <p>2. แทนค่า X = ${x}, Y = ${y} ลงในตารางความจริง</p>
      <p class="formula">Z = ${z}</p>
      <p>3. คำตอบคือ <strong>${z}</strong></p>`,
    stepsSubtitle: `หาค่าเอาต์พุตของเกต ${gate}`,
  };
}

function buildTruthQuestion() {
  const names = Object.keys(logicGates);
  const gate = names[randomInt(0, names.length - 1)];
  const ones = logicGates[gate].ones;

  return {
    type: "truth",
    answer: String(ones),
    answerBase: 10,
    prompt: `ตารางความจริงของเกต <strong>${gate}</strong> (อินพุต 2 ตัว) มีกี่แถวที่เอาต์พุต Z = 1`,
    hint: "ตารางความจริงของอินพุต 2 ตัวมีทั้งหมด 4 แถว",
    detail: detailBlock("ตารางความจริง", truthTableHtml(gate))
      + detailBlock("ดูสไลด์", `บทที่ 2 · ${gate} Gate`),
    steps: `<p>1. เขียนตารางความจริงของเกต ${gate} ทั้ง 4 แถว</p>
      <p class="formula">${gateTruthTable(gate).map(([x, y, z]) => `X=${x} Y=${y} → Z=${z}`).join("<br />")}</p>
      <p>2. นับแถวที่ Z = 1 ได้ <strong>${ones}</strong> แถว</p>`,
    stepsSubtitle: `นับแถวที่เอาต์พุตเป็น 1 ของเกต ${gate}`,
  };
}

function buildDemorganQuestion() {
  const useAnd = Math.random() < 0.5;
  const inner = useAnd ? "X &amp; Y" : "X | Y";
  const answer = useAnd ? "|" : "&";
  const result = useAnd ? "~X | ~Y" : "~X &amp; ~Y";

  return {
    type: "demorgan",
    answer,
    answerAliases: useAnd ? ["|", "or", "+", "OR"] : ["&", "and", "AND"],
    prompt: `ตามทฤษฎี De Morgan: ~(${inner}) = ~X <strong>___</strong> ~Y จงเติมตัวดำเนินการที่ถูกต้อง (&amp; หรือ |)`,
    hint: "ตอบเป็นเครื่องหมาย & หรือ |",
    detail: detailBlock("ทฤษฎี De Morgan", "NOT ทุกตัวแปร แล้วเปลี่ยน & เป็น | หรือเปลี่ยน | เป็น &")
      + detailBlock("ดูสไลด์", "บทที่ 2 · De Morgan’s Theorem"),
    steps: `<p>1. ทฤษฎี De Morgan: NOT ทุกตัวแปร แล้วสลับตัวดำเนินการ</p>
      <p>2. ~(${inner}) = ${result}</p>
      <p>3. ตัวดำเนินการที่ต้องเติมคือ <strong>${answer}</strong></p>`,
    stepsSubtitle: "ใช้ทฤษฎี De Morgan กระจายนิเสธ",
  };
}

function buildMintermQuestion(level) {
  const variableCount = slideLevelCount(level);
  const variables = ["A", "B", "C", "D"].slice(0, variableCount);
  const minterm = randomInt(0, 2 ** variableCount - 1);
  const bits = minterm.toString(2).padStart(variableCount, "0");
  const term = variables
    .map((variable, index) => (bits[index] === "1" ? variable : `${variable}\u0305`))
    .join("");

  return {
    type: "minterm",
    answer: String(minterm),
    answerBase: 10,
    prompt: `เทอม <span class="mono">${term}</span> ในสมการ SOP ของตัวแปร ${variables.join(", ")} ตรงกับ minterm หมายเลขใด (เลขฐานสิบ)`,
    hint: "ตัวแปรที่ไม่นิเสธแทนด้วย 1 ตัวแปรที่นิเสธแทนด้วย 0",
    detail: detailBlock("ค่าไบนารีของเทอม", `<span class="mono">${bits}</span> → ${variables.map((v, i) => `${v}=${bits[i]}`).join(", ")}`)
      + detailBlock("ดูสไลด์", "บทที่ 2 · Canonical Sum / Minterm"),
    steps: `<p>1. อ่านเทอม ${term} ทีละตัวแปร: ตัวแปรปกติ = 1, ตัวแปรที่มีบาร์ = 0</p>
      <p class="formula">${variables.map((v, i) => `${v} = ${bits[i]}`).join(", ")}</p>
      <p>2. เขียนเป็นเลขฐานสองได้ <span class="mono">${bits}</span></p>
      <p>3. แปลงเป็นฐานสิบได้ <strong>${minterm}</strong></p>`,
    stepsSubtitle: "อ่านเทอม SOP เป็นหมายเลข minterm",
  };
}

function buildGroupQuestion(level) {
  const variableCount = slideLevelCount(level);
  const size = 2 ** variableCount;
  const ones = [];
  for (let minterm = 0; minterm < size; minterm += 1) {
    if (Math.random() < 0.45) ones.push(minterm);
  }
  if (ones.length === 0) ones.push(randomInt(0, size - 1));

  return {
    type: "group",
    answer: String(ones.length),
    answerBase: 10,
    prompt: `จาก K-map ${variableCount} ตัวแปรนี้ มีช่องที่เป็น 1 ทั้งหมดกี่ช่อง`,
    hint: "นับช่องที่มีค่า 1 ในตาราง",
    detail: detailBlock("K-map", kmapHtml(variableCount, ones))
      + detailBlock("ดูสไลด์", `บทที่ 3 · K-map ขนาด ${variableCount} ตัวแปร`),
    steps: `<p>1. อ่านค่าในแต่ละช่องของ K-map</p>
      <p>2. ช่องที่เป็น 1 คือช่องหมายเลข <span class="mono">${ones.join(", ")}</span></p>
      <p>3. นับได้ทั้งหมด <strong>${ones.length}</strong> ช่อง</p>`,
    stepsSubtitle: `นับช่องที่เป็น 1 ใน K-map ${variableCount} ตัวแปร`,
  };
}

function buildSimplifyQuestion(level) {
  const variableCount = slideLevelCount(level);
  const variables = ["A", "B", "C", "D"].slice(0, variableCount);
  const variableIndex = randomInt(0, variableCount - 1);
  const value = randomInt(0, 1);
  const ones = mintermsForFixed(variableCount, variableIndex, value);
  const letter = variables[variableIndex];
  const term = value === 1 ? letter : `${letter}\u0305`;

  return {
    type: "simplify",
    answer: letter,
    answerAliases: [letter, `${letter}'`, `~${letter}`, `${letter}\u0305`, `not${letter}`],
    prompt: `f(${variables.join(", ")}) = Σm(${ones.join(", ")}) เมื่อลดรูปด้วย K-map แล้วเหลือตัวแปรใด (ตอบเฉพาะตัวอักษร)`,
    hint: "ดูว่าตัวแปรใดมีค่าไม่เปลี่ยนในทุกช่องของกลุ่ม",
    detail: detailBlock("K-map", kmapHtml(variableCount, ones))
      + detailBlock("ดูสไลด์", "บทที่ 3 · ขั้นตอนการลดรูปให้สั้นลง"),
    steps: `<p>1. เขียน 1 ลงในช่องหมายเลข ${ones.join(", ")} แล้วจัดกลุ่ม</p>
      <p>2. ในกลุ่มนี้ตัวแปรอื่นเปลี่ยนค่าไปทั้ง 0 และ 1 จึงตัดทิ้งได้</p>
      <p>3. ตัวแปร ${letter} มีค่าเป็น ${value} คงที่ทุกช่อง → ได้เทอม <span class="formula">${term}</span></p>
      <p>4. คำตอบคือตัวแปร <strong>${letter}</strong></p>`,
    stepsSubtitle: "ลดรูปสมการด้วย K-map",
  };
}

function buildCellQuestion(level) {
  const variableCount = slideLevelCount(level);
  const variables = ["A", "B", "C", "D"].slice(0, variableCount);
  const minterm = randomInt(0, 2 ** variableCount - 1);
  const bits = minterm.toString(2).padStart(variableCount, "0");

  return {
    type: "cell",
    answer: bits,
    answerBase: 2,
    prompt: `ช่องหมายเลข ${minterm} ใน K-map ${variableCount} ตัวแปร (${variables.join(", ")}) ตรงกับค่า ${variables.join(" ")} ใด`,
    hint: `ตอบเป็นเลขฐานสอง ${variableCount} บิต`,
    detail: detailBlock("K-map", kmapHtml(variableCount, [minterm], minterm))
      + detailBlock("ดูสไลด์", `บทที่ 3 · K-map ขนาด ${variableCount} ตัวแปร`),
    steps: `<p>1. เลขช่องใน K-map คือค่า minterm ของช่องนั้น</p>
      <p>2. แปลง ${minterm} เป็นเลขฐานสอง ${variableCount} บิต ได้ <span class="mono">${bits}</span></p>
      <p>3. ดังนั้น ${variables.map((v, i) => `${v} = ${bits[i]}`).join(", ")}</p>
      <p>4. คำตอบคือ <strong>${bits}</strong></p>`,
    stepsSubtitle: "อ่านค่า minterm จากช่องใน K-map",
  };
}

function selectedPracticeGroup() {
  const checked = document.querySelector('input[name="practice-group"]:checked');
  return checked ? checked.value : "base";
}

function selectedPracticeType() {
  const checked = document.querySelector('input[name="practice-type"]:checked');
  return checked ? checked.value : "convert";
}

function selectedLogicType() {
  const checked = document.querySelector('input[name="practice-logic-type"]:checked');
  return checked ? checked.value : "gate";
}

function selectedKmapType() {
  const checked = document.querySelector('input[name="practice-kmap-type"]:checked');
  return checked ? checked.value : "group";
}

function practiceBase() {
  const value = practiceBaseSelect.value;
  if (value !== "mixed") return Number(value);
  return [2, 8, 10, 16][randomInt(0, 3)];
}

function buildSlideQuestion(group, level) {
  if (group === "logic") {
    const requested = selectedLogicType();
    const type = requested === "mixed"
      ? ["gate", "truth", "demorgan", "minterm"][randomInt(0, 3)]
      : requested;
    if (type === "gate") return buildGateQuestion();
    if (type === "truth") return buildTruthQuestion();
    if (type === "demorgan") return buildDemorganQuestion();
    return buildMintermQuestion(level);
  }

  const requested = selectedKmapType();
  const type = requested === "mixed"
    ? ["group", "simplify", "cell"][randomInt(0, 2)]
    : requested;
  if (type === "group") return buildGroupQuestion(level);
  if (type === "simplify") return buildSimplifyQuestion(level);
  return buildCellQuestion(level);
}

function buildPracticeQuestion() {
  const group = selectedPracticeGroup();
  const slideLevel = practiceLevels[practiceLevelSlidesSelect.value] || practiceLevels.medium;

  if (group === "logic" || group === "kmap") {
    return buildSlideQuestion(group, practiceLevelSlidesSelect.value);
  }

  if (group === "all") {
    const pick = randomInt(0, 2);
    if (pick === 1) return buildSlideQuestion("logic", practiceLevelSlidesSelect.value);
    if (pick === 2) return buildSlideQuestion("kmap", practiceLevelSlidesSelect.value);
  }

  const requestedType = selectedPracticeType();
  const type = requestedType === "mixed"
    ? ["convert", "add", "subtract", "multiply", "divide", "complement"][randomInt(0, 5)]
    : requestedType;
  const level = practiceLevels[practiceLevelSelect.value] || practiceLevels.medium;
  const base = practiceBase();
  const length = randomInt(level.min, level.max);

  if (type === "complement") {
    return buildComplementQuestion(practiceLevelSelect.value);
  }

  if (type === "convert") {
    const targetBase = [2, 8, 10, 16].filter((candidate) => candidate !== base)[randomInt(0, 2)];
    const digits = randomDigits(base, length);
    const value = parseInteger(digits, base).value;
    return {
      type,
      base,
      targetBase,
      digits,
      value,
      answer: convertToBase(value, targetBase),
      prompt: `แปลง <span class="mono">${digits}</span> (ฐาน ${base}) เป็นฐาน ${targetBase}`,
      hint: `คำตอบเป็นตัวเลขในฐาน ${targetBase}`,
      detail: detailLines([
        ["ฐานต้นทาง", baseLine(base)],
        ["ฐานปลายทาง", baseLine(targetBase)],
        ["จำนวนหลัก", `${digits.length} หลัก`],
        ["ค่าประจำตำแหน่ง", `<span class="formula">${placeValues(digits, base)}</span>`],
        ["วิธีทำ", `แปลงเป็นฐานสิบก่อน แล้วหารด้วย ${targetBase} ซ้ำ ๆ อ่านเศษจากล่างขึ้นบน`],
      ]),
    };
  }

  const aDigits = randomDigits(base, length);
  const bDigits = randomDigits(base, Math.max(1, length - 1));
  const a = parseInteger(aDigits, base).value;
  const b = parseInteger(bDigits, base).value;

  if (type === "add") {
    return {
      type, base, aDigits, bDigits, a, b,
      answer: convertToBase(a + b, base),
      prompt: `<span class="mono">${aDigits}</span> + <span class="mono">${bDigits}</span> ในฐาน ${base} เท่ากับเท่าไร`,
      hint: "ตอบเป็นตัวเลขในฐานเดียวกัน",
      detail: detailLines([
        ["ฐานที่ใช้", baseLine(base)],
        ["ตัวตั้ง", `<span class="mono">${aDigits}</span> (${aDigits.length} หลัก)`],
        ["ตัวบวก", `<span class="mono">${bDigits}</span> (${bDigits.length} หลัก)`],
        ["ค่าประจำตำแหน่งของตัวตั้ง", `<span class="formula">${placeValues(aDigits, base)}</span>`],
        ["วิธีทำ", `เขียนตัวเลขให้หลักตรงกัน แล้วบวกทีละหลักจากขวาไปซ้าย ถ้าผลรวมถึง ${base} ให้ทด 1 ไปหลักถัดไป`],
      ]),
    };
  }

  if (type === "subtract") {
    const left = a >= b ? a : b;
    const right = a >= b ? b : a;
    const leftDigits = a >= b ? aDigits : bDigits;
    const rightDigits = a >= b ? bDigits : aDigits;
    return {
      type, base, aDigits: leftDigits, bDigits: rightDigits, a: left, b: right,
      answer: convertToBase(left - right, base),
      prompt: `<span class="mono">${leftDigits}</span> − <span class="mono">${rightDigits}</span> ในฐาน ${base} เท่ากับเท่าไร`,
      hint: "ตอบเป็นตัวเลขในฐานเดียวกัน",
      detail: detailLines([
        ["ฐานที่ใช้", baseLine(base)],
        ["ตัวตั้ง", `<span class="mono">${leftDigits}</span> (${leftDigits.length} หลัก)`],
        ["ตัวลบ", `<span class="mono">${rightDigits}</span> (${rightDigits.length} หลัก)`],
        ["ค่าประจำตำแหน่งของตัวตั้ง", `<span class="formula">${placeValues(leftDigits, base)}</span>`],
        ["วิธีทำ", `ลบทีละหลักจากขวาไปซ้าย ถ้าหลักบนน้อยกว่าหลักล่างให้ยืม ${base} จากหลักถัดไป`],
      ]),
    };
  }

  if (type === "multiply") {
    const smallDigits = randomDigits(base, 1);
    const small = parseInteger(smallDigits, base).value;
    return {
      type, base, aDigits, bDigits: smallDigits, a, b: small,
      answer: convertToBase(a * small, base),
      prompt: `<span class="mono">${aDigits}</span> × <span class="mono">${smallDigits}</span> ในฐาน ${base} เท่ากับเท่าไร`,
      hint: "ตอบเป็นตัวเลขในฐานเดียวกัน",
      detail: detailLines([
        ["ฐานที่ใช้", baseLine(base)],
        ["ตัวตั้ง", `<span class="mono">${aDigits}</span> (${aDigits.length} หลัก)`],
        ["ตัวคูณ", `<span class="mono">${smallDigits}</span> (1 หลัก)`],
        ["ค่าประจำตำแหน่งของตัวตั้ง", `<span class="formula">${placeValues(aDigits, base)}</span>`],
        ["วิธีทำ", `คูณทีละหลักจากขวาไปซ้าย แล้วทดผลลัพธ์ที่เกิน ${base} ไปหลักถัดไป`],
      ]),
    };
  }

  const divisorDigits = randomDigits(base, 1);
  const divisor = parseInteger(divisorDigits, base).value;
  const quotient = a / divisor;
  const remainder = a % divisor;
  return {
    type, base, aDigits, bDigits: divisorDigits, a, b: divisor,
    answer: convertToBase(quotient, base),
    remainder: convertToBase(remainder, base),
    prompt: `<span class="mono">${aDigits}</span> ÷ <span class="mono">${divisorDigits}</span> ในฐาน ${base} ได้ผลหารเท่าไร`,
    hint: "ตอบเฉพาะผลหาร (ไม่ต้องใส่เศษ)",
    detail: detailLines([
      ["ฐานที่ใช้", baseLine(base)],
      ["ตัวตั้ง", `<span class="mono">${aDigits}</span> (${aDigits.length} หลัก)`],
      ["ตัวหาร", `<span class="mono">${divisorDigits}</span> (1 หลัก)`],
      ["ค่าประจำตำแหน่งของตัวตั้ง", `<span class="formula">${placeValues(aDigits, base)}</span>`],
      ["วิธีทำ", `แบ่งกลุ่มหลักจากซ้ายไปขวา หาว่าตัวหารคูณกับเลขใดได้ไม่เกินค่าที่เหลือ แล้วนำมาลบ ทำซ้ำจนครบทุกหลัก`],
    ]),
  };
}

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderTimer() {
  const remaining = practiceState.remaining;
  practiceTimerValue.textContent = formatClock(remaining);
  practiceTimerFill.style.width = `${(remaining / QUESTION_SECONDS) * 100}%`;
  practiceTimerTrack.setAttribute("aria-valuenow", String(remaining));
  practiceTimer.classList.toggle("is-warning", remaining <= 120 && remaining > 60);
  practiceTimer.classList.toggle("is-danger", remaining <= 60 && remaining > 0);
  practiceTimer.classList.toggle("is-expired", remaining <= 0);
}

function stopTimer() {
  if (practiceState.timerId !== null) {
    window.clearInterval(practiceState.timerId);
    practiceState.timerId = null;
  }
}

function startTimer() {
  stopTimer();
  practiceState.remaining = QUESTION_SECONDS;
  practiceState.elapsed = 0;
  practiceState.timedOut = false;
  renderTimer();
  practiceState.timerId = window.setInterval(() => {
    practiceState.remaining -= 1;
    practiceState.elapsed += 1;
    renderTimer();
    if (practiceState.remaining <= 0) {
      stopTimer();
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  if (practiceState.answered) return;
  practiceState.timedOut = true;
  practiceState.answered = true;
  practiceState.wrong += 1;
  practiceState.streak = 0;
  updateScoreboard();
  renderSetProgress();
  practiceFeedback.className = "feedback is-wrong";
  practiceFeedback.innerHTML = `<strong>หมดเวลา</strong> คำตอบที่ถูกคือ <span class="mono">${practiceState.question.answer}</span>`;
  practiceFeedback.hidden = false;
  practiceNextButton.hidden = false;
  renderPracticeSteps(practiceState.question);
  practiceStepsCard.hidden = false;
}

function renderPracticeQuestion() {
  const question = practiceState.question;
  practiceTag.textContent = practiceTypeNames[question.type];
  practiceCount.textContent = practiceState.round > 1
    ? `ทบทวนรอบ ${practiceState.round} · ข้อที่ ${practiceState.index}`
    : `ข้อที่ ${practiceState.index} / ${SET_SIZE}`;
  practiceQuestion.innerHTML = question.prompt;
  practiceHint.textContent = question.hint;
  practiceDetail.innerHTML = question.detail || "";
  practiceAnswer.value = "";
  practiceError.hidden = true;
  practiceFeedback.hidden = true;
  practiceFeedback.className = "feedback";
  practiceStepsContent.innerHTML = "";
  practiceStepsSubtitle.textContent = "จะแสดงหลังตรวจคำตอบ";
  practiceStepsCard.hidden = true;
  practiceNextButton.hidden = true;
  practiceSkipButton.hidden = true;
  practiceState.answered = false;
  startTimer();
}

function renderSetProgress() {
  const done = practiceState.correct + practiceState.wrong;
  practiceProgressValue.textContent = `${done} / ${SET_SIZE}`;
  practiceProgressFill.style.width = `${(done / SET_SIZE) * 100}%`;
  practiceProgressTrack.setAttribute("aria-valuenow", String(done));
}

function buildQuestionSet() {
  const set = [];
  for (let index = 0; index < SET_SIZE; index += 1) {
    set.push({ ...buildPracticeQuestion(), solved: false });
  }
  return set;
}

function startSet() {
  practiceState.queue = buildQuestionSet();
  practiceState.retry = [];
  practiceState.round = 1;
  practiceState.finished = false;
  practiceState.correct = 0;
  practiceState.wrong = 0;
  practiceState.streak = 0;
  practiceState.index = 0;
  practiceState.totalSeconds = 0;
  practiceState.entryId = "";
  practiceSummary.hidden = true;
  practiceProgress.hidden = false;
  practiceSetup.hidden = true;
  practiceSettings.hidden = false;
  updateScoreboard();
  renderSetProgress();
  newPracticeQuestion();
}

function showSetup() {
  stopTimer();
  practiceState.question = null;
  practiceState.finished = true;
  practiceSetup.hidden = false;
  practiceSettings.hidden = true;
  practiceSummary.hidden = true;
  practiceProgress.hidden = true;
  practiceTimer.hidden = true;
  practiceNextButton.hidden = true;
  practiceSkipButton.hidden = true;
  practiceStepsCard.hidden = true;
  practiceFeedback.hidden = true;
  practiceAnswer.value = "";
  practiceQuestion.textContent = "เลือกประเภทโจทย์แล้วกดสุ่มโจทย์ 10 ข้อ";
  practiceHint.textContent = "";
  practiceDetail.innerHTML = "";
  practiceTag.textContent = "พร้อมฝึก";
  practiceCount.textContent = `0 / ${SET_SIZE}`;
}

function finishSet() {
  stopTimer();
  practiceState.finished = true;
  practiceState.totalSeconds += practiceState.elapsed;
  practiceState.elapsed = 0;
  practiceState.question = null;
  practiceNextButton.hidden = true;
  practiceSkipButton.hidden = true;
  practiceAnswer.value = "";
  practiceFeedback.hidden = true;
  practiceStepsCard.hidden = true;
  practiceProgress.hidden = true;
  practiceTimer.hidden = true;

  const answered = practiceState.correct + practiceState.wrong;
  const total = practiceState.totalSeconds;
  const missed = SET_SIZE - practiceState.correct;
  summaryName.textContent = practiceState.player;
  summaryCorrect.textContent = practiceState.correct;
  summaryWrong.textContent = practiceState.wrong;
  summaryTotal.textContent = formatClock(total);
  summaryAverage.textContent = formatClock(answered > 0 ? total / answered : 0);
  summaryNote.textContent = missed === 0
    ? `ทำครบ ${SET_SIZE} ข้อ ถูกทั้งหมด ใช้เวลารวม ${formatClock(total)}`
    : `ทำครบ ${SET_SIZE} ข้อ ยังเหลือ ${missed} ข้อที่ยังตอบไม่ถูก ใช้เวลารวม ${formatClock(total)}`;
  practiceSummary.hidden = false;
  saveScore();
  practiceSummary.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function newPracticeQuestion() {
  practiceState.totalSeconds += practiceState.elapsed;
  practiceState.index += 1;
  practiceState.question = practiceState.queue.shift();
  practiceTimer.hidden = false;
  renderPracticeQuestion();
  practiceAnswer.focus();
}

function advanceSet() {
  const current = practiceState.question;
  const hasNextRound = practiceState.round < MAX_ROUNDS;
  if (current && !current.solved && hasNextRound) {
    practiceState.retry.push(current);
  }
  practiceState.question = null;

  if (practiceState.queue.length > 0) {
    newPracticeQuestion();
    return;
  }
  if (practiceState.retry.length > 0) {
    practiceState.round += 1;
    practiceState.queue = practiceState.retry;
    practiceState.retry = [];
    newPracticeQuestion();
    return;
  }
  finishSet();
}

function skipQuestion() {
  if (!practiceState.question) return;
  stopTimer();
  practiceState.totalSeconds += practiceState.elapsed;
  practiceState.elapsed = 0;
  advanceSet();
}

function renderPracticeSteps(question) {
  if (question.steps) {
    practiceStepsContent.innerHTML = question.steps;
    practiceStepsSubtitle.textContent = question.stepsSubtitle || "วิธีคิด";
    return;
  }

  const { type, base, bDigits } = question;
  const aDigits = question.aDigits || question.digits;

  if (type === "convert") {
    const value = question.value;
    const divisions = [];
    let remaining = value;
    if (remaining === 0n) {
      divisions.push(`0 ÷ ${question.targetBase} = 0 เศษ 0`);
    } else {
      const targetBigInt = BigInt(question.targetBase);
      while (remaining > 0n) {
        const quotient = remaining / targetBigInt;
        const remainder = remaining % targetBigInt;
        divisions.push(`${remaining} ÷ ${question.targetBase} = ${quotient} เศษ ${toDigitString(Number(remainder))}`);
        remaining = quotient;
      }
    }
    const expanded = Array.from(aDigits, (digit, index) => {
      const power = aDigits.length - index - 1;
      return `${digitValue(digit)} × ${base}^${power}`;
    });
    practiceStepsContent.innerHTML = `
      <p>1. แปลงเป็นฐานสิบ: <span class="formula"><strong>(${expanded.join(" + ")}) = ${value}</strong></span></p>
      <p>2. นำฐานสิบไปหารด้วย ${question.targetBase} ซ้ำ ๆ แล้วอ่านเศษจากล่างขึ้นบน:</p>
      <p class="formula">${divisions.join("<br />")}</p>
      <p>3. คำตอบคือ <strong>${question.answer}</strong> ในฐาน ${question.targetBase}</p>
    `;
    practiceStepsSubtitle.textContent = `แปลงจากฐาน ${base} เป็นฐาน ${question.targetBase}`;
    return;
  }

  if (type === "add" || type === "subtract") {
    const columns = type === "add"
      ? columnAddition(aDigits, bDigits, base)
      : columnSubtraction(aDigits, bDigits, base);
    const decimalCheck = type === "add" ? question.a + question.b : question.a - question.b;
    practiceStepsContent.innerHTML = `
      <p>1. ${type === "add" ? "บวก" : "ลบ"}ทีละหลักในฐาน ${base}:</p>
      <p class="formula">${columns.lines.join("<br />")}</p>
      <p>2. ตรวจสอบด้วยฐานสิบ: <span class="formula"><strong>${question.a} ${type === "add" ? "+" : "−"} ${question.b} = ${decimalCheck}</strong></span></p>
      <p>3. คำตอบคือ <strong>${question.answer}</strong> ในฐาน ${base}</p>
    `;
    practiceStepsSubtitle.textContent = `${type === "add" ? "บวก" : "ลบ"}ในฐาน ${base}`;
    return;
  }

  if (type === "multiply") {
    practiceStepsContent.innerHTML = `
      <p>1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${aDigits} = ${question.a}</strong></span> และ <span class="formula"><strong>${bDigits} = ${question.b}</strong></span></p>
      <p>2. คูณในฐานสิบ: <span class="formula"><strong>${question.a} × ${question.b} = ${question.a * question.b}</strong></span></p>
      <p>3. แปลงกลับเป็นฐาน ${base} ได้ <strong>${question.answer}</strong></p>
    `;
    practiceStepsSubtitle.textContent = `คูณในฐาน ${base}`;
    return;
  }

  practiceStepsContent.innerHTML = `
    <p>1. แปลงเป็นฐานสิบ: <span class="formula"><strong>${aDigits} = ${question.a}</strong></span> และ <span class="formula"><strong>${bDigits} = ${question.b}</strong></span></p>
    <p>2. หารในฐานสิบ: <span class="formula"><strong>${question.a} ÷ ${question.b} = ${question.a / question.b} เศษ ${question.a % question.b}</strong></span></p>
    <p>3. แปลงกลับเป็นฐาน ${base}: ผลหาร = <strong>${question.answer}</strong>, เศษ = <strong>${question.remainder}</strong></p>
  `;
  practiceStepsSubtitle.textContent = `หารในฐาน ${base}`;
}

function updateScoreboard() {
  scoreCorrect.textContent = practiceState.correct;
  scoreWrong.textContent = practiceState.wrong;
  scoreStreak.textContent = practiceState.streak;
}

function checkPracticeAnswer() {
  const question = practiceState.question;
  if (!question || practiceState.answered) return;

  const raw = practiceAnswer.value.trim();
  if (!raw) {
    practiceError.textContent = "กรุณากรอกคำตอบก่อนตรวจ";
    practiceError.hidden = false;
    return;
  }

  let parsed = null;
  const isTextAnswer = !question.answerBase && Array.isArray(question.answerAliases);
  const answerBase = question.answerBase
    || (question.type === "convert" ? question.targetBase : question.base);
  const aliasMatch = (question.answerAliases || []).some(
    (alias) => alias.trim().toUpperCase() === raw.toUpperCase(),
  );

  if (!aliasMatch && !isTextAnswer) {
    try {
      parsed = parseInteger(raw, answerBase);
    } catch (error) {
      practiceError.textContent = error.message;
      practiceError.hidden = false;
      return;
    }
  }

  practiceError.hidden = true;
  practiceState.answered = true;
  stopTimer();
  const expected = isTextAnswer ? null : parseInteger(question.answer, answerBase).value;
  const isCorrect = aliasMatch || (parsed !== null && parsed.value === expected);

  if (isCorrect) {
    practiceState.correct += 1;
    practiceState.streak += 1;
    question.solved = true;
    practiceFeedback.className = "feedback is-correct";
    practiceFeedback.innerHTML = `<strong>ถูกต้อง!</strong> คำตอบคือ <span class="mono">${question.answer}</span>`;
    practiceNextButton.hidden = false;
  } else {
    practiceState.wrong += 1;
    practiceState.streak = 0;
    practiceFeedback.className = "feedback is-wrong";
    practiceFeedback.innerHTML = `<strong>ยังไม่ถูก</strong> คำตอบที่ถูกคือ <span class="mono">${question.answer}</span>`;
    practiceSkipButton.hidden = false;
  }

  practiceFeedback.hidden = false;
  updateScoreboard();
  renderSetProgress();
  renderPracticeSteps(question);
  practiceStepsCard.hidden = false;
}

function readLeaderboard() {
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLeaderboard(entries) {
  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — คะแนนจะไม่ถูกบันทึก */
  }
}

function saveScore() {
  if (!practiceState.player || practiceState.correct === 0) return;
  const entries = readLeaderboard();
  const answered = practiceState.correct + practiceState.wrong;
  const totalSeconds = practiceState.totalSeconds + practiceState.elapsed;
  const record = {
    id: practiceState.entryId || `e${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
    name: practiceState.player,
    correct: practiceState.correct,
    wrong: practiceState.wrong,
    averageSeconds: answered > 0 ? Math.round(totalSeconds / answered) : 0,
    at: Date.now(),
  };
  practiceState.entryId = record.id;

  const existing = entries.findIndex((entry) => entry.id === record.id);
  if (existing >= 0) entries[existing] = record;
  else entries.push(record);

  entries.sort((a, b) => b.correct - a.correct || a.averageSeconds - b.averageSeconds);
  writeLeaderboard(entries.slice(0, 50));
  renderLeaderboard();
}
function renderLeaderboard() {
  const entries = readLeaderboard()
    .sort((a, b) => b.correct - a.correct || a.averageSeconds - b.averageSeconds)
    .slice(0, 10);

  leaderboardEmpty.hidden = entries.length > 0;
  leaderboardBody.innerHTML = "";

  const top = entries.slice(0, 3);
  leaderboardPodium.hidden = top.length === 0;
  leaderboardPodium.querySelectorAll(".podium-spot").forEach((spot) => {
    const rank = Number(spot.dataset.rank);
    const entry = top[rank - 1];
    const name = spot.querySelector('[data-slot="name"]');
    const score = spot.querySelector('[data-slot="score"]');
    const meta = spot.querySelector('[data-slot="meta"]');
    const avatar = spot.querySelector('[data-slot="avatar"]');
    if (!entry) {
      spot.hidden = true;
      return;
    }
    spot.hidden = false;
    name.textContent = entry.name;
    score.textContent = entry.correct;
    meta.textContent = `ตอบถูก · เฉลี่ย ${formatClock(entry.averageSeconds)}`;
    avatar.textContent = entry.name.trim().charAt(0).toUpperCase() || "?";
  });

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    if (index < 3) row.className = "is-top";
    row.innerHTML = `
      <td class="rank-cell">${index + 1}</td>
      <td class="name-cell">${escapeHtml(entry.name)}</td>
      <td>${entry.correct}</td>
      <td>${entry.wrong}</td>
      <td>${formatClock(entry.averageSeconds)}</td>
    `;
    leaderboardBody.append(row);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function startPractice(name) {
  practiceState.player = name;
  practicePlayerName.textContent = name;
  practiceGate.hidden = true;
  practiceBody.hidden = false;
  showSetup();
}

practiceNameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = practiceNameInput.value.trim();
  if (!name) {
    practiceNameError.textContent = "กรุณาใส่ชื่อก่อนเริ่มฝึก";
    practiceNameError.hidden = false;
    return;
  }
  practiceNameError.hidden = true;
  try {
    window.localStorage.setItem(PLAYER_KEY, name);
  } catch {
    /* storage unavailable */
  }
  startPractice(name);
});

practiceChangeName.addEventListener("click", () => {
  saveScore();
  stopTimer();
  practiceState.player = "";
  practiceGate.hidden = false;
  practiceBody.hidden = true;
  practiceNameInput.value = "";
  practiceNameInput.focus();
});

practiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkPracticeAnswer();
});

practiceNewButton.addEventListener("click", startSet);
practiceSkipButton.addEventListener("click", skipQuestion);
practiceNextButton.addEventListener("click", advanceSet);
summaryAgain.addEventListener("click", startSet);
summaryLeaderboard.addEventListener("click", () => activateTab("leaderboard"));
practiceSettings.addEventListener("click", showSetup);

practiceResetButton.addEventListener("click", startSet);

function syncPracticeGroups() {
  const group = selectedPracticeGroup();
  const isBase = group === "base";
  const isLogic = group === "logic";
  const isKmap = group === "kmap";

  practiceBaseGroup.hidden = !isBase;
  practiceLogicGroup.hidden = !isLogic;
  practiceKmapGroup.hidden = !isKmap;
  practiceBaseFilters.hidden = !isBase;
  practiceSlideFilters.hidden = isBase;
}

document.querySelectorAll('input[name="practice-group"]').forEach((input) => {
  input.addEventListener("change", () => {
    syncPracticeGroups();
    if (practiceSetup.hidden) return;
    practiceNewButton.focus();
  });
});

document.querySelectorAll('input[name="practice-type"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (practiceSetup.hidden) return;
    practiceNewButton.focus();
  });
});

document.querySelectorAll('input[name="practice-logic-type"], input[name="practice-kmap-type"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (practiceSetup.hidden) return;
    practiceNewButton.focus();
  });
});

practiceLevelSlidesSelect.addEventListener("change", () => {
  if (practiceSetup.hidden) return;
  practiceNewButton.focus();
});

syncPracticeGroups();

practiceBaseSelect.addEventListener("change", () => {
  if (practiceSetup.hidden) return;
  practiceNewButton.focus();
});

practiceLevelSelect.addEventListener("change", () => {
  if (practiceSetup.hidden) return;
  practiceNewButton.focus();
});

document.querySelector("#footer-year").textContent = new Date().getFullYear();
tryConvert();
tryCalculate();
renderLeaderboard();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

let savedPlayer = "";
try {
  savedPlayer = window.localStorage.getItem(PLAYER_KEY) || "";
} catch {
  savedPlayer = "";
}
if (savedPlayer) {
  practiceNameInput.value = savedPlayer;
}
practiceNameInput.focus();
