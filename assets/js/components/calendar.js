document.addEventListener("DOMContentLoaded", () => {
  const calendarContainer = document.getElementById("calendar");
  const monthYearDisplay = document.getElementById("monthYearDisplay");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  let currentDate = new Date();

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Set title
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    fetch("assets/data/events.json")
      .then(res => res.json())
      .then(events => {
        calendarContainer.innerHTML = "";

        // Kosongkan offset hari awal
        for (let i = 0; i < firstDay; i++) {
          const empty = document.createElement("div");
          empty.classList.add("day", "empty");
          calendarContainer.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayBox = document.createElement("div");
          dayBox.classList.add("day");

          // Cek apakah ini hari ini
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

          // Tampilkan event
          if (events[dateStr]) {
            const eventList = document.createElement("ul");
            eventList.classList.add("event-list");

            events[dateStr].forEach(event => {
              const item = document.createElement("li");
              item.innerHTML = `<strong>${event.time}</strong> — ${event.title}`;
              eventList.appendChild(item);
            });

            dayBox.appendChild(eventList);
          }

          calendarContainer.appendChild(dayBox);
        }
      })
      .catch(err => {
        console.error("Gagal memuat events.json:", err);
      });
  }

  // Navigasi
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
