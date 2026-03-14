let items = JSON.parse(localStorage.getItem("kitItems")) || [];

const tableBody = document.querySelector("#listTable tbody");

// Render items in table
function render() {
  if (!tableBody) return;

  tableBody.innerHTML = "";
  let completed = 0;

  items.forEach((item, index) => {
    let row = document.createElement("tr");

    // Index
    let cellIndex = document.createElement("td");
    cellIndex.textContent = index + 1;
    row.appendChild(cellIndex);

    // Name
    let cellName = document.createElement("td");
    cellName.textContent = item.name;
    row.appendChild(cellName);

    // Checkbox
    let cellDone = document.createElement("td");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;

    checkbox.onclick = function () {
      items[index].done = checkbox.checked;
      save();
      speakItem(item.name + (checkbox.checked ? " marked done" : " unchecked"));
    };

    if (item.done) completed++;

    cellDone.appendChild(checkbox);
    row.appendChild(cellDone);

    // Delete button
    let cellDel = document.createElement("td");
    let delBtn = document.createElement("button");
    delBtn.className = "deleteBtn";
    delBtn.textContent = "Delete";

    delBtn.onclick = function () {
      speakItem("Deleted " + item.name);
      items.splice(index, 1);
      save();
    };

    cellDel.appendChild(delBtn);
    row.appendChild(cellDel);

    tableBody.appendChild(row);
  });

  updateProgress(completed);
}

// Add item
function addItem() {
  let input = document.getElementById("itemInput");
  let value = input.value.trim();
  if (value === "") return;

  items.push({ name: value, done: false });
  save();
  speakItem("Added " + value);

  input.value = "";
}

// Save
function save() {
  localStorage.setItem("kitItems", JSON.stringify(items));
  render();
}

// Reset
function resetList() {
  items = [];
  save();
  speakItem("Checklist reset");
}

// Progress bar
function updateProgress(done) {
  let percent = items.length === 0 ? 0 : Math.round((done / items.length) * 100);

  let bar = document.getElementById("progressBar");
  let text = document.getElementById("progressText");

  if (bar) bar.style.width = percent + "%";
  if (text) text.textContent = percent + "% Ready";
}

// Text to speech
function speakItem(text) {
  if ('speechSynthesis' in window) {
    let voices = speechSynthesis.getVoices();

    let femaleVoice =
      voices.find(v => v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.name.toLowerCase().includes("zira")) ||
      voices[0];

    let msg = new SpeechSynthesisUtterance(text);
    msg.voice = femaleVoice;
    msg.lang = "en-US";
    msg.rate = 1;
    msg.pitch = 1.2;

    speechSynthesis.speak(msg);
  }
}

render();