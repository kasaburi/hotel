
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");

overlay.innerHTML = `
  <a href="./index.html">Home</a>
  <a href="./rooms.html">Rooms</a>
  <a href="./hotel.html">Hotels</a>
  <a href="./bookedrooms.html">Booked Rooms</a>
`;

document.body.appendChild(overlay);

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.style.display = "none";
    overlay.classList.add("active");
  });
}

overlay.addEventListener("click", () => {
  overlay.classList.remove("active");

  if (hamburger) {
    hamburger.style.display = "block";
  }
});


// =========================================================
// ELEMENTS
// =========================================================

const citiesContainer = document.querySelector("#city");
const container = document.getElementById("container");
const statusDiv = document.getElementById("status");


// =========================================================
// API
// =========================================================

const HOTELS_API =
  "https://hotel-backend-qeue.onrender.com/api/hotels";

const BOOKINGS_API =
  "https://hotel-backend-qeue.onrender.com/api/Booking";


// =========================================================
// AUTHORIZATION
// =========================================================

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(
      "JWT token ვერ მოიძებნა localStorage-ში."
    );
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}


// =========================================================
// GENERIC FETCH
// =========================================================

async function fetchData(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to load data: ${res.status}`
    );
  }

  return res.json();
}


// =========================================================
// FETCH BOOKINGS WITH JWT
// =========================================================

async function fetchBookings() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "თქვენ ავტორიზებული არ ხართ. გთხოვთ თავიდან გაიაროთ Login."
    );
  }

  const res = await fetch(BOOKINGS_API, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    throw new Error(
      "ავტორიზაცია ვერ გაიარა. JWT token არასწორია ან ვადა გაუვიდა."
    );
  }

  if (!res.ok) {
    throw new Error(
      `Failed to load bookings: ${res.status}`
    );
  }

  return res.json();
}


// =========================================================
// FORMAT PRICE
// =========================================================

function formatPrice(price) {
  if (price == null || price === "") {
    return "-";
  }

  const n = Number(price);

  return isNaN(n)
    ? price
    : n + "€ ";
}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(dateStr) {
  if (!dateStr) {
    return "-";
  }

  const d = new Date(dateStr);

  if (isNaN(d)) {
    return "-";
  }

  return d.toLocaleDateString("ka-GE");
}


// =========================================================
// HOTEL CELL
// =========================================================

function renderHotelCell(hotel) {
  if (!hotel) {
    return "-";
  }

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
        src="${
          hotel.featuredImage ??
          "https://via.placeholder.com/80x60?text=No+Image"
        }"
        class="img"
        alt="${hotel.name ?? "-"}"
        style="
          width:100px;
          height:60px;
          object-fit:cover;
          border-radius:6px;
        "
      >

      <div class="hotelbox">

        <strong class="hotelname">
          ${hotel.name ?? "-"}
        </strong>

        <br>

        <small class="hotelcity">
          ${hotel.city ?? "-"}
        </small>

      </div>

    </div>
  `;
}


// =========================================================
// ROOM CELL
// =========================================================

function renderRoomCell(room) {
  if (!room) {
    return "-";
  }

  const roomImage =
    room.image ??
    "https://via.placeholder.com/80x60?text=No+Image";

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
        src="${roomImage}"
        alt="${room.name ?? "-"}"
        class="imgroom"
        style="
          width:80px;
          height:60px;
          object-fit:cover;
          border-radius:6px;
        "
      >

      <div class="roombox">

        <strong class="roomname">
          ${room.name ?? "-"}
        </strong>

        <br>

        <small class="roomprice">
          ${formatPrice(
            room.pricePerNight ??
            room.price
          )}
        </small>

      </div>

    </div>
  `;
}


// =========================================================
// LOAD CITIES
// =========================================================

async function loadCities() {
  try {

    const cities = await fetchData(
      `${HOTELS_API}/GetCities`
    );

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
      .querySelectorAll(".city-item")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          function () {

            const selectedCity =
              this.getAttribute(
                "data-city"
              );

            document
              .querySelectorAll(".city-item")
              .forEach(el =>
                el.classList.remove(
                  "active"
                )
              );

            this.classList.add("active");

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
// CONFIRM DELETE POPUP
// =========================================================

function showConfirmPopup(
  message,
  subMessage,
  bookingId,
  callback
) {

  const existingPopup =
    document.getElementById(
      "confirm-popup"
    );

  if (existingPopup) {
    existingPopup.remove();
  }


  const popupOverlay =
    document.createElement("div");

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
            class="popup-btn confirm"
          >
            დადასტურება
          </button>

          <button
            class="popup-btn cancel"
          >
            გაუქმება
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
        გასვლა
      </p>

    </div>
  `;


  document.body.appendChild(
    popupOverlay
  );


  const contentEl =
    popupOverlay.querySelector(
      ".popup-content"
    );

  const resultEl =
    popupOverlay.querySelector(
      ".popup-result"
    );


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
    () => popupOverlay.remove()
  );


  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  popupOverlay
    .querySelector(".confirm")
    .addEventListener(
      "click",
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            showResult(
              "გთხოვთ თავიდან გაიაროთ Login.",
              "red"
            );

            return;
          }


          const res =
            await fetch(
              `${BOOKINGS_API}/${bookingId}`,
              {
                method: "DELETE",

                headers: {
                  "Content-Type":
                    "application/json",

                  "Authorization":
                    `Bearer ${token}`
                }
              }
            );


          if (res.status === 401) {

            showResult(
              "ავტორიზაცია ვერ გაიარა.",
              "red"
            );

            return;
          }


          if (!res.ok) {

            throw new Error(
              `The request could not be fulfilled: ${res.status}`
            );
          }


          showResult(
            `ჯავშანი გაუქმდა. Booking ID: ${bookingId}`,
            "green"
          );


          callback &&
            callback(true);


        } catch (error) {

          console.error(
            "Error deleting booking:",
            error
          );


          showResult(
            "ჯავშნის წაშლის შეცდომა: " +
              error.message,
            "red"
          );
        }

      }
    );


  // =======================================================
  // CANCEL BUTTON
  // =======================================================

  popupOverlay
    .querySelector(".cancel")
    .addEventListener(
      "click",
      () => {

        showResult(
          "ჯავშანი არ გაუქმებულა.",
          "orange"
        );

        callback &&
          callback(false);

      }
    );
}


// =========================================================
// CANCEL BOOKING
// =========================================================

function cancelBooking(bookingId) {

  if (!bookingId) {

    alert(
      "Booking ID მითითებული არ არის."
    );

    return;
  }


  showConfirmPopup(

    "ნამდვილად გსურთ ჯავშნის გაუქმება?",

    `Booking ID: ${bookingId}`,

    bookingId,

    confirmed => {

      if (confirmed) {

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

    }
  );
}


// =========================================================
// LOAD BOOKINGS
// =========================================================

async function loadBookings(
  filterCity = null
) {

  try {

    statusDiv.textContent =
      "Loading...";


    // =====================================================
    // მხოლოდ BOOKINGS API
    // =====================================================

    const bookings =
      await fetchBookings();


    // =====================================================
    // TABLE
    // =====================================================

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


    let hasData = false;


    // =====================================================
    // BOOKINGS LOOP
    // =====================================================

    for (
      const booking of bookings
    ) {

      // ===================================================
      // HOTEL DATA
      // ===================================================

      const hotel = {

        id:
          booking.hotelId,

        name:
          booking.hotelName ??
          booking.hotelNameEn ??
          booking.hotelNameKa ??
          "-",

        city:
          booking.city ??
          "-",

        featuredImage:
          booking.hotelImage ??
          null

      };


      // ===================================================
      // ROOM DATA
      // ===================================================

    const room = {
  id:
    booking.roomID ??
    booking.roomId,

  name:
    booking.roomName ??
    booking.roomNameEn ??
    booking.roomNameKa ??
    "-",

  pricePerNight:
    booking.roomPricePerNight ??
    null,

  image:
    booking.roomImages?.[0] ??
    null
};


      // ===================================================
      // CITY FILTER
      // ===================================================

      if (
        filterCity &&
        booking.city !== filterCity
      ) {
        continue;
      }


      hasData = true;


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

            ${
              booking.customerName ??
              "უცნობი"
            }

          </td>


          <td>

            <div class="booked">

              ${
                booking.isConfirmed
                  ? "Booked"
                  : "Pending"
              }

            </div>

          </td>


          <td>

            ${
              formatDate(
                booking.checkInDate ??
                booking.checkIn
              )
            }

          </td>


          <td>

            ${
              formatDate(
                booking.checkOutDate ??
                booking.checkOut
              )
            }

          </td>


          <td>

            ${
              formatPrice(
                booking.totalPrice
              )
            }

          </td>


          <td style="text-align:center;">

            <button
              onclick="cancelBooking(${booking.id})"
              class="cancel"
            >
              Cancel
            </button>

          </td>

        </tr>

      `;
    }


    // =====================================================
    // NO DATA
    // =====================================================

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


    // =====================================================
    // CLOSE TABLE
    // =====================================================

    tableHTML += `

          </tbody>

        </table>

      </div>

    `;


    container.innerHTML =
      tableHTML;


    statusDiv.textContent = "";


  } catch (error) {

    console.error(
      "Error loading bookings:",
      error
    );


    statusDiv.textContent =
      "Error: " +
      error.message;


    container.innerHTML = "";
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