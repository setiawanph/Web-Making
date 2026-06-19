// ── Clock ────────────────────────────────────────────────────────────────────
const clockElement = document.getElementById('currentTime');

function clockTicking() {
    if (!clockElement) return;
    clockElement.innerHTML = new Date().toLocaleTimeString();
}
clockTicking();
setInterval(clockTicking, 1000);

// ── Greeting ─────────────────────────────────────────────────────────────────
function greeting() {
    const greetingElement = document.getElementById('greetings');
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)       greetingElement.textContent = 'Good Morning 🌄';
    else if (hour >= 12 && hour < 18) greetingElement.textContent = 'Good Afternoon ☀️';
    else                               greetingElement.textContent = 'Good Evening 🌆';
}
greeting();

// ── Day & Date ────────────────────────────────────────────────────────────────
function day_date() {
    const now      = new Date();
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months   = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
    document.getElementById('day-to-date').innerHTML =
        weekdays[now.getDay()] + ', ' + now.getDate() + ' ' +
        months[now.getMonth()] + ' ' + now.getFullYear();
}
day_date();

// ── Dark / Light Mode Toggle ──────────────────────────────────────────────────
function toggleTheme() {
    const body       = document.body;
    const btn        = document.getElementById('themeToggle');
    const headerText = document.getElementById('headerText');
    const isDark     = body.classList.toggle('darkmode');
    btn.textContent  = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    btn.classList.toggle('btn-dark', isDark);
    headerText.textContent = isDark
        ? 'Too dark? Try this one here --->'
        : 'Too bright? Try this one here --->';
}

// ── Countdown Timer ───────────────────────────────────────────────────────────
const TOTAL = 25 * 60;
let timer     = null;
let remaining = TOTAL;
let running   = false;

function pad(n) { return String(n).padStart(2, '0'); }

function updateDisplay() {
    document.getElementById('countDown').textContent =
        pad(Math.floor(remaining / 60)) + ':' + pad(remaining % 60);
}

function startStop() {
    const btn = document.getElementById('startBtn');
    if (running) {
        clearInterval(timer);
        running = false;
        btn.textContent = '▶ Start';
    } else {
        if (remaining === 0) return;
        const tick = setInterval(function () {
            remaining--;
            updateDisplay();
            if (remaining <= 0) {
                clearInterval(tick);
                running = false;
                btn.textContent = '▶ Start';
                alert('⏰ Time is up!');
            }
        }, 1000);
        timer   = tick;
        running = true;
        btn.textContent = '⏸ Pause';
    }
}

function resetTimer() {
    clearInterval(timer);
    running   = false;
    remaining = TOTAL;
    document.getElementById('startBtn').textContent = '▶ Start';
    updateDisplay();
}

function toggleChangeInput() {
    const row    = document.getElementById('changeInputRow');
    const hidden = row.style.display === 'none';
    row.style.display = hidden ? 'flex' : 'none';
    if (hidden) document.getElementById('customMinutes').focus();
}

function applyCustomTimer() {
    const input   = document.getElementById('customMinutes');
    const minutes = parseInt(input.value);
    if (isNaN(minutes) || minutes < 1 || minutes > 99) {
        alert('Please enter a number between 1 and 99.');
        return;
    }
    clearInterval(timer);
    running   = false;
    remaining = minutes * 60;
    document.getElementById('startBtn').textContent = '▶ Start';
    updateDisplay();
    document.getElementById('changeInputRow').style.display = 'none';
    input.value = '';
}

document.getElementById('customMinutes').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') applyCustomTimer();
});

updateDisplay();

// ── Tasks ─────────────────────────────────────────────────────────────────────
function addTask() {
    const input = document.getElementById('taskInput');
    const text  = input.value.trim();
    if (!text) return;

    // Prevent duplicates (case-insensitive)
    const existing = document.querySelectorAll('#taskList .task-label');
    const isDuplicate = Array.from(existing).some(function (label) {
        return label.textContent.toLowerCase() === text.toLowerCase();
    });
    if (isDuplicate) {
        alert('Task "' + text + '" already exists.');
        input.select();
        return;
    }

    const li       = document.createElement('li');
    li.className   = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type  = 'checkbox';

    const label       = document.createElement('span');
    label.className   = 'task-label';
    label.textContent = text;

    checkbox.addEventListener('change', function () {
        label.classList.toggle('task-done', checkbox.checked);
    });

    const deleteBtn       = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className   = 'task-delete';
    deleteBtn.addEventListener('click', function () { li.remove(); });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    document.getElementById('taskList').appendChild(li);

    input.value = '';
    input.focus();
}

document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
});

// ── Quick Links (localStorage) ────────────────────────────────────────────────
let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [];

function renderLinks() {
    const container = document.getElementById('link-container');
    container.innerHTML = '';
    quickLinks.forEach(function (link) {
        const tag       = document.createElement('a');
        tag.className   = 'link-tag';
        tag.href        = link.url;
        tag.target      = '_blank';
        tag.textContent = link.name;

        const del     = document.createElement('button');
        del.className = 'delete-btn';
        del.innerHTML = '&#x2715;';
        del.addEventListener('click', function (e) {
            e.preventDefault();
            quickLinks = quickLinks.filter(function (l) { return l.id !== link.id; });
            localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
            renderLinks();
        });

        tag.appendChild(del);
        container.appendChild(tag);
    });
}

document.getElementById('addLinkBtn').addEventListener('click', function () {
    const nameInput = document.getElementById('linkName');
    const urlInput  = document.getElementById('linkUrl');
    const name      = nameInput.value.trim();
    let   url       = urlInput.value.trim();

    if (!name || !url) {
        alert('Please fill in both the name and URL.');
        return;
    }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    quickLinks.push({ id: Date.now(), name, url });
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
    renderLinks();

    nameInput.value = '';
    urlInput.value  = '';
});

renderLinks();
