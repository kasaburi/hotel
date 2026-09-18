// =====================================================
// API CONFIG
// =====================================================
const API_BASE = "https://hotel-backend-qeue.onrender.com";
const ROOMS_API = `${API_BASE}/api/Rooms/GetAll`;
const BOOKINGS_API = `${API_BASE}/api/Booking`;

// =====================================================
// 1. მობილური მენიუ & OVERLAY
// =====================================================
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

overlay.addEventListener("click", (event) => {
  if (event.target.closest("#mobileLogin")) return;
  closeMobileMenu();
});

// =====================================================
// 2. AUTHENTICATION & LOGIN POPUP
// =====================================================
function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("userToken");
}

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
  const isAuth = !!getToken();
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
  if (e.key === "Escape") closeAuthPopup();
});

updateAuthButton();

// =====================================================
// 3. მონაცემთა ერთიანი FETCH & CACHE (სერვერის დასაცავად)
// =====================================================
let cachedAllRooms = null;

async function getAllRoomsCached() {
  if (cachedAllRooms) return cachedAllRooms;

  // ბრაუზერის მეხსიერებიდან შემოწმება
  const localCache = localStorage.getItem("cached_rooms_list");
  if (localCache) {
    try {
      cachedAllRooms = JSON.parse(localCache);
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const res = await fetch(ROOMS_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cachedAllRooms = Array.isArray(data) ? data : data.rooms || [];
    localStorage.setItem("cached_rooms_list", JSON.stringify(cachedAllRooms));
    return cachedAllRooms;
  } catch (err) {
    console.error("Room fetch error:", err);
    return cachedAllRooms || [];
  }
}

// =====================================================
// 4. BOOKING PAGE FORM & PAYMENT
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registrationForm");
  const params = new URLSearchParams(window.location.search);
  const currentRoomId = params.get("roomId");

  // Elements
  const submitBtn = form?.querySelector(".submit");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("popup-close");
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");

  let currentRoom = null;
  let currentRoomPrice = 0;
  let flatpickrCheckin = null;
  let flatpickrCheckout = null;

  function showPopup(message) {
    if (!popup || !popupMessage) return;
    popupMessage.textContent = message;
    popup.style.display = "flex";
  }

  popupClose?.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Local Storage Helper
  const Storage = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    add(key, value) {
      if (!value) return;
      const list = Storage.get(key);
      if (!list.includes(value)) {
        list.push(value);
        Storage.set(key, list);
      }
    }
  };

  // Dropdown History
  const renderers = [];
  function attachDropdown(input, storageKey) {
    if (!input) return;
    let wrapper = input.closest(".date-wrapper") || input.closest(".popup");
    if (!wrapper) return;

    let history = Storage.get(storageKey);
    const list = document.createElement("ul");
    list.classList.add("dropdown-list");
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      history.forEach((value, index) => {
        const li = document.createElement("li");
        li.classList.add("history-item");
        li.textContent = value;

        const delBtn = document.createElement("button");
        delBtn.textContent = "✖";
        delBtn.classList.add("delete-btn");
        delBtn.onclick = (e) => {
          e.stopPropagation();
          history.splice(index, 1);
          Storage.set(storageKey, history);
          render();
        };

        li.appendChild(delBtn);
        li.onclick = () => {
          input.value = value;
          list.innerHTML = "";
          validateForm();
        };
        list.appendChild(li);
      });
      list.style.display = history.length ? "block" : "none";
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = input.value.trim();
        if (value && !history.includes(value)) {
          history.push(value);
          Storage.set(storageKey, history);
          render();
        }
      }
    });

    input.addEventListener("focus", render);
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".date-wrapper") && !e.target.closest(".popup")) {
        list.style.display = "none";
      }
    });

    renderers.push(render);
  }

  attachDropdown(document.getElementById("filter-checkin"), "checkinHistory");
  attachDropdown(document.getElementById("filter-checkout"), "checkoutHistory");
  attachDropdown(nameInput, "nameHistory");
  attachDropdown(phoneInput, "phoneHistory");

  // Form Validation
  function validateForm() {
    if (!form) return false;
    const checkin = form.checkin?.value.trim() || "";
    const checkout = form.checkout?.value.trim() || "";
    const customerName = nameInput?.value.trim() || "";
    const customerPhone = phoneInput?.value.trim() || "";

    let valid = true;
    const checkinError = document.getElementById("checkin-error");
    const checkoutError = document.getElementById("checkout-error");
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");

    if (checkinError) checkinError.style.display = !checkin ? "block" : "none";
    if (!checkin) valid = false;

    if (checkoutError) checkoutError.style.display = !checkout ? "block" : "none";
    if (!checkout) valid = false;

    if (nameError) nameError.style.display = !customerName ? "block" : "none";
    if (!customerName) valid = false;

    const phoneValid = /^\d{9}$/.test(customerPhone);
    if (phoneError) phoneError.style.display = !phoneValid ? "block" : "none";
    if (!phoneValid) valid = false;

    if (submitBtn) submitBtn.disabled = !valid;
    return valid;
  }

  form?.addEventListener("input", validateForm);

  // Fetch Booked Dates
  async function fetchBookedDates(roomId) {
    const token = getToken();
    if (!token) return [];

    try {
      const res = await fetch(BOOKINGS_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) return [];
      const responseData = await res.json();
      const bookings = Array.isArray(responseData) ? responseData : responseData.bookings || [];

      return bookings
        .filter((b) => Number(b.roomID ?? b.roomId ?? b.room_id) === Number(roomId))
        .map((b) => ({
          from: String(b.checkInDate ?? b.check_in_date).split("T")[0],
          to: String(b.checkOutDate ?? b.check_out_date).split("T")[0]
        }));
    } catch (err) {
      console.warn("Booked dates load error:", err);
      return [];
    }
  }

  // Flatpickr Setup
  function initFlatpickr(disabledDates) {
    const localeGE = {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        longhand: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      }
    };

    function markDisabledDates(dateObj) {
      const current = new Date(dateObj);
      current.setHours(0, 0, 0, 0);

      return disabledDates.some((d) => {
        const from = new Date(d.from);
        const to = new Date(d.to);
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        return current >= from && current < to;
      });
    }

    flatpickrCheckin?.destroy();
    flatpickrCheckout?.destroy();

    const checkinInput = document.getElementById("filter-checkin");
    const checkoutInput = document.getElementById("filter-checkout");
    if (!checkinInput || !checkoutInput) return;

    flatpickrCheckin = flatpickr(checkinInput, {
      dateFormat: "Y-m-d",
      disableMobile: true,
      locale: localeGE,
      disable: [markDisabledDates],
      onChange: validateForm,
      onDayCreate: (_, _2, _3, dayElem) => {
        if (markDisabledDates(dayElem.dateObj)) dayElem.classList.add("booked-day");
      }
    });

    flatpickrCheckout = flatpickr(checkoutInput, {
      dateFormat: "Y-m-d",
      disableMobile: true,
      locale: localeGE,
      disable: [markDisabledDates],
      onChange: validateForm,
      onDayCreate: (_, _2, _3, dayElem) => {
        if (markDisabledDates(dayElem.dateObj)) dayElem.classList.add("booked-day");
      }
    });
  }

  // Current Room Data Load
  if (currentRoomId) {
    const allRooms = await getAllRoomsCached();
    currentRoom = allRooms.find((r) => Number(r.id) === Number(currentRoomId));

    if (!currentRoom) {
      showPopup("❌ ოთახის მონაცემების მიღება ვერ მოხერხდა.");
      return;
    }

    currentRoomPrice = Number(currentRoom.pricePerNight || 0);

    // პარალელურად წამოვიღოთ დაჯავშნილი თარიღები
    fetchBookedDates(currentRoomId).then(initFlatpickr);

    const title = document.getElementById("registration-title");
    if (title) {
      title.textContent = `${currentRoom.name || currentRoom.roomTypeName || "Room"} - €${currentRoomPrice}`;
    }
  }

  // Book Room
  async function bookRoom() {
    if (!validateForm()) return;
    const token = getToken();

    if (!token) {
      showPopup("❌ გთხოვთ გაიაროთ Login.");
      openAuthPopup();
      return;
    }

    if (!currentRoomId || !currentRoom) {
      showPopup("❌ ოთახის ინფორმაცია ვერ მოიძებნა.");
      return;
    }

    const checkin = form.checkin.value.trim();
    const checkout = form.checkout.value.trim();
    const customerName = nameInput.value.trim();

    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      showPopup("❌ გთხოვთ სწორად მიუთითოთ თარიღები.");
      return;
    }

    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      showPopup("❌ Check-out უნდა იყოს Check-in-ზე გვიან.");
      return;
    }

    const guests = 1;
    const maxGuests = Number(currentRoom.maxGuests || 1);
    if (guests > maxGuests) {
      showPopup(`❌ ამ ოთახში მაქსიმუმ ${maxGuests} სტუმარია შესაძლებელი.`);
      return;
    }

    const roomPrice = Number(currentRoom.pricePerNight || 0);
    const totalPrice = nights * roomPrice;
    const roomName = currentRoom.name || currentRoom.roomTypeName || "Hotel Room";

    showFakePayment({
      roomId: Number(currentRoomId),
      roomName,
      roomPrice,
      nights,
      totalPrice,
      checkin,
      checkout,
      customerName,
      guests
    });
  }

  // Fake Payment Modal
  function showFakePayment(bookingData) {
    const modal = document.getElementById("paymentModal");
    if (!modal) {
      showPopup("❌ გადახდის ფანჯარა ვერ ჩაიტვირთა.");
      return;
    }

    document.getElementById("paymentRoomName") && (document.getElementById("paymentRoomName").textContent = bookingData.roomName);
    document.getElementById("paymentRoomPrice") && (document.getElementById("paymentRoomPrice").textContent = `${bookingData.roomPrice} ₾ / ღამე`);
    document.getElementById("paymentNights") && (document.getElementById("paymentNights").textContent = `${bookingData.nights} ღამე`);
    document.getElementById("paymentTotal") && (document.getElementById("paymentTotal").textContent = `${bookingData.totalPrice} ₾`);

    modal.classList.remove("hidden");

    const payButton = document.getElementById("payButton");
    if (!payButton) return;

    payButton.disabled = false;
    payButton.textContent = `გადახდა ${bookingData.totalPrice} ₾`;
    payButton.style.background = "";

    payButton.onclick = async function () {
      const cardNumberInput = document.getElementById("cardNumber");
      const expiryInput = document.getElementById("cardExpiry");
      const cvvInput = document.getElementById("cardCvv");

      if (!cardNumberInput || !expiryInput || !cvvInput) return;

      const cardNumber = cardNumberInput.value.replace(/\s/g, "");
      const expiry = expiryInput.value.trim();
      const cvv = cvvInput.value.trim();

      if (!cardNumber || !expiry || !cvv) {
        showPopup("❌ გთხოვთ შეავსოთ ბარათის ყველა ველი.");
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        showPopup("❌ ბარათის ნომერი უნდა შეიცავდეს 16 ციფრს.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showPopup("❌ ვადის ფორმატი უნდა იყოს MM/YY.");
        return;
      }
      const expiryMonth = Number(expiry.split("/")[0]);
      if (expiryMonth < 1 || expiryMonth > 12) {
        showPopup("❌ თვე უნდა იყოს 01-დან 12-მდე.");
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        showPopup("❌ CVV უნდა შეიცავდეს 3 ციფრს.");
        return;
      }

      payButton.disabled = true;
      payButton.textContent = "გადახდა მუშავდება...";

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        payButton.textContent = "გადახდა წარმატებით შესრულდა ✓";
        payButton.style.background = "#28a745";

        await createBookingAfterPayment(bookingData);
      } catch (error) {
        payButton.disabled = false;
        payButton.textContent = `გადახდა ${bookingData.totalPrice} ₾`;
        payButton.style.background = "";
        showPopup(`❌ ${error.message || "გადახდა ვერ შესრულდა."}`);
      }
    };
  }

  // Create Booking
  async function createBookingAfterPayment(bookingData) {
    const token = getToken();
    if (!token) throw new Error("ავტორიზაციის ვადა გავიდა.");

    const payload = {
      roomId: bookingData.roomId,
      customerName: bookingData.customerName,
      checkInDate: bookingData.checkin,
      checkOutDate: bookingData.checkout,
      guests: bookingData.guests
    };

    const response = await fetch(BOOKINGS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = "დაჯავშნა ვერ შესრულდა.";
      try {
        const errorData = await response.json();
        errorMessage = errorData?.detail || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const result = await response.json();

    document.getElementById("paymentModal")?.classList.add("hidden");

    Storage.add("checkinHistory", bookingData.checkin);
    Storage.add("checkoutHistory", bookingData.checkout);
    Storage.add("nameHistory", bookingData.customerName);
    if (phoneInput) Storage.add("phoneHistory", phoneInput.value.trim());

    form.reset();
    if (submitBtn) submitBtn.disabled = true;

    showPopup(
      `✅ გადახდა და დაჯავშნა წარმატებით შესრულდა!\n\n` +
      `🏨 ${bookingData.roomName}\n` +
      `📅 ${bookingData.checkin} → ${bookingData.checkout}\n` +
      `💳 სულ გადახდილი: ${bookingData.totalPrice} ₾\n\n` +
      `გადაგიყვანთ თქვენს ჯავშნებზე...`
    );

    setTimeout(() => {
      window.location.href = "./bookedrooms.html";
    }, 2000);

    return result;
  }

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    bookRoom();
  });
});

// =====================================================
// 5. ROOM DETAILS / GALLERY (SWIPER)
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("roomId");
  const roomDetailsEl = document.getElementById("room-details");
  const swiperWrapper = document.getElementById("swiper-wrapper");

  if (!roomDetailsEl || !swiperWrapper || !roomId) return;

  const PLACEHOLDER = "https://via.placeholder.com/800x500?text=No+Image";

  function toAbsoluteUrl(src) {
    if (!src) return PLACEHOLDER;
    const s = String(src).trim();
    if (/^https?:\/\//i.test(s) || /^data:/i.test(s)) return s;
    if (s.startsWith("/")) return API_BASE + s;
    return `${API_BASE}/${s.replace(/^\.?\//, "")}`;
  }

  try {
    const rooms = await getAllRoomsCached();
    const room = rooms.find((r) => Number(r.id) === Number(roomId));

    if (!room) throw new Error("ოთახი ვერ მოიძებნა");

    swiperWrapper.innerHTML = "";
    const images = Array.isArray(room.images) ? room.images : [];

    if (images.length === 0) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${PLACEHOLDER}" alt="No image" loading="lazy">`;
      swiperWrapper.appendChild(slide);
    } else {
      images.forEach((image) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        const source = typeof image === "string" ? image : image?.source || image?.url;
        slide.innerHTML = `<img src="${toAbsoluteUrl(source)}" alt="${room.name || "Room"}" loading="lazy" onerror="this.onerror=null; this.src='${PLACEHOLDER}';">`;
        swiperWrapper.appendChild(slide);
      });
    }

    if (document.querySelector(".swiper") && typeof Swiper !== "undefined") {
      new Swiper(".swiper", {
        loop: images.length > 1,
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    }
  } catch (err) {
    console.error("Gallery load error:", err);
  }
});

// =====================================================
// 6. TABS
// =====================================================
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) return;

    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const displayImg = document.getElementById("displayImg");
    const displayText = document.getElementById("displayText");

    if (displayImg) {
      if (btn.dataset.img) {
        displayImg.src = btn.dataset.img;
        displayImg.style.display = "block";
      } else {
        displayImg.style.display = "none";
      }
    }

    if (displayText) {
      displayText.textContent = btn.dataset.text || "";
    }
  });
});

// =====================================================
// 7. LOAD 3 RECOMMENDED ROOMS (BOTTOM)
// =====================================================
async function loadBottomRooms() {
  const container = document.getElementById("roomsContainer");
  if (!container) return;

  try {
    const rooms = await getAllRoomsCached();
    const firstThreeRooms = rooms.slice(0, 3);

    container.innerHTML = "";

    firstThreeRooms.forEach((room) => {
      const imgSrc = room.images?.[0]?.source || "https://via.placeholder.com/300x200?text=No+Image";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${imgSrc}" alt="${room.name || "Room"}" class="img" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=No+Image';">
        <div class="card1">
          <h3>${room.name || "Room"}</h3>
          <div class="cardbody">
            <p class="euro">&euro; ${room.pricePerNight ?? 0}</p>
            <p class="night">a night</p>
          </div>
        </div>
        <button class="book-btn" style="display:none;">
          <a href="./booknow.html?roomId=${room.id}" class="book">Book Now</a>
        </button>
      `;

      const bookBtn = card.querySelector(".book-btn");
      const img = card.querySelector("img");

      card.addEventListener("mouseenter", () => {
        if (bookBtn) bookBtn.style.display = "block";
        if (img) img.style.display = "none";
      });

      card.addEventListener("mouseleave", () => {
        if (bookBtn) bookBtn.style.display = "none";
        if (img) img.style.display = "block";
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Bottom rooms error:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadBottomRooms);