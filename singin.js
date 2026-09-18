// =========================================================
// 1. NAVIGATION & HAMBURGER
// =========================================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");
overlay.innerHTML = `
  <a href="./index.html">Home</a>
  <a href="./rooms.html">Rooms</a>
  <a href="./hotel.html">Hotels</a>
  <a href="./bookedrooms.html">Booked Rooms</a>
  <button type="button" id="mobileLogin">
    <span>Login</span>
    <img src="./image/login.svg" class="login" alt="Login">
  </button>
`;
document.body.appendChild(overlay);

const mobileLogin = overlay.querySelector("#mobileLogin");
const desktopLogin = document.getElementById("btnLoginRegister");
const authPopup = document.getElementById("authPopup");
const authContent = document.getElementById("authContent");
const popupContent = document.querySelector(".auth-popup-content");
const btnClose = document.getElementById("btnClose");

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("userToken");
}

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.style.display = "none";
    overlay.classList.add("active");
  });
}

function closeMobileMenu() {
  overlay.classList.remove("active");
  if (hamburger) {
    hamburger.style.display = "block";
  }
}

overlay.addEventListener("click", (event) => {
  if (event.target.closest("#mobileLogin")) return;
  closeMobileMenu();
});

// =========================================================
// 2. AUTHENTICATION & LOGIN POPUP
// =========================================================
function openAuthPopup() {
  closeMobileMenu();
  if (!authPopup || !authContent) return;

  authPopup.style.display = "flex";
  authPopup.classList.add("active");

  if (popupContent) {
    popupContent.classList.remove("registration-popup", "authorization-popup");
  }

  authContent.innerHTML = `
    <div class="auth-choice">
      <div class="go">
        Login
        <img src="./image/login.svg" class="login" alt="Login">
      </div>
      <button type="button" id="popupLogin" class="auth-choice-btn">Authorization</button>
      <button type="button" id="popupRegister" class="auth-choice-btn">Registration</button>
    </div>
  `;

  document.getElementById("popupLogin")?.addEventListener("click", () => {
    closeAuthPopup();
    window.location.href = "./singin.html";
  });

  document.getElementById("popupRegister")?.addEventListener("click", () => {
    closeAuthPopup();
    window.location.href = "./registre.html";
  });
}

function closeAuthPopup() {
  if (!authPopup) return;
  authPopup.style.display = "none";
  authPopup.classList.remove("active");
  if (authContent) authContent.innerHTML = "";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  updateAuthButton();
  window.location.href = "./index.html";
}

function updateAuthButton() {
  const token = getToken();
  const isAuth = !!token;
  const btnText = isAuth ? "Log Out" : "Login";

  if (desktopLogin) {
    desktopLogin.innerHTML = `
      ${btnText}
      <img src="./image/login.svg" class="login" alt="${btnText}">
    `;
    desktopLogin.onclick = isAuth ? logout : openAuthPopup;
  }

  if (mobileLogin) {
    mobileLogin.innerHTML = `
      <span>${btnText}</span>
      <img src="./image/login.svg" class="login" alt="${btnText}">
    `;
    mobileLogin.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isAuth) logout();
      else openAuthPopup();
    };
  }
}

if (btnClose) btnClose.addEventListener("click", closeAuthPopup);
if (authPopup) {
  authPopup.addEventListener("click", (event) => {
    if (event.target === authPopup) closeAuthPopup();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAuthPopup();
});

updateAuthButton();

// =========================================================
// 3. LOGIN PAGE LOGIC (მხოლოდ თუ loginForm არსებობს)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const errBox = document.getElementById("loginError");
  const okBox = document.getElementById("loginSuccess");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (errBox) {
      errBox.textContent = "";
      errBox.style.display = "none";
    }
    if (okBox) {
      okBox.textContent = "";
      okBox.style.display = "none";
    }

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";

    if (!email || !password) {
      if (errBox) {
        errBox.textContent = "შეიყვანე email და password";
        errBox.style.display = "block";
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const res = await fetch("https://hotel-backend-qeue.onrender.com/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (errBox) {
          errBox.textContent = data.detail || data.message || "Login failed.";
          errBox.style.display = "block";
        }
        if (submitButton) submitButton.disabled = false;
        return;
      }

      if (!data.token) {
        if (errBox) {
          errBox.textContent = "Login წარმატებულია, მაგრამ Token ვერ მოიძებნა.";
          errBox.style.display = "block";
        }
        if (submitButton) submitButton.disabled = false;
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.userId) localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("userEmail", data.userEmail || email);

      if (okBox) {
        okBox.textContent = "წარმატებით გაიარეთ ავტორიზაცია!";
        okBox.style.display = "block";
      }

      setTimeout(() => {
        window.location.href = "./bookedrooms.html";
      }, 700);
    } catch (err) {
      if (errBox) {
        errBox.textContent = "ქსელის შეცდომა, სცადეთ მოგვიანებით.";
        errBox.style.display = "block";
      }
      if (submitButton) submitButton.disabled = false;
    }
  });
});

// =========================================================
// 4. BOOKED ROOMS PAGE LOGIC (მხოლოდ თუ ცხრილი არსებობს)
// =========================================================
const citiesContainer = document.getElementById("city");
const container = document.getElementById("container");
const statusDiv = document.getElementById("status");

const API_BASE = "https://hotel-backend-qeue.onrender.com";
const BOOKINGS_API = `${API_BASE}/api/Booking`;
const HOTEL_PLACEHOLDER = "https://via.placeholder.com/100x60?text=No+Hotel+Image";
const ROOM_PLACEHOLDER = "https://via.placeholder.com/80x60?text=No+Room+Image";

let cachedBookings = [];
let currentFilterCity = "all";

function formatPrice(price) {
  const number = Number(price);
  return Number.isNaN(number) ? "0 ₾" : `${number} ₾`;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const dateOnly = String(dateStr).split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      return new Date(year, month - 1, day).toLocaleDateString("ka-GE");
    }
  }
  return dateStr;
}

function getImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image.trim() || null;
  if (typeof image === "object") return image.source || image.url || image.imageUrl || null;
  return null;
}

function createHotelFromBooking(booking) {
  const hotelImg =
    getImageUrl(booking.hotelImages?.[0]) ||
    getImageUrl(booking.hotel?.images?.[0]) ||
    booking.hotelImage ||
    booking.featuredImage ||
    null;

  return {
    id: booking.hotelId || booking.hotel_id || booking.hotel?.id,
    name: booking.hotelName || booking.hotel?.name || "Unknown hotel",
    city: booking.city || booking.hotelCity || booking.hotel?.city || "-",
    featuredImage: hotelImg
  };
}

function createRoomFromBooking(booking) {
  const roomImg =
    getImageUrl(booking.roomImages?.[0]) ||
    getImageUrl(booking.room?.images?.[0]) ||
    booking.roomImage ||
    null;

  return {
    id: booking.roomId || booking.room_id || booking.room?.id,
    name: booking.roomName || booking.roomTypeName || booking.room?.name || "Unknown room",
    pricePerNight: booking.roomPricePerNight || booking.pricePerNight || booking.price || "",
    image: roomImg
  };
}

function getBookingStatus(booking) {
  const status = String(booking.status || "").toLowerCase();
  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("confirm") || status.includes("book")) return "Booked";
  return "Pending";
}

function renderHotelCell(hotel) {
  const image = hotel?.featuredImage || HOTEL_PLACEHOLDER;
  const name = hotel?.name || "Unknown hotel";
  const city = hotel?.city || "-";

  return `
    <div class="hotell hotel-cell" style="display:flex; align-items:center; gap:12px; max-width:300px;">
      <img src="${image}" alt="${name}" class="img hotel-image" style="width:95px; height:65px; object-fit:cover; border-radius:8px;" onerror="this.onerror=null; this.src='${HOTEL_PLACEHOLDER}';">
      <div class="hotelbox">
        <strong class="hotelname" style="display:block; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</strong>
        <small class="hotelcity" style="color:#888;">${city}</small>
      </div>
    </div>
  `;
}

function renderRoomCell(room) {
  const image = room?.image || ROOM_PLACEHOLDER;
  const name = room?.name || "Unknown room";
  const price = room?.pricePerNight;

  return `
    <div class="roomstyle room-cell" style="display:flex; align-items:center; gap:12px; max-width:300px;">
      <img src="${image}" alt="${name}" class="imgroom room-image" style="width:85px; height:60px; object-fit:cover; border-radius:8px;" onerror="this.onerror=null; this.src='${ROOM_PLACEHOLDER}';">
      <div class="roombox">
        <strong class="roomname" style="display:block; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</strong>
        <small class="roomprice" style="color:#0365b0;">${formatPrice(price)} / night</small>
      </div>
    </div>
  `;
}

// გაუქმების მოდალი
function showConfirmPopup(message, subMessage, bookingId, callback) {
  document.getElementById("confirm-popup")?.remove();

  const popup = document.createElement("div");
  popup.id = "confirm-popup";
  popup.className = "popup-overlay";
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-content">
        <h3 class="popup-message">${message}</h3>
        <p class="popup-sub">${subMessage}</p>
        <div class="popup-buttons">
          <button type="button" class="popup-btn confirm" id="confirmCancel">Yes</button>
          <button type="button" class="popup-btn cancel" id="cancelPopup">No</button>
        </div>
      </div>
      <p class="popup-result" style="margin-top:10px; font-weight:bold; cursor:pointer; display:none;">Exit</p>
    </div>
  `;
  document.body.appendChild(popup);

  const confirmBtn = document.getElementById("confirmCancel");
  const cancelBtn = document.getElementById("cancelPopup");
  const contentEl = popup.querySelector(".popup-content");
  const resultEl = popup.querySelector(".popup-result");

  resultEl?.addEventListener("click", () => popup.remove());
  cancelBtn?.addEventListener("click", () => popup.remove());

  confirmBtn?.addEventListener("click", async () => {
    const token = getToken();
    if (!token) return;

    confirmBtn.disabled = true;
    confirmBtn.textContent = "Deleting...";

    try {
      const res = await fetch(`${BOOKINGS_API}/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("ჯავშანი ვერ გაუქმდა.");

      contentEl.style.display = "none";
      resultEl.textContent = "ჯავშანი წარმატებით გაუქმდა! (დააჭირეთ დასახურად)";
      resultEl.style.color = "green";
      resultEl.style.display = "block";

      callback?.();
    } catch (err) {
      alert(err.message);
      popup.remove();
    }
  });
}

function cancelBooking(bookingId) {
  if (!bookingId) return;

  showConfirmPopup(
    "Cancel reservation?",
    `Are you sure you want to cancel booking #${bookingId}?`,
    bookingId,
    () => {
      // ლოკალურად ამოვშალოთ მეხსიერებიდან
      cachedBookings = cachedBookings.filter((b) => String(b.id || b.bookingId || b.booking_id) !== String(bookingId));
      renderBookingsTable(currentFilterCity);
      renderCities();
    }
  );
}

function renderBookingsTable(filterCity = "all") {
  if (!container) return;

  const filtered = cachedBookings.filter((booking) => {
    if (!filterCity || filterCity === "all") return true;
    const city = String(booking.city || booking.hotel?.city || booking.hotelCity || "").toLowerCase();
    return city === filterCity.toLowerCase();
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-data" style="padding:40px; text-align:center; color:#777;">ჯავშნები ვერ მოიძებნა.</div>`;
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="booking-table">
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
  `;

  filtered.forEach((booking) => {
    const hotel = createHotelFromBooking(booking);
    const room = createRoomFromBooking(booking);
    const bookingId = booking.id || booking.bookingId || booking.booking_id;
    const customerName = booking.customerName || booking.customer_name || booking.name || "Unknown";
    const checkIn = booking.checkInDate || booking.check_in_date || booking.checkIn || booking.fromDate;
    const checkOut = booking.checkOutDate || booking.check_out_date || booking.checkOut || booking.toDate;
    const totalPrice = booking.totalPrice || booking.total_price || booking.price || 0;
    const status = getBookingStatus(booking);

    html += `
      <tr>
        <td class="tdhotel">${renderHotelCell(hotel)}</td>
        <td>${renderRoomCell(room)}</td>
        <td class="ucnobi">${customerName}</td>
        <td><div class="booked">${status}</div></td>
        <td>${formatDate(checkIn)}</td>
        <td>${formatDate(checkOut)}</td>
        <td>${formatPrice(totalPrice)}</td>
        <td style="text-align:center;">
          <button type="button" class="cancel cancel-booking" data-booking-id="${bookingId}">
            Cancel
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;

  container.querySelectorAll(".cancel-booking, .cancel").forEach((btn) => {
    btn.addEventListener("click", () => {
      cancelBooking(btn.dataset.bookingId);
    });
  });
}

function renderCities() {
  if (!citiesContainer) return;

  const cities = [
    ...new Set(
      cachedBookings
        .map((b) => b.city || b.hotel?.city || b.hotelCity)
        .filter(Boolean)
        .map((c) => String(c).trim())
    )
  ].sort();

  citiesContainer.innerHTML = `
    <div class="inbox">
      <div class="city-item ${currentFilterCity === "all" ? "active" : ""}" data-city="all">All</div>
      ${cities.map((city) => `<div class="city-item ${currentFilterCity === city ? "active" : ""}" data-city="${city}">${city}</div>`).join("")}
    </div>
  `;

  citiesContainer.querySelectorAll(".city-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentFilterCity = this.getAttribute("data-city");
      citiesContainer.querySelectorAll(".city-item").forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
      renderBookingsTable(currentFilterCity);
    });
  });
}

async function loadBookings() {
  if (!container) return;
  const token = getToken();

  if (!token) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px;">
        <p style="font-size:18px; color:#555;">გთხოვთ გაიაროთ ავტორიზაცია ჯავშნების სანახავად.</p>
        <button type="button" class="auth-choice-btn" style="margin-top:15px; padding:10px 20px;" id="inlineLoginBtn">Login</button>
      </div>
    `;
    document.getElementById("inlineLoginBtn")?.addEventListener("click", openAuthPopup);
    return;
  }

  if (statusDiv) statusDiv.textContent = "იტვირთება ჯავშნები...";

  try {
    const res = await fetch(BOOKINGS_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      updateAuthButton();
      throw new Error("ავტორიზაციის ვადა გავიდა.");
    }

    if (!res.ok) throw new Error("ჯავშნები ვერ ჩაიტვირთა.");

    const data = await res.json();
    cachedBookings = Array.isArray(data) ? data : data.bookings || [];

    if (statusDiv) statusDiv.textContent = "";

    renderCities();
    renderBookingsTable(currentFilterCity);
  } catch (err) {
    if (statusDiv) statusDiv.textContent = "";
    container.innerHTML = `<div class="error-message" style="color:red; text-align:center; padding:30px;">${err.message}</div>`;
  }
}

// ჯავშნების გაშვება მხოლოდ შესაბამის გვერდზე
document.addEventListener("DOMContentLoaded", () => {
  if (container || citiesContainer) {
    loadBookings();
  }
});