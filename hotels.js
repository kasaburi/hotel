// ==========================================
// NAVIGATION & HAMBURGER
// ==========================================
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

const mobileLogin = document.getElementById("mobileLogin");
const desktopLogin = document.getElementById("btnLoginRegister");
const authPopup = document.getElementById("authPopup");
const authContent = document.getElementById("authContent");
const popupContent = document.querySelector(".auth-popup-content");
const btnClose = document.getElementById("btnClose");

function openAuthPopup() {
  if (!authPopup) return;

  // მობილური მენიუს დახურვა
  overlay.classList.remove("active");
  if (hamburger) {
    hamburger.style.display = "block";
  }

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

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("userToken");
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

  if (desktopLogin) {
    desktopLogin.innerHTML = `
      ${token ? "Log Out" : "Login"}
      <img src="./image/login.svg" class="login" alt="${token ? "Log Out" : "Login"}">
    `;
    desktopLogin.onclick = () => {
      if (token) logout();
      else openAuthPopup();
    };
  }

  if (mobileLogin) {
    mobileLogin.innerHTML = `
      ${token ? "Log Out" : "Login"}
      <img src="./image/login.svg" class="login" alt="${token ? "Log Out" : "Login"}">
    `;
    mobileLogin.onclick = () => {
      if (token) logout();
      else openAuthPopup();
    };
  }
}

updateAuthButton();

if (btnClose) {
  btnClose.addEventListener("click", closePopup);
}

if (authPopup) {
  authPopup.addEventListener("click", (event) => {
    if (event.target === authPopup) closePopup();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePopup();
});

overlay.addEventListener("click", (event) => {
  if (event.target.closest("#mobileLogin")) return;
  overlay.classList.remove("active");
  if (hamburger) {
    hamburger.style.display = "block";
  }
});

// ==========================================
// HOTELS & CITIES LOGIC
// ==========================================
let citiesContainer = document.querySelector(".sity");
let container = document.getElementById("hotels");

let allHotels = [];

async function fetchData(url) {
  let response = await fetch(url);
  if (!response.ok) throw new Error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
  return await response.json();
}

function renderHotels(hotels) {
  if (!container) return;
  container.innerHTML = "";

  hotels.forEach((hotel) => {
    const hotelDiv = document.createElement("div");
    hotelDiv.className = "hotel-card";
    hotelDiv.innerHTML = `
      <div class="card">
        <img class="img" src="${hotel.featuredImage}" alt="${hotel.name}" style="width:100%; height:auto;" />
        <h2>${hotel.name}</h2>
        <button class="button" style="margin-bottom: 10px; display: none;">
          <a href="./rooms.html?hotelId=${hotel.id}" class="book">book Now</a>
        </button>
      </div>
    `;
    container.appendChild(hotelDiv);
  });

  updateButtonVisibility();
  applyHoverEventsIfNeeded();
}

function applyHoverEventsIfNeeded() {
  const cards = document.querySelectorAll(".hotel-card");

  if (window.innerWidth > 768) {
    cards.forEach((card) => {
      const img = card.querySelector(".img");
      const button = card.querySelector(".button");

      card.addEventListener("mouseenter", () => {
        img.style.display = "none";
        button.style.display = "inline-block";
      });

      card.addEventListener("mouseleave", () => {
        img.style.display = "block";
        button.style.display = "none";
      });
    });
  }
}

function updateButtonVisibility() {
  const buttons = document.querySelectorAll(".button");
  if (window.innerWidth <= 768) {
    buttons.forEach((button) => (button.style.display = "inline-block"));
  } else {
    buttons.forEach((button) => (button.style.display = "none"));
  }
}

// ოთახების ფილტრაცია ლოკალურად (სერვერის დაუყოვნებლად)
function loadHotelsByCity(city) {
  if (!city || city === "all") {
    renderHotels(allHotels);
  } else {
    const filtered = allHotels.filter(
      (h) => String(h.city || "").toLowerCase() === city.toLowerCase()
    );
    renderHotels(filtered);
  }
}

async function loadInitialHotels() {
  try {
    // სასტუმროები იტვირთება 1-ხელ და ინახება
    allHotels = await fetchData("https://hotel-backend-qeue.onrender.com/api/hotels");
    renderHotels(allHotels);
  } catch (error) {
    if (container) {
      container.innerHTML = `<p style="color:red;">შეცდომა: ${error.message}</p>`;
    }
  }
}

async function loadCities() {
  if (!citiesContainer) return;

  try {
    const cities = await fetchData("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities");

    citiesContainer.innerHTML = `
      <div class="inbox">
        <div class="city-item data-city active" data-city="all">All</div>
        ${cities.map((city) => `<div class="city-item" data-city="${city}">${city}</div>`).join("")}
      </div>
    `;

    document.querySelectorAll(".city-item").forEach((btn) => {
      btn.addEventListener("click", function () {
        const selectedCity = this.getAttribute("data-city");

        document.querySelectorAll(".city-item").forEach((el) => el.classList.remove("active"));
        this.classList.add("active");

        loadHotelsByCity(selectedCity);
      });
    });
  } catch (error) {
    citiesContainer.innerHTML = `<p style="color:red;">ქალაქები ვერ ჩაიტვირთა: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!citiesContainer || !container) {
    return;
  }

  // შენი ორიგინალი hover ეფექტი ქალაქებზე
  citiesContainer.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("city-item")) {
      e.target.style.backgroundColor = "#c5c4c43a";
    }
  });

  citiesContainer.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("city-item")) {
      e.target.style.backgroundColor = "transparent";
    }
  });

  loadCities();
  loadInitialHotels();

  window.addEventListener("resize", () => {
    updateButtonVisibility();
    applyHoverEventsIfNeeded();
  });
});