document.addEventListener("DOMContentLoaded", () => {
  const calendarContainer = document.getElementById("calendar");
  const agendaList = document.getElementById("agendaList");
  const monthYearDisplay = document.getElementById("monthYearDisplay");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  const API_KEY = "AIzaSyDFFYzgKUR7cTnO1XOwsYMk0TijDHtl7zY";
  const CAL_ID = "whoimmal@gmail.com";
  const TZ = "Asia/Jakarta";

  let currentDate = new Date();
  const colorMap = new Map();

  function getRandomColor() {
    const colors = [
      "#e74c3c", "#3498db", "#27ae60", "#f39c12", "#8e44ad", "#16a085",
      "#d35400", "#c0392b", "#2980b9", "#2ecc71", "#f1c40f", "#9b59b6",
      "#34495e", "#7f8c8d", "#1abc9c", "#ff6b6b", "#ffa07a", "#a29bfe"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getMonthBounds(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 1));
    return { start, end };
  }

  async function fetchEventsForMonth(date) {
    const { start, end } = getMonthBounds(date);
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&timeZone=${encodeURIComponent(TZ)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return normalizeEvents(data.items || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      return {};
    }
  }

  function normalizeEvents(items) {
    const map = {};
    items.forEach(ev => {
      const startISO = ev.start?.dateTime || ev.start?.date;
      if (!startISO) return;
      const dateStr = startISO.slice(0, 10);
      const title = ev.summary || "(No Title)";
      const time = ev.start?.dateTime
        ? new Date(ev.start.dateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        : "Sepanjang Hari";

      if (!map[dateStr]) map[dateStr] = [];

      if (!colorMap.has(title)) {
        colorMap.set(title, getRandomColor());
      }

      map[dateStr].push({
        title,
        time,
        color: colorMap.get(title)
      });
    });
    return map;
  }

  async function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    calendarContainer.innerHTML = "";
    agendaList.innerHTML = "";

    const events = await fetchEventsForMonth(date);

    // Hari
    dayNames.forEach(day => {
      const div = document.createElement("div");
      div.className = "day-label";
      div.textContent = day;
      calendarContainer.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      calendarContainer.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";

      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        dayDiv.classList.add("today");
      }

      const number = document.createElement("div");
      number.className = "day-number";
      number.textContent = d;
      dayDiv.appendChild(number);

      // Dots
      if (events[dateStr]) {
        const usedColors = new Set();
        events[dateStr].forEach(e => {
          if (!usedColors.has(e.color)) {
            const dot = document.createElement("span");
            dot.className = "dot-color";
            dot.style.backgroundColor = e.color;
            dayDiv.appendChild(dot);
            usedColors.add(e.color);
          }
        });
      }

      calendarContainer.appendChild(dayDiv);
    }

    // === Agenda List ===
    const sortedDates = Object.keys(events).sort();
    sortedDates.forEach(dateStr => {
      const dateObj = new Date(dateStr);
      const hari = dayNames[dateObj.getDay()];
      const tanggal = dateObj.getDate();
      const bulan = monthNames[dateObj.getMonth()];
      const tahun = dateObj.getFullYear();

      const dateHeader = document.createElement("div");
      dateHeader.textContent = `${hari}, ${tanggal} ${bulan} ${tahun}`;
      dateHeader.style.marginTop = "1rem";
      dateHeader.style.fontWeight = "bold";
      dateHeader.style.color = "var(--accent)";
      agendaList.appendChild(dateHeader);

      events[dateStr].forEach(e => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="agenda-dot" style="background:${e.color}"></span> ${e.time} — ${e.title}`;
        li.style.borderLeft = `4px solid ${e.color}`;
        agendaList.appendChild(li);
      });
    });
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);
});
