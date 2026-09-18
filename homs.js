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







let section = document.getElementById("section");

function getAll() {
  fetch("https://hotel-backend-qeue.onrender.com/api/Rooms/GetAll")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (!section) return; 

      let sortedRooms = data.sort((a, b) => (b.reservationCount || 0) - (a.reservationCount || 0));
      let top6Rooms = sortedRooms.slice(0, 6);

      section.innerHTML = "";

      top6Rooms.forEach(item => {
        section.innerHTML += cardPrint(item);
      });

      const cards = section.querySelectorAll(".card");
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
    })
    .catch(error => {
      console.error("Error fetching rooms:", error);
      if (section) section.innerHTML = "<p>Loading failed.</p>";
    });
}

function cardPrint(room) {
  let firstImage = room.images[0]?.source || "https://via.placeholder.com/300";
  return `
    <div class="card">
      <img src="${firstImage}" class="img" alt="${room.name}">
      <div class="cardbody">
        <h5 class="name">${room.name}</h5>
        <p class="text">&euro;${room.pricePerNight} <span class="night">a night</span></p>
      </div>
      <button class="button" style="display: none; margin-bottom: 10px;">
        <a href="./booknow.html?roomId=${room.id}" class="book">Book Now</a>
      </button>
    </div>
  `;
}






















document.addEventListener("DOMContentLoaded", () => {
  const cityContainer = document.getElementById("city");

  if (cityContainer) {
    fetch("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities")
      .then(response => {
        if (!response.ok) {
          throw new Error("Unable to load cities.");
        }
        return response.json();
      })
      .then(cities => {
        cityContainer.innerHTML = "";

        cities.forEach(city => {
          const cityBtn = document.createElement("button");
          cityBtn.textContent = city;
          cityBtn.classList.add("city-btn");

          cityBtn.addEventListener("click", () => {
            const token = localStorage.getItem("userToken");
            if (!token) {
              openAuthPopup();
            } else {
              console.log("The chosen city is:", city);
         
            }
          });

          cityContainer.appendChild(cityBtn);
        });
      })
      .catch(error => {
        console.error("error:", error);
        cityContainer.innerHTML = "<p style='color:red;'>Unable to load cities.</p>";
      });
  }
});

document.querySelector(".read")?.addEventListener("click", function (e) {
  e.preventDefault();
  const target = document.getElementById("read");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
});


getAll();






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