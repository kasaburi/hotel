// =====================================================
// API CONFIG
// =====================================================
const API_BASE = "https://hotel-backend-qeue.onrender.com";
const ROOMS_API = `${API_BASE}/api/Rooms/GetAll`;
const STEP_ROOMS_API = "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll";

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
    Login
    <img src="./image/login.svg" class="login">
  </button>
`;
document.body.appendChild(overlay);

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

// =====================================================
// 2. AUTHENTICATION & LOGIN POPUP
// =====================================================
const mobileLogin = overlay.querySelector("#mobileLogin");
const desktopLogin = document.getElementById("btnLoginRegister");
const authPopup = document.getElementById("authPopup");
const authContent = document.getElementById("authContent");
const popupContent = document.querySelector(".auth-popup-content");
const btnClose = document.getElementById("btnClose");

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("userToken");
}

function openAuthPopup() {
  closeMobileMenu();
  if (!authPopup) return;

  authPopup.style.display = "flex";
  authPopup.classList.add("active");

  if (popupContent) {
    popupContent.classList.remove("registration-popup", "authorization-popup");
  }

  if (authContent) {
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
      closePopup();
      window.location.href = "./singin.html";
    });

    document.getElementById("popupRegister")?.addEventListener("click", () => {
      closePopup();
      window.location.href = "./registre.html";
    });
  }
}

function closePopup() {
  if (!authPopup) return;
  authPopup.style.display = "none";
  authPopup.classList.remove("active");
  if (authContent) authContent.innerHTML = "";
  if (popupContent) popupContent.classList.remove("registration-popup", "authorization-popup");
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
      if (isAuth) logout();
      else openAuthPopup();
    };
  }
}

updateAuthButton();

if (btnClose) btnClose.addEventListener("click", closePopup);
if (authPopup) {
  authPopup.addEventListener("click", (e) => {
    if (e.target === authPopup) closePopup();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});

// =====================================================
// 3. FLATPICKR DATEPICKERS
// =====================================================
const flatpickrConfig = {
  dateFormat: "Y-m-d",
  disableMobile: true,
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    months: {
      shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  },
  onChange: () => {
    currentPage = 1;
    filterRooms();
  }
};

if (document.getElementById("filter-checkout")) flatpickr("#filter-checkout", flatpickrConfig);
if (document.getElementById("filter-checkin")) flatpickr("#filter-checkin", flatpickrConfig);

// =====================================================
// 4. TOOLTIP & WARNINGS
// =====================================================
const tooltip = document.createElement("div");
tooltip.classList.add("tooltip");
document.body.appendChild(tooltip);

const warningIcons = document.querySelectorAll(".warning-icon");
warningIcons.forEach((icon) => {
  icon.addEventListener("mouseenter", (e) => {
    tooltip.textContent = icon.getAttribute("data-tooltip");
    tooltip.classList.add("show");
    tooltip.style.left = e.pageX + "px";
    tooltip.style.top = e.pageY + 20 + "px";
  });

  icon.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + "px";
    tooltip.style.top = e.pageY + 20 + "px";
  });

  icon.addEventListener("mouseleave", () => {
    tooltip.classList.remove("show");
  });
});

// =====================================================
// 5. GUEST POPUP & SELECTION
// =====================================================
function toggleGuestPopup() {
  const popup = document.getElementById("guestPopup");
  if (popup) {
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  }
}

document.addEventListener("click", (e) => {
  const popup = document.getElementById("guestPopup");
  const guestsInput = document.getElementById("guestsInput");
  if (
    popup &&
    popup.style.display === "block" &&
    !popup.contains(e.target) &&
    !guestsInput?.contains(e.target)
  ) {
    popup.style.display = "none";
  }
});

document.getElementById("adultSelect")?.addEventListener("change", () => {
  const val = document.getElementById("adultSelect").value;
  const guestsInput = document.getElementById("guestsInput");
  if (guestsInput) guestsInput.value = val;
  const popup = document.getElementById("guestPopup");
  if (popup) popup.style.display = "none";
  currentPage = 1;
  filterRooms();
});

// =====================================================
// 6. ROOMS STATE & FILTERING
// =====================================================
let allRooms = [];
let currentFilteredRooms = [];
let currentRenderToken = 0;
const ROOMS_PER_PAGE = 10;
let currentPage = 1;
let selectedRoomType = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const hotelIdParam = params.get("hotelId");
  const hotelsContainer = document.getElementById("hotels");
  const roomResults = document.getElementById("roomResults");
  const adultSelect = document.getElementById("adultSelect");
  const guestsInput = document.getElementById("guestsInput");
  const roomTypeSelect = document.getElementById("filter-room-type");
  const priceSlider = document.getElementById("price-slider");
  const minPriceEl = document.getElementById("min-price");
  const maxPriceEl = document.getElementById("max-price");
  const filterBtn = document.getElementById("filter-btn");
  const roomNameInput = document.getElementById("roomNameInput");

  if (hotelsContainer) hotelsContainer.style.display = "none";
  if (roomResults) roomResults.innerHTML = "";

  // შენახული ფილტრების აღდგენა
  let savedFilters = {};
  try {
    savedFilters = JSON.parse(localStorage.getItem("filters")) || {};
  } catch (error) {
    console.warn("filters localStorage error");
  }

  const guestCount = Number(savedFilters.guestCount) || 1;
  if (adultSelect) adultSelect.value = guestCount;
  if (guestsInput) guestsInput.value = guestCount;

  // Price Slider Setup
  if (priceSlider && typeof noUiSlider !== "undefined" && !priceSlider.noUiSlider) {
    noUiSlider.create(priceSlider, {
      start: [0, 1000],
      connect: true,
      range: { min: 0, max: 1000 },
      step: 10
    });

    priceSlider.noUiSlider.on("update", (values) => {
      if (minPriceEl) minPriceEl.textContent = Math.round(Number(values[0]));
      if (maxPriceEl) maxPriceEl.textContent = Math.round(Number(values[1]));
    });

    priceSlider.noUiSlider.on("change", () => {
      currentPage = 1;
      filterRooms();
    });
  }

  // Filter Listeners
  roomTypeSelect?.addEventListener("change", () => {
    selectedRoomType = roomTypeSelect.value ? Number(roomTypeSelect.value) : null;
    syncRoomTypeButtons(selectedRoomType);
    currentPage = 1;
    filterRooms();
  });

  adultSelect?.addEventListener("change", () => {
    currentPage = 1;
    filterRooms();
  });

  guestsInput?.addEventListener("input", () => {
    currentPage = 1;
    filterRooms();
  });

  roomNameInput?.addEventListener("input", () => {
    currentPage = 1;
    filterRooms();
  });

  filterBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    currentPage = 1;
    filterRooms();
  });

  // 1. ქეშიდან მყისიერი ჩატვირთვა
  const localCache = localStorage.getItem("cached_rooms_list");
  if (localCache) {
    try {
      allRooms = JSON.parse(localCache);
      createRoomTypeOptions(allRooms);
      setupRoomTypeButtons();
      filterRooms();
    } catch (e) {}
  }

  // 2. სერვერიდან წამოღება (Smart Fallback-ით)
  fetchRoomsData();
});

async function fetchRoomsData() {
  try {
    let data = null;
    try {
      const response = await fetch(ROOMS_API);
      if (response.ok) data = await response.json();
    } catch (err) {
      console.warn("Render rooms failed, switching to Step...", err);
    }

    if (!data) {
      const stepResponse = await fetch(STEP_ROOMS_API);
      if (!stepResponse.ok) throw new Error("Rooms fetch error");
      data = await stepResponse.json();
    }

    allRooms = Array.isArray(data) ? data : data.rooms || [];
    localStorage.setItem("cached_rooms_list", JSON.stringify(allRooms));

    createRoomTypeOptions(allRooms);
    setupRoomTypeButtons();
    filterRooms();
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    const container = document.getElementById("roomsContainer");
    if (container && allRooms.length === 0) {
      container.innerHTML = `<div class="no-rooms"><p style="color:red;">ოთახების მიღება ვერ მოხერხდა.</p></div>`;
    }
  }
}

// =====================================================
// 7. ROOM TYPE BUTTONS & OPTIONS
// =====================================================
function setupRoomTypeButtons() {
  const container = document.getElementById("roomTypeContainer");
  const roomTypeSelect = document.getElementById("filter-room-type");
  if (!container) return;

  container.innerHTML = "";

  const roomTypes = new Map();
  allRooms.forEach((room) => {
    const id = Number(room.roomTypeId);
    const name = String(room.roomTypeName || "").trim();
    if (!isNaN(id) && id > 0 && name !== "" && !roomTypes.has(id)) {
      roomTypes.set(id, name);
    }
  });

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.textContent = "All";
  allButton.classList.add("room-type-btn");
  if (selectedRoomType === null) allButton.classList.add("active");

  allButton.addEventListener("click", () => {
    selectedRoomType = null;
    currentPage = 1;
    syncRoomTypeButtons(null);
    if (roomTypeSelect) roomTypeSelect.value = "";
    filterRooms();
  });
  container.appendChild(allButton);

  roomTypes.forEach((name, id) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.classList.add("room-type-btn");
    button.dataset.id = String(id);
    if (selectedRoomType === id) button.classList.add("active");

    button.addEventListener("click", () => {
      selectedRoomType = Number(id);
      currentPage = 1;
      syncRoomTypeButtons(selectedRoomType);
      if (roomTypeSelect) roomTypeSelect.value = String(id);
      filterRooms();
    });
    container.appendChild(button);
  });
}

function syncRoomTypeButtons(activeId) {
  document.querySelectorAll(".room-type-btn").forEach((btn) => {
    if (activeId === null) {
      btn.classList.toggle("active", btn.textContent === "All");
    } else {
      btn.classList.toggle("active", btn.dataset.id === String(activeId));
    }
  });
}

function createRoomTypeOptions(rooms) {
  const select = document.getElementById("filter-room-type");
  if (!select) return;

  select.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All rooms";
  select.appendChild(allOption);

  const roomTypes = new Map();
  rooms.forEach((room) => {
    const id = Number(room.roomTypeId);
    const name = String(room.roomTypeName || "").trim();
    if (!isNaN(id) && name !== "" && !roomTypes.has(id)) {
      roomTypes.set(id, name);
    }
  });

  roomTypes.forEach((name, id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    select.appendChild(option);
  });
}

// =====================================================
// 8. FILTER ROOMS (გამართული და დახვეწილი)
// =====================================================
function filterRooms() {
  const params = new URLSearchParams(window.location.search);
  const hotelIdParam = params.get("hotelId");
  const hotelId = hotelIdParam !== null ? Number(hotelIdParam) : null;

  const minPrice = Number(document.getElementById("min-price")?.textContent) || 0;
  const maxPriceText = document.getElementById("max-price")?.textContent;
  const maxPrice = maxPriceText !== undefined && maxPriceText !== "" ? Number(maxPriceText) : Infinity;

  const adultGuests = Number(document.getElementById("adultSelect")?.value) || 1;
  const inputGuests = Number(document.getElementById("guestsInput")?.value) || 0;
  const guests = Math.max(adultGuests, inputGuests);

  const searchText = document.getElementById("roomNameInput")?.value?.toLowerCase()?.trim() || "";

  const roomTypeSelect = document.getElementById("filter-room-type");
  const roomTypeValue = roomTypeSelect?.value || "";
  const typeFilter = selectedRoomType !== null ? selectedRoomType : roomTypeValue !== "" ? Number(roomTypeValue) : null;

  currentFilteredRooms = allRooms.filter((room) => {
    // Hotel ID ფილტრი (URL-დან)
    if (hotelId !== null && Number(room.hotelId) !== hotelId) return false;

    // Room Type ფილტრი
    if (typeFilter !== null && Number(room.roomTypeId) !== typeFilter) return false;

    // Price ფილტრი
    const price = Number(room.pricePerNight);
    if (isNaN(price)) return false;
    if (price < minPrice || price > maxPrice) return false;

    // Guests ფილტრი
    const maxGuests = Number(room.maxGuests);
    if (!isNaN(maxGuests) && maxGuests < guests) return false;

    // Search Name ფილტრი
    if (searchText !== "") {
      const roomName = String(room.name || "").toLowerCase();
      const roomTypeName = String(room.roomTypeName || "").toLowerCase();
      if (!roomName.includes(searchText) && !roomTypeName.includes(searchText)) {
        return false;
      }
    }

    return true;
  });

  currentRenderToken++;
  renderRooms(currentFilteredRooms, currentRenderToken);
  return currentFilteredRooms;
}

// =====================================================
// 9. RENDER ROOMS CARDS & PAGINATION
// =====================================================
function renderRooms(rooms, token = currentRenderToken) {
  if (token !== currentRenderToken) return;

  const container = document.getElementById("roomsContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!rooms || !rooms.length) {
    container.innerHTML = `
      <div class="no-rooms">
        <p>ოთახები ვერ მოიძებნა.</p>
      </div>
    `;
    renderPagination(0, rooms);
    return;
  }

  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
  const endIndex = startIndex + ROOMS_PER_PAGE;
  const roomsForCurrentPage = rooms.slice(startIndex, endIndex);

  roomsForCurrentPage.forEach((room) => {
    const imgSrc =
      room.images?.[0]?.source ||
      room.images?.[0]?.url ||
      room.image ||
      "https://via.placeholder.com/300x200";

    const card = document.createElement("div");
    card.classList.add("card-container");

    card.innerHTML = `
      <div class="card" style="position: relative;">
        <img src="${imgSrc}" alt="${room.name || "Room"}" class="img" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200';">
        <div class="card1">
          <h3>${room.name || room.roomTypeName || "Room"}</h3>
          <div class="cardbody">
            <p class="euro">&euro; ${room.pricePerNight ?? 0}</p>
            <p class="night">a night</p>
          </div>
        </div>
        <button class="book-btn1" style="margin-bottom: 10px; display: none;">
          <a href="./booknow.html?roomId=${room.id}" class="bookbtn">Book Now</a>
        </button>
      </div>
    `;

    const cardDiv = card.querySelector(".card");
    const bookBtn = card.querySelector(".book-btn1");

    if (cardDiv && bookBtn) {
      cardDiv.addEventListener("mouseenter", () => {
        bookBtn.style.display = "block";
      });
      cardDiv.addEventListener("mouseleave", () => {
        bookBtn.style.display = "none";
      });
    }

    container.appendChild(card);
  });

  // პაგინაციის გამოძახება სწორი პარამეტრებით
  renderPagination(totalPages, rooms);
}

// =====================================================
// 10. PAGINATION (გასწორებული - აღარ ქრაფავს)
// =====================================================
function renderPagination(totalPages, filteredRooms) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "‹";
  prevBtn.disabled = currentPage === 1;

  prevBtn.addEventListener("click", () => {
    if (currentPage <= 1) return;
    currentPage--;
    currentRenderToken++;
    renderRooms(filteredRooms, currentRenderToken);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  pagination.appendChild(prevBtn);

  // Page Numbers
  for (let page = 1; page <= totalPages; page++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "page-btn";
    pageBtn.textContent = page;
    if (page === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      if (page === currentPage) return;
      currentPage = page;
      currentRenderToken++;
      renderRooms(filteredRooms, currentRenderToken);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pagination.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "›";
  nextBtn.disabled = currentPage === totalPages;

  nextBtn.addEventListener("click", () => {
    if (currentPage >= totalPages) return;
    currentPage++;
    currentRenderToken++;
    renderRooms(filteredRooms, currentRenderToken);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  pagination.appendChild(nextBtn);
}

// =====================================================
// 11. RESET FILTERS (ერთიანი გამართული ლოგიკა)
// =====================================================
function resetFilters() {
  const roomTypeSelect = document.getElementById("filter-room-type");
  if (roomTypeSelect) roomTypeSelect.value = "";
  selectedRoomType = null;
  syncRoomTypeButtons(null);

  const roomNameInput = document.getElementById("roomNameInput");
  if (roomNameInput) roomNameInput.value = "";

  const adultSelect = document.getElementById("adultSelect");
  if (adultSelect) adultSelect.value = "1";

  const guestsInput = document.getElementById("guestsInput");
  if (guestsInput) guestsInput.value = "1";

  const checkIn = document.getElementById("filter-checkin");
  if (checkIn) checkIn.value = "";

  const checkOut = document.getElementById("filter-checkout");
  if (checkOut) checkOut.value = "";

  const priceSlider = document.getElementById("price-slider");
  if (priceSlider && priceSlider.noUiSlider) {
    priceSlider.noUiSlider.set([0, 1000]);
  }

  const minPriceEl = document.getElementById("min-price");
  if (minPriceEl) minPriceEl.textContent = "0";

  const maxPriceEl = document.getElementById("max-price");
  if (maxPriceEl) maxPriceEl.textContent = "1000";

  localStorage.removeItem("filters");
  currentPage = 1;

  filterRooms();
}

const resetButton = document.getElementById("reset-btn");
if (resetButton) {
  resetButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetFilters();
  });
}