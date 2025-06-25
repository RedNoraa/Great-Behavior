const levelInput = document.getElementById('levelCount');
const setLevelsBtn = document.getElementById('setLevels');
const addStudentBtn = document.getElementById('addStudent');
const studentInput = document.getElementById('studentName');
const table = document.getElementById('progressTable');

let levelCount = parseInt(levelInput.value, 10);
const students = [];

function renderTable() {
  table.innerHTML = '';
  const header = document.createElement('tr');
  header.innerHTML = '<th>Student</th>';
  for (let i = 1; i <= levelCount; i++) {
    const th = document.createElement('th');
    th.textContent = `Level ${i}`;
    header.appendChild(th);
  }
  header.innerHTML += '<th>Up Changes</th><th>Down Changes</th>';
  table.appendChild(header);
  students.forEach((s, i) => addRow(s, i));
}


function addRow(student, index) {
  const row = document.createElement('tr');
  row.setAttribute('data-index', index);
  let cells = `<td>${student.name}</td>`;
  for (let i = 1; i <= levelCount; i++) {
    const cls = i === student.level ? 'current-level' : '';
    cells += `<td class="level-cell lvl${i} ${cls}"></td>`;
  }
  cells += `<td class="up">${student.up}</td><td class="down">${student.down}</td>`;
  row.innerHTML = cells;
  row.addEventListener('click', (e) => {
    if (e.target.tagName !== 'TD') return;
    const cellIndex = Array.from(row.children).indexOf(e.target) - 1;
    if (cellIndex >= 0 && cellIndex < levelCount) {
      updateLevel(index, cellIndex + 1);
    }
  });
  table.appendChild(row);
}

function updateLevel(index, newLevel) {
  const s = students[index];
  if (newLevel === s.level) return;
  if (newLevel > s.level) s.up += newLevel - s.level;
  if (newLevel < s.level) s.down += s.level - newLevel;
  s.level = newLevel;
  refreshRow(index);
}

function refreshRow(index) {
  const row = table.querySelector(`tr[data-index="${index}"]`);
  for (let i = 1; i <= levelCount; i++) {
    const cell = row.querySelector(`.lvl${i}`);
    cell.classList.toggle('current-level', i === students[index].level);
  }
  row.querySelector('.up').textContent = students[index].up;
  row.querySelector('.down').textContent = students[index].down;
}

setLevelsBtn.addEventListener('click', () => {
  levelCount = parseInt(levelInput.value, 10) || 1;
  renderTable();
});

addStudentBtn.addEventListener('click', () => {
  const name = studentInput.value.trim();
  if (!name) return;
  const student = { name, level: 1, up: 0, down: 0 };
  students.push(student);
  renderTable();
  studentInput.value = '';
});

renderTable();
