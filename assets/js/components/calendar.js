document.addEventListener("DOMContentLoaded", () => {
  const calendarContainer = document.getElementById("calendar");
  const monthYearDisplay = document.getElementById("monthYearDisplay");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  const API_KEY = "AIzaSyDFFYzgKUR7cTnO1XOwsYMk0TijDHtl7zY";
  const CAL_ID  = "whoimmal@gmail.com";
  const TZ      = "Asia/Jakarta";

  let currentDate = new Date();

  function getMonthBounds(date) {
    const year  = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end   = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
    return { start, end };
  }

  async function fetchEventsForMonth(date) {
    const { start, end } = getMonthBounds(date);
    const timeMin = start.toISOString();
    const timeMax = end.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events` +
      `?key=${API_KEY}` +
      `&singleEvents=true` +
      `&orderBy=startTime` +
      `&timeMin=${encodeURIComponent(timeMin)}` +
      `&timeMax=${encodeURIComponent(timeMax)}` +
      `&timeZone=${encodeURIComponent(TZ)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return normalizeEvents(data.items || []);
    } catch (err) {
      console.error("Gagal mengambil event Google Calendar:", err);
      return {};
    }
  }

  function normalizeEvents(items) {
    const map = {};
    items.forEach(ev => {
      const startRaw = ev.start?.date || ev.start?.dateTime;
      if (!startRaw) return;

      let dateStr;
      let timeDisp = "All Day";
      if (ev.start.date) {
        dateStr = ev.start.date;
      } else {
        const d = new Date(ev.start.dateTime);
        dateStr = d.toISOString().slice(0,10);
        timeDisp = d.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }

      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push({
        title: ev.summary || "(No title)",
        time:  timeDisp
      });
    });
    return map;
  }

  async function renderCalendar(date) {
    const year  = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const events = await fetchEventsForMonth(date);
    const firstDayWeekIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarContainer.innerHTML = "";

    for (let i = 0; i < firstDayWeekIndex; i++) {
      const empty = document.createElement("div");
      empty.classList.add("day", "empty");
      calendarContainer.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const dayBox = document.createElement("div");
      dayBox.classList.add("day");
      dayBox.setAttribute("data-date", dateStr);

      if (
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate()
      ) {
        dayBox.classList.add("today");
      }

      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = day;
      dayBox.appendChild(dayNumber);

      if (events[dateStr]?.length) {
        dayBox.classList.add("has-event");
        const eventList = document.createElement("ul");
        eventList.classList.add("event-list");

        events[dateStr].forEach(ev => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${ev.time}</strong> — ${ev.title}`;
          eventList.appendChild(li);
        });

        dayBox.appendChild(eventList);
      }

      // Fitur klik & tahan (hold) untuk tambah event
      let holdTimer;

      dayBox.addEventListener("mousedown", () => {
        holdTimer = setTimeout(() => {
          openAddToCalendar(dateStr);
        }, 700);
      });

      dayBox.addEventListener("mouseup", () => clearTimeout(holdTimer));
      dayBox.addEventListener("mouseleave", () => clearTimeout(holdTimer));

      calendarContainer.appendChild(dayBox);
    }
  }

  function openAddToCalendar(dateStr) {
    const base = "https://calendar.google.com/calendar/u/0/r/eventedit";
    const compactDate = dateStr.replace(/-/g, '');
    const startTime = `${compactDate}T190000`;
    const endTime   = `${compactDate}T200000`;

    const url = `${base}?dates=${startTime}/${endTime}` +
                `&text=New+Event&details=&location=&ctz=${encodeURIComponent(TZ)}`;

    window.open(url, '_blank');
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
