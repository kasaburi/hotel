// =========================================================
// NAVIGATION / HAMBURGER
// =========================================================

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
    <img src="./image/login.svg" class="login" alt="Login">
  </button>
`;

document.body.appendChild(overlay);


// =========================================================
// AUTH ELEMENTS
// =========================================================

const btnLoginRegister =
  document.getElementById("btnLoginRegister");

const authPopup =
  document.getElementById("authPopup");

const authContent =
  document.getElementById("authContent");

const btnClose =
  document.getElementById("btnClose");


// =========================================================
// HAMBURGER OPEN
// =========================================================

if (hamburger) {

  hamburger.addEventListener("click", () => {

    hamburger.style.display = "none";

    overlay.classList.add("active");

  });

}


// =========================================================
// TOKEN
// =========================================================

function getToken() {

  return localStorage.getItem("token");

}


// =========================================================
// AUTH POPUP OPEN
// =========================================================

function openAuthPopup() {

  if (!authPopup || !authContent) {

    console.error(
      "❌ Auth popup ვერ მოიძებნა"
    );

    return;

  }


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
        class="auth-choice-btn"
      >
        Authorization
      </button>


      <button
        type="button"
        id="popupRegister"
        class="auth-choice-btn"
      >
        Registration
      </button>

    </div>

  `;


  authPopup.style.display = "flex";


  // ==========================================
  // AUTHORIZATION
  // ==========================================

  const popupLogin =
    document.getElementById("popupLogin");

  if (popupLogin) {

    popupLogin.addEventListener(
      "click",
      () => {

        window.location.href =
          "./singin.html";

      }
    );

  }


  // ==========================================
  // REGISTRATION
  // ==========================================

  const popupRegister =
    document.getElementById("popupRegister");

  if (popupRegister) {

    popupRegister.addEventListener(
      "click",
      () => {

        window.location.href =
          "./registre.html";

      }
    );

  }

}


// =========================================================
// CLOSE AUTH POPUP
// =========================================================

function closeAuthPopup() {

  if (!authPopup) {
    return;
  }


  authPopup.style.display = "none";


  if (authContent) {

    authContent.innerHTML = "";

  }

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

  console.log(
    "🚪 Logging out..."
  );


  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");


  console.log(
    "✅ Logout successful"
  );


  window.location.href =
    "./index.html";

}


// =========================================================
// UPDATE DESKTOP LOGIN BUTTON
// =========================================================

function updateAuthButton() {

  if (!btnLoginRegister) {
    return;
  }


  const token =
    getToken();


  console.log(
    "🔐 Token:",
    token
  );


  // ==========================================
  // LOGGED IN
  // ==========================================

  if (token) {

    btnLoginRegister.innerHTML = `

      Log Out

      <img
        src="./image/login.svg"
        class="login"
        alt="Log Out"
      >

    `;


    btnLoginRegister.onclick = () => {

      logout();

    };


    console.log(
      "✅ Log Out ღილაკი ჩაიტვირთა"
    );

  }


  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  else {

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


    console.log(
      "🔐 Login ღილაკი ჩაიტვირთა"
    );

  }

}


// =========================================================
// MOBILE LOGIN / LOGOUT
// =========================================================

document.addEventListener(
  "click",
  (event) => {

    const mobileButton =
      event.target.closest(
        "#mobileLogin"
      );


    if (!mobileButton) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    const token =
      getToken();


    // ==========================================
    // MOBILE LOGOUT
    // ==========================================

    if (token) {

      logout();

      return;

    }


    // ==========================================
    // MOBILE LOGIN
    // ==========================================

    overlay.classList.remove(
      "active"
    );


    if (hamburger) {

      hamburger.style.display =
        "block";

    }


    openAuthPopup();

  }
);


// =========================================================
// CLOSE POPUP BUTTON
// =========================================================

if (btnClose) {

  btnClose.addEventListener(
    "click",
    closeAuthPopup
  );

}


// =========================================================
// CLOSE POPUP OUTSIDE
// =========================================================

if (authPopup) {

  authPopup.addEventListener(
    "click",
    (event) => {

      if (
        event.target === authPopup
      ) {

        closeAuthPopup();

      }

    }
  );

}


// =========================================================
// ESC
// =========================================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeAuthPopup();

    }

  }
);


// =========================================================
// CLOSE MOBILE OVERLAY
// =========================================================

overlay.addEventListener(
  "click",
  (event) => {

    if (
      event.target.closest(
        "#mobileLogin"
      )
    ) {

      return;

    }


    overlay.classList.remove(
      "active"
    );


    if (hamburger) {

      hamburger.style.display =
        "block";

    }

  }
);


// =========================================================
// INITIAL AUTH STATE
// =========================================================

updateAuthButton();
























// =========================================================
// ELEMENTS
// =========================================================

const citiesContainer =
  document.getElementById("city");

const container =
  document.getElementById("container");

const statusDiv =
  document.getElementById("status");


// =========================================================
// API
// =========================================================

const API_BASE =
  "https://hotel-backend-qeue.onrender.com";

const HOTELS_API =
  `${API_BASE}/api/hotels`;

const BOOKINGS_API =
  `${API_BASE}/api/Booking`;


// =========================================================
// PLACEHOLDERS
// =========================================================

const HOTEL_PLACEHOLDER =
  "https://via.placeholder.com/100x60?text=No+Hotel+Image";

const ROOM_PLACEHOLDER =
  "https://via.placeholder.com/80x60?text=No+Room+Image";




// =========================================================
// FETCH DATA
// =========================================================

async function fetchData(
  url,
  options = {}
) {

  const response =
    await fetch(
      url,
      options
    );

  if (!response.ok) {

    let message =
      `Failed to load data: ${response.status}`;

    try {

      const errorData =
        await response.json();

      if (errorData?.detail) {

        if (
          Array.isArray(
            errorData.detail
          )
        ) {

          message =
            errorData.detail
              .map(
                item =>
                  item.msg ||
                  "Error"
              )
              .join(", ");

        } else {

          message =
            errorData.detail;

        }

      }

    } catch {
      // no JSON response
    }

    throw new Error(message);

  }

  return response.json();

}


// =========================================================
// FETCH BOOKINGS
// =========================================================
// =========================================================
// FETCH BOOKINGS
// =========================================================
async function fetchBookings() {

  const token = getToken();

  if (!token) {

    throw new Error(
      "You are not authorized. Please log in again."
    );

  }

  const response = await fetch(
    BOOKINGS_API,
    {
      method: "GET",

      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );


  if (response.status === 401) {

    localStorage.removeItem("token");

    throw new Error(
      "Authorization failed. Please log in again."
    );

  }


  if (!response.ok) {

    throw new Error(
      `Failed to load bookings: ${response.status}`
    );

  }


  const data = await response.json();

  console.log(
    "Bookings API response:",
    data
  );


  if (Array.isArray(data)) {
    return data;
  }


  if (Array.isArray(data.bookings)) {
    return data.bookings;
  }


  return [];

}









// =========================================================
// FORMAT PRICE
// =========================================================

function formatPrice(price) {

  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {

    return "-";

  }


  const number =
    Number(price);


  if (
    Number.isNaN(number)
  ) {

    return String(price);

  }


  return `${number} ₾`;

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(dateStr) {

  if (!dateStr) {

    return "-";

  }


  const dateOnly =
    String(dateStr)
      .split("T")[0];


  const parts =
    dateOnly.split("-");


  if (
    parts.length === 3
  ) {

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);


    if (
      !Number.isNaN(year) &&
      !Number.isNaN(month) &&
      !Number.isNaN(day)
    ) {

      const date =
        new Date(
          year,
          month - 1,
          day
        );


      return date.toLocaleDateString(
        "ka-GE"
      );

    }

  }


  return "-";

}


// =========================================================
// IMAGE URL
// =========================================================

function getImageUrl(image) {

  if (!image) {

    return null;

  }


  if (
    typeof image === "string"
  ) {

    return (
      image.trim() ||
      null
    );

  }


  if (
    typeof image === "object"
  ) {

    return (
      image.source ??
      image.url ??
      image.imageUrl ??
      null
    );

  }


  return null;

}


// =========================================================
// RENDER HOTEL
// =========================================================

function renderHotelCell(hotel) {

  if (!hotel) {

    return "-";

  }


  const image =
    hotel.featuredImage ??
    HOTEL_PLACEHOLDER;


  const hotelName =
    hotel.name ??
    "-";


  const city =
    hotel.city ??
    "-";


  return `
    <div
      class="hotell"
      style="
        display:flex;
        align-items:center;
        gap:10px;
        max-width:300px;
      "
    >

      <img
        src="${image}"
        class="img"
        alt="${hotelName}"
        style="
          width:100px;
          height:60px;
          object-fit:cover;
          border-radius:6px;
        "
        onerror="
          this.onerror=null;
          this.src='${HOTEL_PLACEHOLDER}';
        "
      >

      <div class="hotelbox">

        <strong class="hotelname">
          ${hotelName}
        </strong>

        <br>

        <small class="hotelcity">
          ${city}
        </small>

      </div>

    </div>
  `;

}


// =========================================================
// RENDER ROOM
// =========================================================

function renderRoomCell(room) {

  if (!room) {

    return "-";

  }


  const image =
    room.image ??
    ROOM_PLACEHOLDER;


  const roomName =
    room.name ??
    "-";


  const price =
    room.pricePerNight;


  return `
    <div
      class="roomstyle"
      style="
        display:flex;
        align-items:center;
        gap:10px;
        max-width:300px;
      "
    >

      <img
        src="${image}"
        alt="${roomName}"
        class="imgroom"
        style="
          width:80px;
          height:60px;
          object-fit:cover;
          border-radius:6px;
        "
        onerror="
          this.onerror=null;
          this.src='${ROOM_PLACEHOLDER}';
        "
      >

      <div class="roombox">

        <strong class="roomname">
          ${roomName}
        </strong>

        <br>

        <small class="roomprice">
          ${formatPrice(price)}
          / night
        </small>

      </div>

    </div>
  `;

}


// =========================================================
// CREATE HOTEL OBJECT
// =========================================================

function createHotelFromBooking(
  booking
) {

  const hotelImage =
    getImageUrl(
      booking.hotelImages?.[0]
    ) ??
    booking.hotelImage ??
    booking.featuredImage ??
    null;


  return {

    id:
      booking.hotelId ??
      booking.hotelID ??
      booking.hotel?.id ??
      null,

    name:
      booking.hotelName ??
      booking.hotelNameEn ??
      booking.hotelNameKa ??
      booking.hotel?.name ??
      "-",

    city:
      booking.city ??
      booking.hotelCity ??
      booking.hotel?.city ??
      "-",

    featuredImage:
      hotelImage

  };

}


// =========================================================
// CREATE ROOM OBJECT
// =========================================================

function createRoomFromBooking(
  booking
) {

  let roomImage =
    null;


  if (
    Array.isArray(
      booking.roomImages
    ) &&
    booking.roomImages.length > 0
  ) {

    roomImage =
      getImageUrl(
        booking.roomImages[0]
      );

  }


  roomImage =
    roomImage ??
    booking.roomImage ??
    null;


  return {

    id:
      booking.roomID ??
      booking.roomId ??
      booking.room?.id ??
      null,

    name:
      booking.roomName ??
      booking.roomNameEn ??
      booking.roomNameKa ??
      booking.room?.name ??
      "-",

    pricePerNight:
      booking.roomPricePerNight ??
      booking.pricePerNight ??
      booking.room?.pricePerNight ??
      booking.room?.price_per_night ??
      null,

    image:
      roomImage

  };

}


// =========================================================
// GET BOOKING STATUS
// =========================================================

function getBookingStatus(
  booking
) {

  const isConfirmed =
    booking.isConfirmed ??
    booking.is_confirmed;


  const status =
    booking.status;


  if (
    status &&
    String(status).trim() !== ""
  ) {

    const normalized =
      String(status)
        .toLowerCase();


    if (
      normalized === "confirmed" ||
      normalized === "booked"
    ) {

      return "Booked";

    }


    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {

      return "Cancelled";

    }


    if (
      normalized === "pending"
    ) {

      return "Pending";

    }

  }


  return isConfirmed
    ? "Booked"
    : "Pending";

}

function showConfirmPopup(
  message,
  subMessage,
  bookingId,
  callback
) {

  // =======================================================
  // REMOVE EXISTING POPUP
  // =======================================================

  const existingPopup =
    document.getElementById(
      "confirm-popup"
    );

  if (existingPopup) {
    existingPopup.remove();
  }


  // =======================================================
  // CREATE POPUP
  // =======================================================

  const popupOverlay =
    document.createElement(
      "div"
    );

  popupOverlay.id =
    "confirm-popup";

  popupOverlay.className =
    "popup-overlay";


  popupOverlay.innerHTML = `

    <div class="popup-box">

      <div class="popup-content">

        <p class="popup-message">
          ${message}
        </p>

        <p class="popup-sub">
          ${subMessage}
        </p>

        <div class="popup-buttons">

          <button
            type="button"
            class="popup-btn confirm"
          >
            Confirm
          </button>

          <button
            type="button"
            class="popup-btn cancel"
          >
            Cancel
          </button>

        </div>

      </div>

      <p
        class="popup-result"
        style="
          margin-top:10px;
          font-weight:bold;
          cursor:pointer;
          display:none;
        "
      >
        Exit
      </p>

    </div>

  `;


  document.body.appendChild(
    popupOverlay
  );


  // =======================================================
  // ELEMENTS
  // =======================================================

  const contentEl =
    popupOverlay.querySelector(
      ".popup-content"
    );


  const resultEl =
    popupOverlay.querySelector(
      ".popup-result"
    );


  const confirmButton =
    popupOverlay.querySelector(
      ".confirm"
    );


  const cancelButton =
    popupOverlay.querySelector(
      ".cancel"
    );


  // =======================================================
  // SHOW RESULT
  // =======================================================

  function showResult(
    text,
    color
  ) {

    contentEl.style.display =
      "none";

    resultEl.textContent =
      text;

    resultEl.style.color =
      color;

    resultEl.style.display =
      "block";
  }


  // =======================================================
  // CLOSE RESULT
  // =======================================================

  resultEl.addEventListener(
    "click",
    () => {

      popupOverlay.remove();

    }
  );


  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  confirmButton.addEventListener(
    "click",
    async () => {

      console.log(
        "🔥 CONFIRM CLICKED"
      );

      console.log(
        "🆔 BOOKING ID:",
        bookingId
      );


      const token =
        getToken();


      console.log(
        "🔐 TOKEN:",
        token
      );


      if (!token) {

        showResult(
          "Please log in again.",
          "red"
        );

        return;

      }


      const deleteUrl =
        `${BOOKINGS_API}/${bookingId}`;


      console.log(
        "🌐 DELETE URL:",
        deleteUrl
      );


      confirmButton.disabled =
        true;

      cancelButton.disabled =
        true;

      confirmButton.textContent =
        "In progress...";


      try {

        console.log(
          "🚀 SENDING DELETE REQUEST..."
        );


        const response =
          await fetch(
            deleteUrl,
            {
              method: "DELETE",

              headers: {
                "Authorization":
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json"
              }
            }
          );


        console.log(
          "📡 DELETE STATUS:",
          response.status
        );


        const responseText =
          await response.text();


        console.log(
          "📩 DELETE RESPONSE:",
          responseText
        );


        if (
          response.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          showResult(
            "Authorization failed. Please log in again.",
            "red"
          );

          return;

        }


        if (
          response.status === 403
        ) {

          showResult(
            "You cannot delete this reservation.",
            "red"
          );

          return;

        }


        if (
          response.status === 404
        ) {

          showResult(
            "Booking not found.",
            "red"
          );

          return;

        }


        if (!response.ok) {

          showResult(
            `The reservation could not be deleted. (${response.status})`,
            "red"
          );

          return;

        }


        // =================================================
        // SUCCESS
        // =================================================

        console.log(
          "✅ BOOKING DELETED FROM DATABASE"
        );


        showResult(
          `The reservation has been cancelled. Booking ID: ${bookingId}`,
          "green"
        );


        if (callback) {

          callback(true);

        }

      } catch (error) {

        console.error(
          "❌ DELETE ERROR:",
          error
        );


        showResult(
          "Error deleting reservation: " +
            error.message,
          "red"
        );

      }

    }
  );


  // =======================================================
  // CANCEL POPUP
  // =======================================================

  cancelButton.addEventListener(
    "click",
    () => {

      showResult(
        "The reservation has not been cancelled.",
        "orange"
      );


      if (callback) {

        callback(false);

      }

    }
  );

}


function cancelBooking(
  bookingId
) {

  console.log(
    "🔥 cancelBooking:",
    bookingId
  );


  if (
    bookingId === null ||
    bookingId === undefined ||
    bookingId === ""
  ) {

    alert(
      "Booking ID is not specified."
    );

    return;

  }


  showConfirmPopup(

    "Do you really want to cancel the reservation?",

    `Booking ID: ${bookingId}`,

    bookingId,

    confirmed => {

      if (!confirmed) {
        return;
      }


      const activeCity =
        document
          .querySelector(
            ".city-item.active"
          )
          ?.getAttribute(
            "data-city"
          );


      loadBookings(
        activeCity === "all"
          ? null
          : activeCity
      );

    }

  );

}

// =========================================================
// LOAD CITIES
// =========================================================

async function loadCities() {

  if (!citiesContainer) {

    return;

  }


  try {

    let cities = [];


    try {

      const data =
        await fetchData(
          `${HOTELS_API}/GetCities`
        );


      if (
        Array.isArray(data)
      ) {

        cities = data;

      }

    } catch (error) {

      console.warn(
        "The GetCities endpoint failed to load. We will fetch the cities from Bookings",
        error
      );

    }


    if (
      cities.length === 0
    ) {

      try {

        const bookings =
          await fetchBookings();


        cities =
          [
            ...new Set(
              bookings
                .map(
                  booking =>
                    booking.city ??
                    booking.hotelCity ??
                    booking.hotel?.city
                )
                .filter(Boolean)
            )
          ];


      } catch (error) {

        console.warn(
          "ქალაქების bookings-იდან მიღება ვერ მოხერხდა:",
          error
        );

      }

    }


    cities =
      cities
        .map(
          city =>
            String(city).trim()
        )
        .filter(Boolean)
        .sort();


    citiesContainer.innerHTML = `

      <div class="inbox">

        <div
          class="city-item active"
          data-city="all"
        >
          All
        </div>

        ${cities
          .map(
            city => `
              <div
                class="city-item"
                data-city="${city}"
              >
                ${city}
              </div>
            `
          )
          .join("")}

      </div>

    `;


    document
      .querySelectorAll(
        ".city-item"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          function () {

            const selectedCity =
              this.getAttribute(
                "data-city"
              );


            document
              .querySelectorAll(
                ".city-item"
              )
              .forEach(item => {

                item.classList.remove(
                  "active"
                );

              });


            this.classList.add(
              "active"
            );


            loadBookings(
              selectedCity === "all"
                ? null
                : selectedCity
            );

          }
        );

      });

  } catch (error) {

    console.error(
      "Cities loading error:",
      error
    );

  }

}


// =========================================================
// LOAD BOOKINGS
// =========================================================

async function loadBookings(
  filterCity = null
) {

  if (!container) {

    return;

  }


  try {

    if (statusDiv) {

      statusDiv.textContent =
        "Loading...";

    }


    const bookings =
      await fetchBookings();


    console.log(
      "All bookings:",
      bookings
    );


    let tableHTML = `

      <div class="table-responsive">

        <table>

          <thead>

            <tr>

              <th>Hotel</th>

              <th>Room</th>

              <th class="Customer">
                Customer
              </th>

              <th>Status</th>

              <th>Check in</th>

              <th>Check out</th>

              <th>Total Price</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

    `;


    let hasData =
      false;


    for (
      const booking of bookings
    ) {

      console.log(
        "Current booking:",
        booking
      );


      const hotel =
        createHotelFromBooking(
          booking
        );


      const room =
        createRoomFromBooking(
          booking
        );


      if (filterCity) {

        const bookingCity =
          String(
            booking.city ??
            booking.hotelCity ??
            booking.hotel?.city ??
            ""
          )
            .trim()
            .toLowerCase();


        const selectedCity =
          String(
            filterCity
          )
            .trim()
            .toLowerCase();


        if (
          bookingCity !==
          selectedCity
        ) {

          continue;

        }

      }


      hasData =
        true;


      // ===================================================
      // BOOKING ID
      // ===================================================

      const bookingId =
        booking.id ??
        booking.bookingId ??
        booking.booking_id;


      console.log(
        "🆔 Booking ID:",
        bookingId
      );


      const customerName =
        booking.customerName ??
        booking.customer_name ??
        "Unknown";


      const checkIn =
        booking.checkInDate ??
        booking.check_in_date ??
        booking.checkIn;


      const checkOut =
        booking.checkOutDate ??
        booking.check_out_date ??
        booking.checkOut;


      const totalPrice =
        booking.totalPrice ??
        booking.total_price ??
        null;


      const bookingStatus =
        getBookingStatus(
          booking
        );


      tableHTML += `

        <tr>

          <td class="tdhotel">

            ${renderHotelCell(
              hotel
            )}

          </td>

          <td>

            ${renderRoomCell(
              room
            )}

          </td>

          <td class="ucnobi">

            ${customerName}

          </td>

          <td>

            <div class="booked">

              ${bookingStatus}

            </div>

          </td>

          <td>

            ${formatDate(
              checkIn
            )}

          </td>

          <td>

            ${formatDate(
              checkOut
            )}

          </td>

          <td>

            ${formatPrice(
              totalPrice
            )}

          </td>

          <td
            style="text-align:center;"
          >

            <button
              type="button"
              class="cancel"
              data-booking-id="${bookingId}"
            >
              Cancel
            </button>

          </td>

        </tr>

      `;

    }


    if (!hasData) {

      tableHTML += `

        <tr>

          <td
            colspan="8"
            style="text-align:center;"
          >
            No data found.
          </td>

        </tr>

      `;

    }


    tableHTML += `

          </tbody>

        </table>

      </div>

    `;


    container.innerHTML =
      tableHTML;


    // =====================================================
    // CANCEL BUTTONS
    // =====================================================
const cancelButtons =
  container.querySelectorAll(
    ".cancel"
  );


console.log(
  "🟢 Cancel buttons:",
  cancelButtons.length
);


cancelButtons.forEach(
  button => {

    console.log(
      "🟢 Button booking ID:",
      button.dataset.bookingId
    );


    button.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();


        const bookingId =
          this.dataset.bookingId;


        console.log(
          "🔥 CANCEL CLICKED!"
        );


        console.log(
          "🆔 Booking ID:",
          bookingId
        );


        cancelBooking(
          bookingId
        );

      }
    );

  }
);

    if (statusDiv) {

      statusDiv.textContent =
        "";

    }


  } catch (error) {

    console.error(
      "Error loading bookings:",
      error
    );


    if (statusDiv) {

      statusDiv.textContent =
        "Error: " +
        error.message;

    }


    container.innerHTML = `

      <div
        style="
          text-align:center;
          padding:30px;
          color:#c00;
        "
      >
        ${error.message}
      </div>

    `;

  }

}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadCities();

    loadBookings();

  }
);














