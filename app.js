let loggedPatient = null;

const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

const daysMap = {
  0: "Domenica",
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato"
};

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function getTodayName() {
  return daysMap[new Date().getDay()];
}

function buildWeeklyTable() {
  const tableBody = document.getElementById("weeklyTable");

  tableBody.innerHTML = days.map(day => `
    <tr>
      <td>${day}</td>
      <td><textarea id="${day}-breakfast" placeholder="Colazione di ${day}"></textarea></td>
      <td><textarea id="${day}-lunch" placeholder="Pranzo di ${day}"></textarea></td>
      <td><textarea id="${day}-snack" placeholder="Spuntino di ${day}"></textarea></td>
      <td><textarea id="${day}-dinner" placeholder="Cena di ${day}"></textarea></td>
    </tr>
  `).join("");
}

function publishWeeklyDiet() {
  const patientName = document.getElementById("patientName").value.trim();
  const saveMessage = document.getElementById("saveMessage");

  if (!patientName) {
    saveMessage.textContent = "Inserisci il nome del paziente prima di pubblicare il piano.";
    saveMessage.classList.add("danger-text");
    return;
  }

  days.forEach(day => {
    const diet = {
      patientName,
      day,
      breakfast: document.getElementById(`${day}-breakfast`).value.trim(),
      lunch: document.getElementById(`${day}-lunch`).value.trim(),
      snack: document.getElementById(`${day}-snack`).value.trim(),
      dinner: document.getElementById(`${day}-dinner`).value.trim()
    };

    const storageKey = `${normalizeName(patientName)}-${day}`;
    localStorage.setItem(storageKey, JSON.stringify(diet));
  });

  saveMessage.textContent = `Piano settimanale pubblicato per ${patientName}.`;
  saveMessage.classList.remove("danger-text");
}

function fillExampleDiet() {
  document.getElementById("patientName").value = "Mario Rossi";

  const examples = {
    breakfast: "Yogurt greco, frutta fresca e fiocchi d'avena",
    lunch: "Riso basmati con pollo, zucchine e olio EVO",
    snack: "Frutta secca e una mela",
    dinner: "Salmone al forno con verdure e pane integrale"
  };

  days.forEach(day => {
    document.getElementById(`${day}-breakfast`).value = examples.breakfast;
    document.getElementById(`${day}-lunch`).value = examples.lunch;
    document.getElementById(`${day}-snack`).value = examples.snack;
    document.getElementById(`${day}-dinner`).value = examples.dinner;
  });
}

function goToPatientPage() {
  document.getElementById("nutritionistPage").classList.add("hidden");
  document.getElementById("patientPage").classList.remove("hidden");
}

function goToNutritionistPage() {
  document.getElementById("patientPage").classList.add("hidden");
  document.getElementById("nutritionistPage").classList.remove("hidden");
}

function fakeLogin() {
  const loginName = document.getElementById("loginName").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  if (!loginName) {
    loginMessage.textContent = "Inserisci il nome del paziente.";
    return;
  }

  loggedPatient = loginName;
  const today = getTodayName();

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("patientBox").classList.remove("hidden");
  document.getElementById("patientBadge").textContent = loginName;
  document.getElementById("welcomeTitle").textContent = `Ciao, ${loginName}`;
  loginMessage.textContent = "";

  setActiveDay(today);
}

function buildDaysNav() {
  const daysNav = document.getElementById("daysNav");

  daysNav.innerHTML = days.map(day => `
    <button class="day-tab" data-day="${day}" onclick="setActiveDay('${day}')">${day}</button>
  `).join("");
}

function setActiveDay(day) {
  document.querySelectorAll(".day-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.day === day);
  });

  showDiet(day);
}

function showDiet(selectedDay) {
  const dietResult = document.getElementById("dietResult");

  if (!loggedPatient) return;

  const storageKey = `${normalizeName(loggedPatient)}-${selectedDay}`;
  const savedDiet = localStorage.getItem(storageKey);

  if (!savedDiet) {
    dietResult.innerHTML = `<p class="danger-text">Nessuna dieta trovata per ${selectedDay}.</p>`;
    return;
  }

  const diet = JSON.parse(savedDiet);
  const todayLabel = selectedDay === getTodayName() ? "Oggi" : selectedDay;

  dietResult.innerHTML = `
    <h3>${todayLabel} - ${diet.day}</h3>
    <div class="meal-grid">
      <div class="meal-card"><strong>Colazione</strong>${diet.breakfast || "Non inserita"}</div>
      <div class="meal-card"><strong>Pranzo</strong>${diet.lunch || "Non inserito"}</div>
      <div class="meal-card"><strong>Spuntino</strong>${diet.snack || "Non inserito"}</div>
      <div class="meal-card"><strong>Cena</strong>${diet.dinner || "Non inserita"}</div>
    </div>
  `;
}

function logout() {
  loggedPatient = null;
  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("patientBox").classList.add("hidden");
  document.getElementById("loginName").value = "";
  document.getElementById("loginMessage").textContent = "";
}

buildWeeklyTable();
buildDaysNav();
