let journals = JSON.parse(localStorage.getItem("journals")) || [];
let diaries = JSON.parse(localStorage.getItem("diaries")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let selectedMood = "🙂";

document.addEventListener("DOMContentLoaded", () => {

  const date = new Date();

  document.getElementById("today").textContent =
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  renderJournals();
  renderDiaries();
  renderTransactions();
  updateFinance();
});


function showPage(page) {

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  document.getElementById(page).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   JOURNAL
========================= */

function selectMood(mood) {
  selectedMood = mood;
}

function saveJournal() {

  const text = document.getElementById("journalText").value;
  const goal = document.getElementById("journalGoal").value;

  if (!text.trim()) {
    alert("Tuliskan jurnalmu terlebih dahulu.");
    return;
  }

  const journal = {
    id: Date.now(),
    date: new Date().toLocaleString("id-ID"),
    mood: selectedMood,
    text,
    goal
  };

  journals.unshift(journal);

  localStorage.setItem(
    "journals",
    JSON.stringify(journals)
  );

  document.getElementById("journalText").value = "";
  document.getElementById("journalGoal").value = "";

  renderJournals();

  alert("Jurnal berhasil disimpan.");
}


function renderJournals() {

  const container = document.getElementById("journalList");

  container.innerHTML = "";

  journals.forEach(journal => {

    container.innerHTML += `
      <div class="card">
        <small>${journal.date}</small>

        <h3>
          ${journal.mood}
          Jurnal Hari Ini
        </h3>

        <p>${escapeHTML(journal.text)}</p>

        ${
          journal.goal
          ? `<p><strong>🎯 Target:</strong> ${escapeHTML(journal.goal)}</p>`
          : ""
        }
      </div>
    `;

  });
}


/* =========================
   DIARY
========================= */

function saveDiary() {

  const title =
    document.getElementById("diaryTitle").value;

  const text =
    document.getElementById("diaryText").value;

  if (!title || !text) {
    alert("Lengkapi judul dan isi diary.");
    return;
  }

  diaries.unshift({
    id: Date.now(),
    date: new Date().toLocaleString("id-ID"),
    title,
    text
  });

  localStorage.setItem(
    "diaries",
    JSON.stringify(diaries)
  );

  document.getElementById("diaryTitle").value = "";
  document.getElementById("diaryText").value = "";

  renderDiaries();
}


function renderDiaries() {

  const container = document.getElementById("diaryList");

  container.innerHTML = "";

  diaries.forEach(diary => {

    container.innerHTML += `
      <div class="card">
        <small>${diary.date}</small>
        <h3>${escapeHTML(diary.title)}</h3>
        <p>${escapeHTML(diary.text)}</p>
      </div>
    `;

  });
}


/* =========================
   FINANCE
========================= */

function addTransaction() {

  const type =
    document.getElementById("transactionType").value;

  const amount =
    Number(document.getElementById("transactionAmount").value);

  const note =
    document.getElementById("transactionNote").value;

  if (!amount || !note) {
    alert("Lengkapi transaksi.");
    return;
  }

  transactions.unshift({
    id: Date.now(),
    type,
    amount,
    note,
    date: new Date().toLocaleString("id-ID")
  });

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  document.getElementById("transactionAmount").value = "";
  document.getElementById("transactionNote").value = "";

  renderTransactions();
  updateFinance();
}


function renderTransactions() {

  const container =
    document.getElementById("transactionList");

  container.innerHTML = "";

  transactions.forEach(transaction => {

    const sign =
      transaction.type === "income"
      ? "+"
      : "-";

    container.innerHTML += `
      <div class="card transaction">

        <div>
          <strong>${escapeHTML(transaction.note)}</strong>
          <br>
          <small>${transaction.date}</small>
        </div>

        <strong class="${
          transaction.type === "income"
          ? "income-text"
          : "expense-text"
        }">
          ${sign}${formatRupiah(transaction.amount)}
        </strong>

      </div>
    `;

  });
}


function updateFinance() {

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {

    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
    }

  });

  const balance = income - expense;

  document.getElementById("income").textContent =
    formatRupiah(income);

  document.getElementById("expense").textContent =
    formatRupiah(expense);

  document.getElementById("financeBalance").textContent =
    formatRupiah(balance);

  document.getElementById("balance").textContent =
    formatRupiah(balance);

  updateAIMessage(expense);
}


function formatRupiah(number) {

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);

}


/* =========================
   TRACKER
========================= */

function updateHabit() {

  const habits =
    document.querySelectorAll(".habit input");

  const completed =
    [...habits].filter(h => h.checked).length;

  const percentage =
    Math.round((completed / habits.length) * 100);

  document.getElementById("productivity").textContent =
    percentage + "%";

}


/* =========================
   AI COACH
========================= */

function sendAI() {

  const input =
    document.getElementById("aiInput");

  const message =
    input.value.trim();

  if (!message) return;

  addChatMessage(message, "user");

  input.value = "";

  setTimeout(() => {

    const response = generateAIResponse(message);

    addChatMessage(response, "ai");

  }, 500);
}


function addChatMessage(text, type) {

  const chat =
    document.getElementById("chatMessages");

  const message =
    document.createElement("div");

  message.className = `message ${type}`;

  message.textContent = text;

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}


function generateAIResponse(message) {

  const text = message.toLowerCase();

  if (
    text.includes("malas") ||
    text.includes("mager")
  ) {
    return "Jangan mencoba menyelesaikan semuanya sekaligus. Pilih satu tugas paling penting dan kerjakan selama 10 menit.";
  }

  if (
    text.includes("boros") ||
    text.includes("uang") ||
    text.includes("belanja")
  ) {
    return "Sebelum membeli sesuatu, tanyakan: apakah ini kebutuhan, keinginan, atau pelarian emosional?";
  }

  if (
    text.includes("sedih") ||
    text.includes("down")
  ) {
    return "Tidak semua hari harus produktif maksimal. Hari yang berat tetap layak dijalani dengan satu langkah kecil.";
  }

  if (
    text.includes("target") ||
    text.includes("tujuan")
  ) {
    return "Pilih satu target utama hari ini. Setelah selesai, baru tambahkan target berikutnya.";
  }

  return "Aku dengar kamu. Coba ceritakan lebih detail. Apa hal utama yang sedang kamu hadapi sekarang?";
}


function updateAIMessage(expense) {

  const message =
    document.getElementById("aiMessage");

  if (expense > 500000) {

    message.textContent =
      "Pengeluaranmu mulai meningkat. Sebelum membeli sesuatu lagi, tanyakan apakah itu benar-benar diperlukan.";

  } else {

    message.textContent =
      "Tetap fokus pada hal penting hari ini. Sedikit kemajuan tetap merupakan kemajuan.";

  }

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
