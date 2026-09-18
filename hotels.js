const hamburger =
  document.getElementById("hamburger");

const navLinks =
  document.getElementById("navLinks");

const overlay =
  document.createElement("div");

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


// ==========================================
// HAMBURGER OPEN
// ==========================================

if (hamburger) {

  hamburger.addEventListener("click", () => {

    hamburger.style.display = "none";

    overlay.classList.add("active");

  });

}


// ==========================================
// MOBILE LOGIN
// ==========================================

const mobileLogin =
  document.getElementById("mobileLogin");

const desktopLogin =
  document.getElementById("btnLoginRegister");

const authPopup =
  document.getElementById("authPopup");

const btnClose =
  document.getElementById("btnClose");


// Login popup-ის გახსნის ფუნქცია
function openAuthPopup() {

  if (authPopup) {

    authPopup.classList.add("active");

  }

}


// Desktop Login
if (desktopLogin) {

  desktopLogin.addEventListener(
    "click",
    openAuthPopup
  );

}


// Mobile Login
if (mobileLogin) {

  mobileLogin.addEventListener(
    "click",
    () => {

      // hamburger მენიუს დახურვა
      overlay.classList.remove("active");

      if (hamburger) {
        hamburger.style.display = "block";
      }

      // Login popup-ის გახსნა
      openAuthPopup();

    }
  );

}


// ==========================================
// POPUP CLOSE
// ==========================================

if (btnClose) {

  btnClose.addEventListener(
    "click",
    () => {

      authPopup.classList.remove("active");

    }
  );

}









let citiesContainer = document.querySelector(".sity");
let container = document.getElementById('hotels');


async function fetchData(url) {
  let response = await fetch(url);
  if (!response.ok) throw new Error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
  return await response.json();
}







async function fetchHotelsByCity(city) {
  const response = await fetch(
    `https://hotel-backend-qeue.onrender.com/api/hotels`
  );

  if (!response.ok) {
    throw new Error(`სასტუმროები ვერ ჩაიტვირთა ${city}-თვის`);
  }

  const hotels = await response.json();

  // ქალაქის მიხედვით გაფილტვრა
  return hotels.filter(
    hotel => hotel.city.toLowerCase() === city.toLowerCase()
  );
}








function renderHotels(hotels) {
  container.innerHTML = "";
  hotels.forEach(hotel => {
    const hotelDiv = document.createElement('div');
    hotelDiv.className = 'hotel-card';
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




async function loadHotelsByCity(city) {
  try {
    const hotels = await fetchHotelsByCity(city.trim());
    renderHotels(hotels);
  } catch (error) {
    container.innerHTML = `<p style="color:red;">შეცდომა: ${error.message}</p>`;
  }
}


async function loadAllHotelsByCities() {
  try {
    container.innerHTML = "";
    const cities = await fetchData("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities");

    for (const city of cities) {
      const hotels = await fetchHotelsByCity(city.trim());
      renderHotels(hotels);
    }

  } catch (error) {
    container.innerHTML = `<p style="color:red;">შეცდომა: ${error.message}</p>`;
  }
}

async function loadCities() {
  try {
    const cities = await fetchData("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities");

    citiesContainer.innerHTML = `
      <div class="inbox">
        <div class="data-city" data-city="all">All</div>
        ${cities.map(city => `<div class="city-item" data-city="${city}">${city}</div>`).join("")}
      </div>
    `;

    document.querySelectorAll('.city-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const selectedCity = this.getAttribute('data-city');

        document.querySelectorAll('.city-item').forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        if (selectedCity === 'all') {
          loadAllHotelsByCities();
        } else {
          loadHotelsByCity(selectedCity);
        }
      });

      
    });

  } catch (error) {
    citiesContainer.innerHTML = `<p style="color:red;">ქალაქები ვერ ჩაიტვირთა: ${error.message}</p>`;
  }
}


function applyHoverEventsIfNeeded() {
  const cards = document.querySelectorAll(".hotel-card");

  if (window.innerWidth > 768) {
    cards.forEach(card => {
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
  const buttons = document.querySelectorAll('.button');
  if (window.innerWidth <= 768) {
    buttons.forEach(button => button.style.display = 'inline-block');
  } else {
    buttons.forEach(button => button.style.display = 'none');
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!citiesContainer || !container) {
    console.error("აუცილებელი ელემენტები ვერ მოიძებნა");
    return;
  }

  citiesContainer.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains('city-item')) {
      e.target.style.backgroundColor = '#c5c4c43a';
    }
  });

  citiesContainer.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('city-item')) {
      e.target.style.backgroundColor = 'transparent';
    }
  });

  loadCities();
  loadAllHotelsByCities();


  window.addEventListener('resize', () => {
    updateButtonVisibility();
    applyHoverEventsIfNeeded();
  });
});



const params = new URLSearchParams(window.location.search);
const hotelId = params.get("hotelId");




fetch(`https://hotel-backend-qeue.onrender.com/api/hotels/${hotelId}`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.error("შეცდომა:", err));



























  document.addEventListener("DOMContentLoaded", () => {

    const btnLoginRegister =
        document.getElementById("btnLoginRegister");

    const popup =
        document.getElementById("authPopup");

    const authContent =
        document.getElementById("authContent");

    const btnClose =
        document.getElementById("btnClose");


    // ==========================================
    // CHECK ELEMENTS
    // ==========================================

    if (!popup || !authContent || !btnClose) {

        console.error(
            "❌ Required elements for login popup not found"
        );

        return;
    }


    // ==========================================
    // POPUP CONTENT
    // ==========================================

    const popupContent =
        document.querySelector(".auth-popup-content");


    // ==========================================
    // OPEN LOGIN / REGISTER POPUP
    // ==========================================

    function openAuthPopup() {

        popup.style.display = "flex";


        // საწყის მდგომარეობაზე დაბრუნება

        popupContent.classList.remove(
            "registration-popup",
            "authorization-popup"
        );


        // ======================================
        // POPUP BUTTONS
        // ======================================

        authContent.innerHTML = `

            <div class="auth-choice">

                <div class="go">
                    Login

                    <img
                        src="./image/login.svg"
                        class="login"
                        alt="Login"
                    >
                </div>


                <button
                    type="button"
                    id="popupLogin"
                    class="auth-choice-btn">

                    Authorization

                </button>


                <button
                    type="button"
                    id="popupRegister"
                    class="auth-choice-btn">

                    Registration

                </button>

            </div>

        `;


        // ======================================
        // AUTHORIZATION BUTTON
        // ======================================

        const popupLogin =
            document.getElementById("popupLogin");


        if (popupLogin) {

            popupLogin.addEventListener("click", () => {

                // popup-ის დახურვა
                closePopup();

                // Authorization გვერდზე გადასვლა
                window.location.href =
                    "./singin.html";

            });

        }


        // ======================================
        // REGISTRATION BUTTON
        // ======================================

        const popupRegister =
            document.getElementById("popupRegister");


        if (popupRegister) {

            popupRegister.addEventListener("click", () => {

                // popup-ის დახურვა
                closePopup();

                // Registration გვერდზე გადასვლა
                window.location.href =
                    "./registre.html";

            });

        }

    }


    // ==========================================
    // LOGIN / LOGOUT BUTTON
    // ==========================================

    function updateAuthButton() {

        const token =
            localStorage.getItem("token");


        // ======================================
        // USER IS LOGGED IN
        // ======================================

        if (token) {

            if (btnLoginRegister) {

                btnLoginRegister.innerHTML = `

                    Log Out

                    <img
                        src="./image/login.svg"
                        class="login"
                        alt="Log Out"
                    >

                `;


                // ძველი click event-ის თავიდან აცილება

                btnLoginRegister.onclick = null;


                btnLoginRegister.onclick = () => {

                    logout();

                };

            }

        }


        // ======================================
        // USER IS NOT LOGGED IN
        // ======================================

        else {

            if (btnLoginRegister) {

                btnLoginRegister.innerHTML = `

                    Login

                    <img
                        src="./image/login.svg"
                        class="login"
                        alt="Login"
                    >

                `;


                btnLoginRegister.onclick = () => {

                    openAuthPopup();

                };

            }

        }

    }


    // ==========================================
    // LOG OUT
    // ==========================================

    function logout() {

        // JWT token-ის წაშლა
        localStorage.removeItem("token");

        // User ID-ის წაშლა
        localStorage.removeItem("userId");

        // User Email-ის წაშლა
        localStorage.removeItem("userEmail");


        console.log(
            "✅ User successfully logged out"
        );


        // ღილაკის დაბრუნება Login-ზე
        updateAuthButton();


        // მთავარ გვერდზე დაბრუნება
        window.location.href =
            "./index.html";

    }


    // ==========================================
    // DESKTOP LOGIN / LOGOUT BUTTON
    // ==========================================

    updateAuthButton();


    // ==========================================
    // MOBILE LOGIN / LOGOUT BUTTON
    // ==========================================

    document.addEventListener("click", (event) => {

        const mobileButton =
            event.target.closest("#mobileLogin");


        if (!mobileButton) {
            return;
        }


        const token =
            localStorage.getItem("token");


        // ======================================
        // MOBILE LOG OUT
        // ======================================

        if (token) {

            logout();

            return;

        }


        // ======================================
        // MOBILE LOGIN
        // ======================================

        openAuthPopup();

    });


    // ==========================================
    // CLOSE BUTTON
    // ==========================================

    btnClose.addEventListener("click", () => {

        closePopup();

    });


    // ==========================================
    // CLOSE FUNCTION
    // ==========================================

    function closePopup() {

        popup.style.display = "none";

        authContent.innerHTML = "";


        popupContent.classList.remove(
            "registration-popup",
            "authorization-popup"
        );

    }


    // ==========================================
    // CLICK OUTSIDE POPUP
    // ==========================================

    popup.addEventListener("click", (event) => {

        if (event.target === popup) {

            closePopup();

        }

    });


    // ==========================================
    // ESC KEY
    // ==========================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closePopup();

        }

    });

});