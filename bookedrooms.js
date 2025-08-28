const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");


const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");


overlay.innerHTML = `
  <a href="./homs.html">Home</a>
  <a href="./rooms.html">Rooms</a>
  <a href="./hotel.html">Hotels</a>
  <a href="./bookedrooms.html">Booked Rooms</a>
`;

document.body.appendChild(overlay);


hamburger.addEventListener("click", () => {
  hamburger.style.display = "none";
  overlay.classList.add("active");
});


overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
  hamburger.style.display = "block";
});




















const citiesContainer = document.querySelector("#city");
const container = document.getElementById("container");
const statusDiv = document.getElementById("status");

const HOTELS_API = "https://hotelbooking.stepprojects.ge/api/Hotels/GetAll";
const ROOMS_API = "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll";
const BOOKINGS_API = "https://hotelbooking.stepprojects.ge/api/Booking";

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`მონაცემების ჩატვირთვა ვერ მოხერხდა: ${res.status}`);
  return res.json();
}

function formatPrice(price) {
  if (price == null || price === "") return "-";
  const n = Number(price);
  return isNaN(n) ? price : n + "€ ";
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("ka-GE");
}

function renderHotelCell(hotel) {
  if (!hotel) return "-";
  return `
    <div class="hotell", style="display:flex; align-items:center; gap:10px; max-width:300px;">
      <img src="${hotel.featuredImage ?? 'https://via.placeholder.com/80x60?text=No+Image'}" class="img"
           alt="${hotel.name}" style="width:100px;  height:60px; object-fit:cover; border-radius:6px;">
      <div class="hotelbox">
        <strong class="hotelname">${hotel.name ?? "-"}</strong><br>
        <small class="hotelcity">${hotel.city ?? "-"}</small><br>
      </div>
    </div>
  `;
}

function renderRoomCell(room) {
  if (!room) return "-";
  const roomImage = room.images?.[0]?.source ?? 'https://via.placeholder.com/80x60?text=No+Image';
  return `
    <div class="roomstyle" style="display:flex; align-items:center; gap:10px; max-width:300px;">
      <img src="${roomImage}" alt="${room.name}"   style="width:80px; height:60px; object-fit:cover; border-radius:6px;">
      <div class="roombox">
        <strong class="roomname" >${room.name ?? "-"}</strong><br>
        <small class=roomprice>${formatPrice(room.pricePerNight ?? room.price)}</small>
      </div>
    </div>
  `;
}

async function loadCities() {
  try {
    const cities = await fetchData("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities");
    citiesContainer.innerHTML = `
      <div class="inbox">
        <div class="city-item active" id="cityitem" data-city="all">All</div>
        ${cities.map(city => `<div class="city-item" id="all" data-city="${city}">${city}</div>`).join("")}
      </div>
    `;

    document.querySelectorAll(".city-item").forEach(btn => {
      btn.addEventListener("click", function () {
        const selectedCity = this.getAttribute("data-city");
        document.querySelectorAll(".city-item").forEach(el => el.classList.remove("active"));
        this.classList.add("active");
        loadBookings(selectedCity === "all" ? null : selectedCity);
      });
    });
  } catch (error) {
    citiesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}







 
function showConfirmPopup(message, subMessage, bookingId, callback) {
  const existingPopup = document.getElementById("confirm-popup");
  if (existingPopup) existingPopup.remove();

  const overlay = document.createElement("div");
  overlay.id = "confirm-popup";
  overlay.className = "popup-overlay";

  overlay.innerHTML = `
    <div class="popup-box">
      <div class="popup-content">
        <p class="popup-message">${message}</p>
        <p class="popup-sub">${subMessage}</p>
        <div class="popup-buttons">
          <button class="popup-btn confirm">დადასტურება</button>
          <button class="popup-btn cancel">გაუქმება</button>
        </div>
      </div>
      <p class="popup-result" style="margin-top:10px; font-weight:bold; cursor:pointer; display:none;">გასვლა</p>
    </div>
  `;

  document.body.appendChild(overlay);

  const contentEl = overlay.querySelector(".popup-content");
  const resultEl = overlay.querySelector(".popup-result");

  function showResult(text, color) {
    contentEl.style.display = "none"; 
    resultEl.textContent = text;
    resultEl.style.color = color;
    resultEl.style.display = "block";
  }


  resultEl.addEventListener("click", () => overlay.remove());
  overlay.querySelector(".confirm").addEventListener("click", async () => {
    try {
      const res = await fetch(`${BOOKINGS_API}/${bookingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`მოთხოვნა ვერ შესრულდა: ${res.status}`);

      showResult(`ჯავშანი წაიშალა! Booking ID: ${bookingId}. დაჭირე გასასვლელად`, "green");
      callback && callback(true);
    } catch (error) {
      showResult("შეცდომა ჯავშნის წაშლისას: " + error.message + ". დაჭირე გასასვლელად", "red");
    }
  });
  overlay.querySelector(".cancel").addEventListener("click", () => {
    showResult("ჯავშანი არ წაიშალა. დაჭირე გასასვლელად", "orange");
    callback && callback(false);
  });
}


function cancelBooking(bookingId) {
  if (!bookingId) {
    alert("ჯავშნის ID არ არის მითითებული.");
    return;
  }

  showConfirmPopup(
    "გინდა ნამდვილად გააუქმო ეს ჯავშანი?",
    `Booking ID: ${bookingId}`,
    bookingId,
    (confirmed) => {
      const activeCity = document.querySelector(".city-item.active")?.getAttribute("data-city");
      loadBookings(activeCity === "all" ? null : activeCity);
    }
  );
}








async function loadBookings(filterCity = null) {
  try {
    statusDiv.textContent = "იტვირთება...";

    const [hotels, rooms, bookings] = await Promise.all([
      fetchData(HOTELS_API),
      fetchData(ROOMS_API),
      fetchData(BOOKINGS_API),
    ]);

    const hotelsMap = new Map(hotels.map(h => [h.id, h]));
    const roomsMap = new Map(rooms.map(r => [r.id, r]));

    let tableHTML = `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Room</th>
            <th class="Customer">Customer</th>
            <th>Status</th>
            <th>Check in</th>
            <th>Check out</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      </div>
    `;

    

    let hasData = false;

    for (const booking of bookings) {
      const room = roomsMap.get(booking.roomID ?? booking.roomId) || {};
      const hotel = hotelsMap.get(room.hotelId ?? booking.hotelId) || {};

      if (filterCity && hotel.city !== filterCity) continue;

      hasData = true;
      tableHTML += `
        <tr>
          <td class="tdhotel">${renderHotelCell(hotel)}</td>
          <td>${renderRoomCell(room)}</td>
          <td >${booking.customerName ?? "უცნობი"}</td>
          <td>
            <div  class="booked"  >${booking.isConfirmed ? "Booked" : "Booked"}</div>
          </td>
          <td>${formatDate(booking.checkInDate ?? booking.checkIn)}</td>
          <td>${formatDate(booking.checkOutDate ?? booking.checkOut)}</td>
          <td>${formatPrice(booking.totalPrice)}</td>
          <td style="text-align:center;">
            <button 
              onclick="cancelBooking(${booking.id})" 
              class="cancel">
               Cancel Booking
            </button>
          </td>
        </tr>
      `;
    }

    if (!hasData) {
      tableHTML += `<tr><td colspan="8" style="text-align:center;">მონაცემები არ მოიძებნა</td></tr>`;
    }

    tableHTML += "</tbody></table>";
    container.innerHTML = tableHTML;
    statusDiv.textContent = "";
  } catch (error) {
    console.error(" შეცდომა ბუქინგების ჩატვირთვისას:", error);
    statusDiv.textContent = "შეცდომა: " + error.message;
    container.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCities();
  loadBookings();
});














































