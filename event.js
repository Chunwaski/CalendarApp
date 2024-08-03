import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyARVI4voC-ucxjj0XZRKtj9B_cRZokpwLg",
    authDomain: "calendarapp-d5f9c.firebaseapp.com",
    databaseURL: "https://calendarapp-d5f9c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "calendarapp-d5f9c",
    storageBucket: "calendarapp-d5f9c.appspot.com",
    messagingSenderId: "208301182287",
    appId: "1:208301182287:web:4eac8808801ad82bd8893a",
    measurementId: "G-5BPVYWCBMW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

const calendar = document.querySelector(".calendar"),
      date = document.querySelector(".date"),
      daysContainer = document.querySelector(".days"),
      prev = document.querySelector(".prev"),
      next = document.querySelector(".next"),
      todayBtn = document.querySelector(".today-btn"),
      dateInput = document.querySelector(".date-input"),
      eventDay = document.querySelector(".event-day"),
      eventDate = document.querySelector(".event-date"),
      eventsContainer = document.querySelector(".events");

fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
  });

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const eventsRef = ref(db, 'events');
const holidaysRef = ref(db, 'holidays');
const studenteventRef = ref(db, 'studentevents');

let eventsArr = [];
let holidaysArr = [];
let studenteventArr = [];

async function fetchEventsAndHolidays() {
  try {
    const eventsSnapshot = await get(eventsRef);
    if (eventsSnapshot.exists()) {
      eventsArr = Object.values(eventsSnapshot.val());
    }

    const holidaysSnapshot = await get(holidaysRef);
    if (holidaysSnapshot.exists()) {
      holidaysArr = Object.values(holidaysSnapshot.val());
    }

    const studenteventsSnapshot = await get(studenteventRef);
    if (studenteventsSnapshot.exists()) {
      studenteventArr = Object.values(studenteventsSnapshot.val());
    }

    initCalendar();
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const currentDay = new Date(year, month, i).getDay();
    const isSunday = currentDay === 0;
    const isSaturday = currentDay === 6;

    let dayClass = "day";
    let hasEvent = eventsArr.some(eventObj => eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year);
    let hasStudentEvent = studenteventArr.some(eventObj => eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year);
    let isHoliday = holidaysArr.some(holidayObj => {
      const startDate = new Date(holidayObj.year, holidayObj.monthStart - 1, holidayObj.dayStart);
      const endDate = new Date(holidayObj.year, holidayObj.monthEnd - 1, holidayObj.dayEnd);
      const currentDate = new Date(year, month, i);
      return currentDate >= startDate && currentDate <= endDate;
    });

    if (isSunday || isSaturday) {
      dayClass += " weekend";
    } else if (isHoliday) {
      dayClass += " holiday";
    } else if (hasEvent) {
      dayClass += " event";
    } else if (hasStudentEvent) {
      dayClass += " studentevent";
    }

    if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      dayClass += " today active"; 
    }

    days += `<div class="${dayClass}" data-day="${i}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const clickedDay = Number(e.target.innerHTML);

      days.forEach((day) => {
        day.classList.remove("active");
      });

      e.target.classList.add("active");

      getActiveDay(clickedDay);
      updateEvents(clickedDay);
      activeDay = clickedDay;

      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active");
            }
          });
        }, 100);
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  let holidaysHtml = "";
  let studenteventsHtml = "";

  // Fetch events, holidays, and student events from the database
  const eventsRef = ref(db, 'events');
  const holidaysRef = ref(db, 'holidays');
  const studenteventRef = ref(db, 'studentevents');

  Promise.all([
    get(eventsRef),
    get(holidaysRef),
    get(studenteventRef)
  ])
  .then(([eventsSnapshot, holidaysSnapshot, studenteventsSnapshot]) => {
    if (eventsSnapshot.exists()) {
      const allEvents = Object.values(eventsSnapshot.val());

      // Filter events for the selected date
      const eventsForDate = allEvents.filter(event => 
        event.day === date &&
        event.month === month + 1 &&
        event.year === year
      );
      
      // Generate HTML for each event
      eventsForDate.forEach(ev => {
        events += `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${ev.title}</h3>
            </div>
            <div class="event-grade">
              <span class="event-grade">${ev.grade}</span>
            </div>
          </div>
        `;
      });
    } else {
      console.log("No events data available.");
    }

    if (holidaysSnapshot.exists()) {
      const allHolidays = Object.values(holidaysSnapshot.val());

      // Filter holidays for the selected date
      const holidaysForDate = allHolidays.filter(holiday => {
        const startDate = new Date(holiday.year, holiday.monthStart - 1, holiday.dayStart);
        const endDate = new Date(holiday.year, holiday.monthEnd - 1, holiday.dayEnd);
        const currentDate = new Date(year, month, date);
        return currentDate >= startDate && currentDate <= endDate;
      });

      // Generate HTML for each holiday
      holidaysForDate.forEach(holiday => {
        holidaysHtml += `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="holiday-title">${holiday.holidaytitle}</h3>
            </div>
            <div class="holiday-date-range">
              <span class="holiday-date">${holiday.dayStart}/${holiday.monthStart} - ${holiday.dayEnd}/${holiday.monthEnd}</span>
            </div>
          </div>
        `;
      });
    } else {
      console.log("No holidays data available.");
    }

    if (studenteventsSnapshot.exists()) {
      const allStudentEvents = Object.values(studenteventsSnapshot.val());

      // Filter student events for the selected date
      const studentEventsForDate = allStudentEvents.filter(event => 
        event.day === date &&
        event.month === month + 1 &&
        event.year === year
      );
      
      // Generate HTML for each student event
      studentEventsForDate.forEach(ev => {
        studenteventsHtml += `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="student-event-title">${ev.title}</h3>
            </div>
            <div class="event-grade">
              <span class="event-grade">${ev.time}</span>
            </div>
          </div>
        `;
      });
    } else {
      console.log("No student events data available.");
    }

    // Combine events, holidays, and student events HTML
    const combinedHtml = events + holidaysHtml + studenteventsHtml;

    // Check if there are no events, holidays, or student events for the selected date
    if (combinedHtml === "") {
      eventsContainer.innerHTML = `
        <div class="no-event">
          <h3>No Events or Holidays</h3>
        </div>
      `;
    } else {
      // Update the events container
      eventsContainer.innerHTML = combinedHtml;
    }
  })
  .catch((error) => {
    console.error('Error fetching data: ', error);
  });
}

// Fetch events, holidays, and student events on page load
fetchEventsAndHolidays();
