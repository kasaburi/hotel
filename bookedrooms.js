document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. DOM ელემენტები & კონფიგურაცია
  // =========================================================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const btnLoginRegister = document.getElementById("btnLoginRegister");
  const authPopup = document.getElementById("authPopup");
  const authContent = document.getElementById("authContent");
  const btnClose = document.getElementById("btnClose");
  const citiesContainer = document.getElementById("city");
  const container = document.getElementById("container");
  const statusDiv = document.getElementById("status");

  // API მისამართები
  const API_BASE = "https://hotel-backend-qeue.onrender.com";
  const HOTELS_API = `${API_BASE}/api/hotels`;
  const BOOKINGS_API = `${API_BASE}/api/Booking`;

  // ფოტოების ფლეისჰოლდერები
  const HOTEL_PLACEHOLDER = "https://via.placeholder.com/100x60?text=No+Hotel+Image";
  const ROOM_PLACEHOLDER = "https://via.placeholder.com/80x60?text=No+Room+Image";

  // გლობალური მდგომარეობა (მონაცემების ქეში)
  let cachedBookings = [];
  let currentFilterCity = "all";

  // =========================================================
  // 2. მობილური მენიუ (OVERLAY)
  // =========================================================
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

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.style.display = "none";
      overlay.classList.add("active");
    });
  }

  function closeMobileMenu() {
    overlay.classList.remove("active");
    if (hamburger) hamburger.style.display = "block";
  }

  // მენიუს დახურვა გარედან დაკლიკებისას
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("#mobileLogin")) return;
    closeMobileMenu();
  });

  // =========================================================
  // 3. ავტორიზაცია & POPUP
  // =========================================================
  function getToken() {
    return localStorage.getItem("token") || localStorage.getItem("userToken");
  }

  function openAuthPopup() {
    closeMobileMenu();
    if (!authPopup || !authContent) return;

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

    authPopup.style.display = "flex";

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
    if (authContent) authContent.innerHTML = "";
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    updateAuthButtons();
    window.location.href = "./index.html";
  }

  function updateAuthButtons() {
    const token = getToken();
    const isAuth = !!token;
    const btnText = isAuth ? "Log Out" : "Login";

    // Desktop ღილაკი
    if (btnLoginRegister) {
      btnLoginRegister.innerHTML = `
        ${btnText}
        <img src="./image/login.svg" class="login" alt="${btnText}">
      `;
      btnLoginRegister.onclick = isAuth ? logout : openAuthPopup;
    }

    // Mobile ღილაკი
    if (mobileLogin) {
      mobileLogin.innerHTML = `
        <span>${btnText}</span>
        <img src="./image/login.svg" class="login" alt="${btnText}">
      `;
      mobileLogin.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuth) {
          logout();
        } else {
          closeMobileMenu();
          openAuthPopup();
        }
      };
    }
  }

  btnClose?.addEventListener("click", closeAuthPopup);
  authPopup?.addEventListener("click", (e) => {
    if (e.target === authPopup) closeAuthPopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthPopup();
      document.getElementById("confirm-popup")?.remove();
    }
  });

  updateAuthButtons();

  // =========================================================
  // 4. დამხმარე ფორმატირების ფუნქციები
  // =========================================================
  function formatPrice(price) {
    if (price === null || price === undefined || price === "") return "-";
    const number = Number(price);
    return Number.isNaN(number) ? String(price) : `${number} ₾`;
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
    if (typeof image === "object") {
      return image.source ?? image.url ?? image.imageUrl ?? null;
    }
    return null;
  }

  function createHotelFromBooking(booking) {
    const hotelImage =
      getImageUrl(booking.hotelImages?.[0]) ??
      getImageUrl(booking.hotel?.images?.[0]) ??
      booking.hotelImage ??
      booking.featuredImage ??
      null;

    return {
      id: booking.hotelId ?? booking.hotelID ?? booking.hotel?.id ?? null,
      name: booking.hotelName ?? booking.hotelNameEn ?? booking.hotelNameKa ?? booking.hotel?.name ?? "-",
      city: booking.city ?? booking.hotelCity ?? booking.hotel?.city ?? "-",
      featuredImage: hotelImage
    };
  }

  function createRoomFromBooking(booking) {
    let roomImage = null;
    if (Array.isArray(booking.roomImages) && booking.roomImages.length > 0) {
      roomImage = getImageUrl(booking.roomImages[0]);
    } else if (Array.isArray(booking.room?.images) && booking.room.images.length > 0) {
      roomImage = getImageUrl(booking.room.images[0]);
    }
    roomImage = roomImage ?? booking.roomImage ?? null;

    return {
      id: booking.roomID ?? booking.roomId ?? booking.room?.id ?? null,
      name: booking.roomName ?? booking.roomNameEn ?? booking.roomNameKa ?? booking.room?.name ?? "-",
      pricePerNight:
        booking.roomPricePerNight ??
        booking.pricePerNight ??
        booking.room?.pricePerNight ??
        booking.room?.price_per_night ??
        null,
      image: roomImage
    };
  }

  function getBookingStatus(booking) {
    const status = booking.status;
    if (status && String(status).trim() !== "") {
      const normalized = String(status).toLowerCase();
      if (normalized === "confirmed" || normalized === "booked") return "Booked";
      if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
      if (normalized === "pending") return "Pending";
    }
    const isConfirmed = booking.isConfirmed ?? booking.is_confirmed;
    return isConfirmed ? "Booked" : "Pending";
  }

  function renderHotelCell(hotel) {
    if (!hotel) return "-";
    const image = hotel.featuredImage ?? HOTEL_PLACEHOLDER;
    const hotelName = hotel.name ?? "-";
    const city = hotel.city ?? "-";

    return `
      <div class="hotell" style="display:flex; align-items:center; gap:10px; max-width:300px;">
        <img
          src="${image}"
          class="img"
          alt="${hotelName}"
          style="width:100px; height:60px; object-fit:cover; border-radius:6px;"
          onerror="this.onerror=null; this.src='${HOTEL_PLACEHOLDER}';"
        >
        <div class="hotelbox">
          <strong class="hotelname">${hotelName}</strong>
          <br>
          <small class="hotelcity">${city}</small>
        </div>
      </div>
    `;
  }

  function renderRoomCell(room) {
    if (!room) return "-";
    const image = room.image ?? ROOM_PLACEHOLDER;
    const roomName = room.name ?? "-";
    const price = room.pricePerNight;

    return `
      <div class="roomstyle" style="display:flex; align-items:center; gap:10px; max-width:300px;">
        <img
          src="${image}"
          alt="${roomName}"
          class="imgroom"
          style="width:80px; height:60px; object-fit:cover; border-radius:6px;"
          onerror="this.onerror=null; this.src='${ROOM_PLACEHOLDER}';"
        >
        <div class="roombox">
          <strong class="roomname">${roomName}</strong>
          <br>
          <small class="roomprice">${formatPrice(price)} / night</small>
        </div>
      </div>
    `;
  }

  // =========================================================
  // 5. გაუქმების მოდალი (CONFIRM POPUP)
  // =========================================================
  function showConfirmPopup(message, subMessage, bookingId, callback) {
    document.getElementById("confirm-popup")?.remove();

    const popupOverlay = document.createElement("div");
    popupOverlay.id = "confirm-popup";
    popupOverlay.className = "popup-overlay";

    popupOverlay.innerHTML = `
      <div class="popup-box">
        <div class="popup-content">
          <p class="popup-message">${message}</p>
          <p class="popup-sub">${subMessage}</p>
          <div class="popup-buttons">
            <button type="button" class="popup-btn confirm">Confirm</button>
            <button type="button" class="popup-btn cancel">Cancel</button>
          </div>
        </div>
        <p class="popup-result" style="margin-top:10px; font-weight:bold; cursor:pointer; display:none;">
          Exit
        </p>
      </div>
    `;

    document.body.appendChild(popupOverlay);

    const contentEl = popupOverlay.querySelector(".popup-content");
    const resultEl = popupOverlay.querySelector(".popup-result");
    const confirmButton = popupOverlay.querySelector(".confirm");
    const cancelButton = popupOverlay.querySelector(".cancel");

    function showResult(text, color) {
      contentEl.style.display = "none";
      resultEl.textContent = text;
      resultEl.style.color = color;
      resultEl.style.display = "block";
    }

    resultEl.addEventListener("click", () => popupOverlay.remove());

    cancelButton.addEventListener("click", () => {
      showResult("The reservation has not been cancelled.", "orange");
      callback?.(false);
    });

    confirmButton.addEventListener("click", async () => {
      const token = getToken();
      if (!token) {
        showResult("Please log in again.", "red");
        return;
      }

      confirmButton.disabled = true;
      cancelButton.disabled = true;
      confirmButton.textContent = "In progress...";

      try {
        const response = await fetch(`${BOOKINGS_API}/${bookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          showResult("Authorization failed. Please log in again.", "red");
          return;
        }

        if (response.status === 403) {
          showResult("You cannot delete this reservation.", "red");
          return;
        }

        if (response.status === 404) {
          showResult("Booking not found.", "red");
          return;
        }

        if (!response.ok) {
          showResult(`The reservation could not be deleted. (${response.status})`, "red");
          return;
        }

        showResult(`The reservation has been cancelled. Booking ID: ${bookingId}`, "green");
        callback?.(true);
      } catch (error) {
        showResult("Error deleting reservation: " + error.message, "red");
      }
    });
  }

  function cancelBooking(bookingId) {
    if (!bookingId) {
      alert("Booking ID is not specified.");
      return;
    }

    showConfirmPopup(
      "Do you really want to cancel the reservation?",
      `Booking ID: ${bookingId}`,
      bookingId,
      (confirmed) => {
        if (!confirmed) return;

        // ლოკალურად ამოვშალოთ სიაში, რათა თავიდან არ ველოდოთ სერვერს
        cachedBookings = cachedBookings.filter(
          (b) => String(b.id ?? b.bookingId ?? b.booking_id) !== String(bookingId)
        );

        renderBookingsTable(currentFilterCity);
        renderCityButtons();
      }
    );
  }

  // =========================================================
  // 6. ცხრილის რენდერი (მეხსიერებიდან - მომენტალურად)
  // =========================================================
  function renderBookingsTable(filterCity = "all") {
    if (!container) return;

    const filtered = cachedBookings.filter((booking) => {
      if (!filterCity || filterCity === "all") return true;
      const bCity = String(booking.city ?? booking.hotelCity ?? booking.hotel?.city ?? "")
        .trim()
        .toLowerCase();
      return bCity === filterCity.trim().toLowerCase();
    });

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
    `;

    if (filtered.length === 0) {
      tableHTML += `
        <tr>
          <td colspan="8" style="text-align:center; padding: 20px;">
            No reservations found.
          </td>
        </tr>
      `;
    } else {
      filtered.forEach((booking) => {
        const hotel = createHotelFromBooking(booking);
        const room = createRoomFromBooking(booking);
        const bookingId = booking.id ?? booking.bookingId ?? booking.booking_id;
        const customerName = booking.customerName ?? booking.customer_name ?? "Unknown";
        const checkIn = booking.checkInDate ?? booking.check_in_date ?? booking.checkIn;
        const checkOut = booking.checkOutDate ?? booking.check_out_date ?? booking.checkOut;
        const totalPrice = booking.totalPrice ?? booking.total_price ?? null;
        const bookingStatus = getBookingStatus(booking);

        tableHTML += `
          <tr>
            <td class="tdhotel">${renderHotelCell(hotel)}</td>
            <td>${renderRoomCell(room)}</td>
            <td class="ucnobi">${customerName}</td>
            <td>
              <div class="booked">${bookingStatus}</div>
            </td>
            <td>${formatDate(checkIn)}</td>
            <td>${formatDate(checkOut)}</td>
            <td>${formatPrice(totalPrice)}</td>
            <td style="text-align:center;">
              <button type="button" class="cancel" data-booking-id="${bookingId}">
                Cancel
              </button>
            </td>
          </tr>
        `;
      });
    }

    tableHTML += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHTML;

    // გაუქმების ღილაკების მიბმა
    container.querySelectorAll(".cancel").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        cancelBooking(this.dataset.bookingId);
      });
    });
  }

  // =========================================================
  // 7. ქალაქების ღილაკების გენერირება
  // =========================================================
  function renderCityButtons() {
    if (!citiesContainer) return;

    const uniqueCities = [
      ...new Set(
        cachedBookings
          .map((b) => b.city ?? b.hotelCity ?? b.hotel?.city)
          .filter(Boolean)
          .map((c) => String(c).trim())
      )
    ].sort();

    citiesContainer.innerHTML = `
      <div class="inbox">
        <div class="city-item ${currentFilterCity === "all" ? "active" : ""}" data-city="all">
          All
        </div>
        ${uniqueCities
          .map(
            (city) => `
          <div class="city-item ${currentFilterCity === city ? "active" : ""}" data-city="${city}">
            ${city}
          </div>
        `
          )
          .join("")}
      </div>
    `;

    citiesContainer.querySelectorAll(".city-item").forEach((btn) => {
      btn.addEventListener("click", function () {
        currentFilterCity = this.getAttribute("data-city");

        citiesContainer.querySelectorAll(".city-item").forEach((i) => i.classList.remove("active"));
        this.classList.add("active");

        // ფილტრაცია ხდება მომენტალურად მეხსიერებიდან
        renderBookingsTable(currentFilterCity);
      });
    });
  }

  // =========================================================
  // 8. API-დან მონაცემების წამოღება (FETCH)
  // =========================================================
  async function loadInitialData() {
    const token = getToken();

    if (!token) {
      if (statusDiv) statusDiv.textContent = "";
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding: 40px;">
            <p style="font-size: 18px; color: #555;">You are not authorized to view bookings.</p>
            <button type="button" class="auth-choice-btn" style="margin-top: 15px; padding: 10px 20px;" id="inlineLoginBtn">
              Please Log In
            </button>
          </div>
        `;
        document.getElementById("inlineLoginBtn")?.addEventListener("click", openAuthPopup);
      }
      return;
    }

    if (statusDiv) statusDiv.textContent = "Loading reservations...";

    try {
      const response = await fetch(BOOKINGS_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        updateAuthButtons();
        throw new Error("Authorization expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to load reservations (${response.status})`);
      }

      const data = await response.json();
      cachedBookings = Array.isArray(data) ? data : data.bookings || [];

      if (statusDiv) statusDiv.textContent = "";

      renderCityButtons();
      renderBookingsTable(currentFilterCity);
    } catch (error) {
      console.error("Bookings fetch error:", error);
      if (statusDiv) statusDiv.textContent = "";
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding:30px; color:#c00;">
            ${error.message}
          </div>
        `;
      }
    }
  }

  // გაშვება
  loadInitialData();
});