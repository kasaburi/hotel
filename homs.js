document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DOM ელემენტები
  // ==========================================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const authPopup = document.getElementById("authPopup");
  const authContent = document.getElementById("authContent");
  const popupContent = document.querySelector(".auth-popup-content");
  const btnClose = document.getElementById("btnClose");
  const desktopLogin = document.getElementById("btnLoginRegister");
  const section = document.getElementById("section");
  const cityContainer = document.getElementById("city");

  // API მისამართები (ორივე ბაზა)
  const RENDER_ROOMS_API = "https://hotel-backend-qeue.onrender.com/api/Rooms/GetAll";
  const STEP_ROOMS_API = "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll";
  const STEP_CITIES_API = "https://hotelbooking.stepprojects.ge/api/Hotels/GetCities";

  // ==========================================
  // 2. მობილური მენიუ (OVERLAY)
  // ==========================================
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

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("#mobileLogin")) return;
    closeMobileMenu();
  });

  // ==========================================
  // 3. ავტორიზაცია & LOGIN POPUP
  // ==========================================
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
        if (isAuth) {
          logout();
        } else {
          closeMobileMenu();
          openAuthPopup();
        }
      };
    }
  }

  btnClose?.addEventListener("click", closePopup);
  authPopup?.addEventListener("click", (e) => {
    if (e.target === authPopup) closePopup();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });

  updateAuthButton();

  // ==========================================
  // 4. ოთახების გამოტანა (ქეშით & სარეზერვო ბაზით)
  // ==========================================
  function cardPrint(room) {
    const firstImage = room.images?.[0]?.source || "https://via.placeholder.com/300";
    return `
      <div class="card">
        <img src="${firstImage}" class="img" alt="${room.name || "Room"}">
        <div class="cardbody">
          <h5 class="name">${room.name || "Room"}</h5>
          <p class="text">&euro;${room.pricePerNight ?? 0} <span class="night">a night</span></p>
        </div>
        <button class="button" style="display: none; margin-bottom: 10px;">
          <a href="./booknow.html?roomId=${room.id}" class="book">Book Now</a>
        </button>
      </div>
    `;
  }

  function renderRooms(rooms) {
    if (!section) return;
    section.innerHTML = rooms.map(cardPrint).join("");

    section.querySelectorAll(".card").forEach((card) => {
      const img = card.querySelector(".img");
      const button = card.querySelector(".button");

      if (img && button) {
        card.addEventListener("mouseenter", () => {
          img.style.display = "none";
          button.style.display = "inline-block";
        });
        card.addEventListener("mouseleave", () => {
          img.style.display = "block";
          button.style.display = "none";
        });
      }
    });
  }

  async function getAll() {
    if (!section) return;

    // 1. თუ ქეშში გვაქვს, გამოვიტანოთ ეგრევე 0 წამში!
    const cached = localStorage.getItem("cached_top6_rooms");
    if (cached) {
      try {
        renderRooms(JSON.parse(cached));
      } catch (e) {
        console.error("Cache error", e);
      }
    } else {
      section.innerHTML = "<p style='text-align:center; padding:30px;'>Loading rooms, please wait...</p>";
    }

    // 2. ვცადოთ Render ბაზიდან წამოღება, ხოლო თუ გათიშულია -> Step-ის ბაზიდან
    try {
      let data = null;

      try {
        const res = await fetch(RENDER_ROOMS_API);
        if (res.ok) data = await res.json();
      } catch (renderErr) {
        console.warn("Render base sleeping or failed, switching to Step base...", renderErr);
      }

      // თუ Render-მა ვერ დააბრუნა, მივმართოთ Step-ის ბაზას
      if (!data) {
        const stepRes = await fetch(STEP_ROOMS_API);
        if (!stepRes.ok) throw new Error("Both databases failed to load rooms");
        data = await stepRes.json();
      }

      const roomsList = Array.isArray(data) ? data : data.rooms || [];
      const top6Rooms = roomsList
        .sort((a, b) => (b.reservationCount || 0) - (a.reservationCount || 0))
        .slice(0, 6);

      // განვაახლოთ ქეში და ეკრანი
      localStorage.setItem("cached_top6_rooms", JSON.stringify(top6Rooms));
      renderRooms(top6Rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      if (!cached) {
        section.innerHTML = "<p style='color:red; text-align:center;'>Loading failed. Please refresh.</p>";
      }
    }
  }

  getAll();

  // ==========================================
  // 5. ქალაქების გამოტანა (CITIES)
  // ==========================================
  async function loadCities() {
    if (!cityContainer) return;

    // ქეშიდან გამოტანა
    const cachedCities = localStorage.getItem("cached_cities");
    if (cachedCities) {
      try {
        renderCities(JSON.parse(cachedCities));
      } catch (e) {}
    }

    try {
      const response = await fetch(STEP_CITIES_API);
      if (!response.ok) throw new Error("Unable to load cities.");

      const cities = await response.json();
      localStorage.setItem("cached_cities", JSON.stringify(cities));
      renderCities(cities);
    } catch (error) {
      console.error("Cities error:", error);
      if (!cachedCities) {
        cityContainer.innerHTML = "<p style='color:red;'>Unable to load cities.</p>";
      }
    }
  }

  function renderCities(cities) {
    if (!cityContainer || !Array.isArray(cities)) return;
    cityContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    cities.forEach((city) => {
      const cityBtn = document.createElement("button");
      cityBtn.textContent = city;
      cityBtn.classList.add("city-btn");

      cityBtn.addEventListener("click", () => {
        if (!getToken()) {
          openAuthPopup();
        } else {
          console.log("The chosen city is:", city);
        }
      });

      fragment.appendChild(cityBtn);
    });

    cityContainer.appendChild(fragment);
  }

  loadCities();

  // ==========================================
  // 6. SMOOTH SCROLL (.read -> #read)
  // ==========================================
  document.querySelector(".read")?.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById("read");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});