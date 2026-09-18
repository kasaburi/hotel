// =====================================================
// API CONFIG
// =====================================================

const API_BASE =
  "https://hotel-backend-qeue.onrender.com";

const ROOMS_API =
  `${API_BASE}/api/Rooms/GetAll`;

const BOOKINGS_API =
  `${API_BASE}/api/Booking`;


// =====================================================
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


// ==========================================
// OVERLAY CLOSE
// ==========================================

overlay.addEventListener(
  "click",
  (event) => {

    // თუ Login-ს დააჭირა,
    // ზემოთ არსებული mobileLogin ფუნქცია იმუშავებს
    if (event.target.closest("#mobileLogin")) {
      return;
    }

    // მხოლოდ მენიუს დახურვა
    overlay.classList.remove("active");

    if (hamburger) {

      hamburger.style.display = "block";

    }

  }
);


















// =====================================================
// BOOKING PAGE
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const form =
      document.getElementById(
        "registrationForm"
      );


    if (!form) {

      console.error(
        "❌ registrationForm ვერ მოიძებნა"
      );

      return;
    }


    // ===================================================
    // ELEMENTS
    // ===================================================

    const submitBtn =
      form.querySelector(".submit");

    const popup =
      document.getElementById("popup");

    const popupMessage =
      document.getElementById(
        "popup-message"
      );

    const popupClose =
      document.getElementById(
        "popup-close"
      );

    const nameInput =
      document.getElementById(
        "customerName"
      );

    const phoneInput =
      document.getElementById(
        "customerPhone"
      );


    const params =
      new URLSearchParams(
        window.location.search
      );


    const currentRoomId =
      params.get("roomId");


    // ===================================================
    // VARIABLES
    // ===================================================

    let currentRoom = null;

    let currentRoomPrice = 0;

    let flatpickrCheckin = null;

    let flatpickrCheckout = null;


    // ===================================================
    // POPUP
    // ===================================================

    function showPopup(message) {

      if (
        !popup ||
        !popupMessage
      ) {

        console.error(
          "❌ Popup ელემენტები ვერ მოიძებნა"
        );

        return;
      }


      popupMessage.textContent =
        message;

      popup.style.display =
        "flex";
    }


    if (popupClose) {

      popupClose.addEventListener(
        "click",
        () => {

          popup.style.display =
            "none";

        }
      );

    }


    // ===================================================
    // LOCAL STORAGE
    // ===================================================

    const Storage = {

      get(key) {

        try {

          return (
            JSON.parse(
              localStorage.getItem(key)
            ) || []
          );

        } catch {

          return [];

        }

      },


      set(key, value) {

        localStorage.setItem(
          key,
          JSON.stringify(value)
        );

      },


      add(key, value) {

        if (!value) {
          return;
        }


        const list =
          Storage.get(key);


        if (
          !list.includes(value)
        ) {

          list.push(value);

          Storage.set(
            key,
            list
          );

        }

      }

    };


    // ===================================================
    // DROPDOWN HISTORY
    // ===================================================

    const renderers = [];


    function attachDropdown(
      input,
      storageKey
    ) {

      if (!input) {
        return;
      }


      let wrapper =
        input.closest(
          ".date-wrapper"
        );


      if (!wrapper) {

        wrapper =
          input.closest(
            ".popup"
          );

      }


      if (!wrapper) {
        return;
      }


      let history =
        Storage.get(
          storageKey
        );


      const list =
        document.createElement(
          "ul"
        );


      list.classList.add(
        "dropdown-list"
      );


      wrapper.appendChild(
        list
      );


      function render() {

        list.innerHTML = "";


        history.forEach(
          (value, index) => {

         const li =
    document.createElement(
        "li"
    );

li.classList.add("history-item");

li.textContent = value;


           

            const delBtn =
              document.createElement(
                "button"
              );


            delBtn.textContent =
              "✖";


            delBtn.classList.add(
              "delete-btn"
            );


            delBtn.onclick =
              (e) => {

                e.stopPropagation();


                history.splice(
                  index,
                  1
                );


                Storage.set(
                  storageKey,
                  history
                );


                render();

              };


            li.appendChild(
              delBtn
            );


            li.onclick =
              () => {

                input.value =
                  value;

                list.innerHTML =
                  "";

                validateForm();

              };


            list.appendChild(
              li
            );

          }
        );


        list.style.display =
          history.length
            ? "block"
            : "none";

      }


      input.addEventListener(
        "keydown",
        (e) => {

          if (
            e.key === "Enter"
          ) {

            e.preventDefault();


            const value =
              input.value.trim();


            if (
              value &&
              !history.includes(value)
            ) {

              history.push(
                value
              );


              Storage.set(
                storageKey,
                history
              );


              render();

            }

          }

        }
      );


      input.addEventListener(
        "focus",
        render
      );


      document.addEventListener(
        "click",
        (e) => {

          if (
            !e.target.closest(
              ".date-wrapper"
            ) &&
            !e.target.closest(
              ".popup"
            )
          ) {

            list.style.display =
              "none";

          }

        }
      );


      renderers.push(
        render
      );

    }


    function renderAll() {

      renderers.forEach(
        fn => fn()
      );

    }


    attachDropdown(
      document.getElementById(
        "filter-checkin"
      ),
      "checkinHistory"
    );


    attachDropdown(
      document.getElementById(
        "filter-checkout"
      ),
      "checkoutHistory"
    );


    attachDropdown(
      nameInput,
      "nameHistory"
    );


    attachDropdown(
      phoneInput,
      "phoneHistory"
    );


    renderAll();


    // ===================================================
    // FORM VALIDATION
    // ===================================================

    function validateForm() {

      const checkin =
        form.checkin?.value.trim() ||
        "";

      const checkout =
        form.checkout?.value.trim() ||
        "";

      const customerName =
        nameInput?.value.trim() ||
        "";

      const customerPhone =
        phoneInput?.value.trim() ||
        "";


      let valid = true;


      const checkinError =
        document.getElementById(
          "checkin-error"
        );

      const checkoutError =
        document.getElementById(
          "checkout-error"
        );

      const nameError =
        document.getElementById(
          "name-error"
        );

      const phoneError =
        document.getElementById(
          "phone-error"
        );


      // CHECK-IN

      if (!checkin) {

        if (checkinError) {

          checkinError.style.display =
            "block";

        }

        valid = false;

      } else {

        if (checkinError) {

          checkinError.style.display =
            "none";

        }

      }


      // CHECK-OUT

      if (!checkout) {

        if (checkoutError) {

          checkoutError.style.display =
            "block";

        }

        valid = false;

      } else {

        if (checkoutError) {

          checkoutError.style.display =
            "none";

        }

      }


      // NAME

      if (!customerName) {

        if (nameError) {

          nameError.style.display =
            "block";

        }

        valid = false;

      } else {

        if (nameError) {

          nameError.style.display =
            "none";

        }

      }


      // PHONE

      if (
        !/^\d{9}$/.test(
          customerPhone
        )
      ) {

        if (phoneError) {

          phoneError.style.display =
            "block";

        }

        valid = false;

      } else {

        if (phoneError) {

          phoneError.style.display =
            "none";

        }

      }


      if (submitBtn) {

        submitBtn.disabled =
          !valid;

      }


      return valid;

    }


    form.addEventListener(
      "input",
      validateForm
    );


    // ===================================================
    // GET ROOM BY ID
    // ===================================================

    async function fetchRoomById(
      roomId
    ) {

      try {

        const res =
          await fetch(
            ROOMS_API
          );


        if (!res.ok) {

          throw new Error(
            `ოთახების მიღება ვერ მოხერხდა (${res.status})`
          );

        }


        const data =
          await res.json();


        const rooms =
          Array.isArray(data)
            ? data
            : Array.isArray(data.rooms)
              ? data.rooms
              : [];


        const room =
          rooms.find(
            r =>
              Number(r.id) ===
              Number(roomId)
          );


        if (!room) {

          throw new Error(
            `ოთახი ID ${roomId} ვერ მოიძებნა`
          );

        }


        return room;

      } catch (err) {

        console.error(
          "❌ Room loading error:",
          err
        );


        return null;

      }

    }


    // ===================================================
    // GET BOOKED DATES
    // ===================================================

    async function fetchBookedDates(
      roomId
    ) {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          console.warn(
            "JWT token ვერ მოიძებნა."
          );

          return [];

        }


        const res =
          await fetch(
            BOOKINGS_API,
            {
              method: "GET",

              headers: {

                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`

              }

            }
          );


        if (
          res.status === 401
        ) {

          console.error(
            "JWT token არასწორია ან ვადა გაუვიდა."
          );

          return [];

        }


        if (!res.ok) {

          throw new Error(
            `ჯავშნების მიღება ვერ მოხერხდა (${res.status})`
          );

        }


        const responseData =
          await res.json();


        const bookings =
          Array.isArray(
            responseData
          )
            ? responseData
            : Array.isArray(
                responseData.bookings
              )
              ? responseData.bookings
              : [];


        return bookings

          .filter(
            booking => {

              const bookingRoomId =
                booking.roomID ??
                booking.roomId ??
                booking.room_id;


              return (
                Number(
                  bookingRoomId
                ) ===
                Number(roomId)
              );

            }
          )

          .map(
            booking => {

              const checkIn =
                booking.checkInDate ??
                booking.check_in_date;

              const checkOut =
                booking.checkOutDate ??
                booking.check_out_date;


              return {

                from:
                  String(checkIn)
                    .split("T")[0],

                to:
                  String(checkOut)
                    .split("T")[0]

              };

            }
          );

      } catch (err) {

        console.error(
          "❌ Booked dates error:",
          err
        );


        return [];

      }

    }


    // ===================================================
    // FLATPICKR
    // ===================================================

    function initFlatpickr(
      disabledDates
    ) {

      const localeGE = {

        firstDayOfWeek: 1,

        weekdays: {

          shorthand: [
     "Wed",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
          ],

          longhand: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
          ]

        },

        months: {

          shorthand: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
          ],

          longhand: [
         "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
          ]

        }

      };


      function markDisabledDates(
        dateObj
      ) {

        const current =
          new Date(dateObj);


        current.setHours(
          0,
          0,
          0,
          0
        );


        return disabledDates.some(
          d => {

            const from =
              new Date(d.from);

            const to =
              new Date(d.to);


            from.setHours(
              0,
              0,
              0,
              0
            );

            to.setHours(
              0,
              0,
              0,
              0
            );


            return (
              current >= from &&
              current < to
            );

          }
        );

      }


      if (flatpickrCheckin) {

        flatpickrCheckin.destroy();

      }


      if (flatpickrCheckout) {

        flatpickrCheckout.destroy();

      }


      const checkinInput =
        document.getElementById(
          "filter-checkin"
        );


      const checkoutInput =
        document.getElementById(
          "filter-checkout"
        );


      if (
        !checkinInput ||
        !checkoutInput
      ) {

        console.error(
          "❌ Check-in / Check-out input ვერ მოიძებნა"
        );

        return;

      }


      flatpickrCheckin =
        flatpickr(
          checkinInput,
          {

            dateFormat:
              "Y-m-d",

            disableMobile:
              true,

            locale:
              localeGE,

            disable:
              [
                markDisabledDates
              ],

            onChange:
              validateForm,

            onDayCreate:
              function (
                _,
                _2,
                _3,
                dayElem
              ) {

                if (
                  markDisabledDates(
                    dayElem.dateObj
                  )
                ) {

                  dayElem.classList.add(
                    "booked-day"
                  );

                }

              }

          }
        );


      flatpickrCheckout =
        flatpickr(
          checkoutInput,
          {

            dateFormat:
              "Y-m-d",

            disableMobile:
              true,

            locale:
              localeGE,

            disable:
              [
                markDisabledDates
              ],

            onChange:
              validateForm,

            onDayCreate:
              function (
                _,
                _2,
                _3,
                dayElem
              ) {

                if (
                  markDisabledDates(
                    dayElem.dateObj
                  )
                ) {

                  dayElem.classList.add(
                    "booked-day"
                  );

                }

              }

          }
        );

    }


    // ===================================================
    // LOAD CURRENT ROOM
    // ===================================================

    if (currentRoomId) {

      console.log(
        "Current room ID:",
        currentRoomId
      );


      currentRoom =
        await fetchRoomById(
          currentRoomId
        );


      if (!currentRoom) {

        showPopup(
          "❌ ოთახის მონაცემების მიღება ვერ მოხერხდა."
        );

        return;

      }


      console.log(
        "Current room:",
        currentRoom
      );


      currentRoomPrice =
        Number(
          currentRoom.pricePerNight ||
          0
        );


      const bookedDates =
        await fetchBookedDates(
          currentRoomId
        );


      initFlatpickr(
        bookedDates
      );


      const title =
        document.getElementById(
          "registration-title"
        );


      if (title) {

        title.textContent =
          `${currentRoom.name ||
            currentRoom.roomTypeName ||
            "Room"} - €${currentRoomPrice}`;

      }

    } else {

      const title =
        document.getElementById(
          "registration-title"
        );


      if (title) {

        title.textContent =
          "რეგისტრაცია";

      }

    }


    // ===================================================
    // BOOK ROOM
    // ===================================================

    async function bookRoom() {

      if (!validateForm()) {
        return;
      }


      // AUTHENTICATION

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        showPopup(
          "❌ გთხოვთ თავიდან გაიაროთ Login."
        );

        return;

      }


      // ROOM ID

      if (!currentRoomId) {

        showPopup(
          "❌ ოთახის ID ვერ მოიძებნა."
        );

        return;

      }


      // ROOM

      if (!currentRoom) {

        showPopup(
          "❌ ოთახის ინფორმაცია ვერ მოიძებნა."
        );

        return;

      }


      // FORM DATA

      const checkin =
        form.checkin.value.trim();

      const checkout =
        form.checkout.value.trim();

      const customerName =
        nameInput.value.trim();


      // DATE VALIDATION

      const checkInDate =
        new Date(checkin);

      const checkOutDate =
        new Date(checkout);


      if (
        Number.isNaN(
          checkInDate.getTime()
        ) ||
        Number.isNaN(
          checkOutDate.getTime()
        )
      ) {

        showPopup(
          "❌ გთხოვთ სწორად მიუთითოთ თარიღები."
        );

        return;

      }


      // NIGHTS

      const millisecondsPerDay =
        1000 *
        60 *
        60 *
        24;


      const nights =
        Math.round(
          (
            checkOutDate -
            checkInDate
          ) /
          millisecondsPerDay
        );


      if (nights <= 0) {

        showPopup(
          "❌ Check-out უნდა იყოს Check-in-ზე გვიან."
        );

        return;

      }


      // GUESTS

      const guests = 1;


      const maxGuests =
        Number(
          currentRoom.maxGuests ||
          1
        );


      if (
        guests >
        maxGuests
      ) {

        showPopup(
          `❌ ამ ოთახში მაქსიმუმ ${maxGuests} სტუმარია შესაძლებელი.`
        );

        return;

      }


      // ROOM PRICE

      const roomPrice =
        Number(
          currentRoom.pricePerNight ||
          0
        );


      if (
        roomPrice <= 0
      ) {

        showPopup(
          "❌ ოთახის ფასი ვერ მოიძებნა."
        );

        return;

      }


      // TOTAL PRICE

      const totalPrice =
        nights *
        roomPrice;


      // ROOM NAME

      const roomName =
        currentRoom.name ||
        currentRoom.roomTypeName ||
        "Hotel Room";


      // DEBUG

      console.log(
        "Selected room:",
        currentRoom
      );

      console.log(
        "Room ID:",
        currentRoomId
      );

      console.log(
        "Room name:",
        roomName
      );

      console.log(
        "Room price:",
        roomPrice
      );

      console.log(
        "Nights:",
        nights
      );

      console.log(
        "Guests:",
        guests
      );

      console.log(
        "Total price:",
        totalPrice
      );


      // =================================================
      // OPEN PAYMENT
      // =================================================

      showFakePayment({

        roomId:
          Number(
            currentRoomId
          ),

        roomName:
          roomName,

        roomPrice:
          roomPrice,

        nights:
          nights,

        totalPrice:
          totalPrice,

        checkin:
          checkin,

        checkout:
          checkout,

        customerName:
          customerName,

        guests:
          guests

      });

    }


    // ===================================================
    // FAKE PAYMENT
    // ===================================================

    function showFakePayment(
      bookingData
    ) {

      const modal =
        document.getElementById(
          "paymentModal"
        );


      if (!modal) {

        console.error(
          "❌ paymentModal ვერ მოიძებნა HTML-ში."
        );

        showPopup(
          "❌ გადახდის ფანჯარა ვერ ჩაიტვირთა."
        );

        return;

      }


      // PAYMENT INFORMATION

      const roomNameElement =
        document.getElementById(
          "paymentRoomName"
        );


      const roomPriceElement =
        document.getElementById(
          "paymentRoomPrice"
        );


      const nightsElement =
        document.getElementById(
          "paymentNights"
        );


      const totalElement =
        document.getElementById(
          "paymentTotal"
        );


      if (roomNameElement) {

        roomNameElement.textContent =
          bookingData.roomName;

      }


      if (roomPriceElement) {

        roomPriceElement.textContent =
          `${bookingData.roomPrice} ₾ / ღამე`;

      }


      if (nightsElement) {

        nightsElement.textContent =
          `${bookingData.nights} ღამე`;

      }


      if (totalElement) {

        totalElement.textContent =
          `${bookingData.totalPrice} ₾`;

      }


      // SHOW MODAL

      modal.classList.remove(
        "hidden"
      );


      console.log(
        "💳 Payment modal opened:",
        bookingData
      );


      // =================================================
      // PAYMENT BUTTON
      // =================================================

      const payButton =
        document.getElementById(
          "payButton"
        );


      if (!payButton) {

        console.error(
          "❌ payButton ვერ მოიძებნა."
        );

        return;

      }


      payButton.disabled =
        false;


      payButton.textContent =
        `გადახდა ${bookingData.totalPrice} ₾`;


      payButton.style.background =
        "";


      // =================================================
      // PAYMENT CLICK
      // =================================================

      payButton.onclick =
        async function () {

          console.log(
            "🔥 PAY BUTTON CLICKED"
          );


          // CARD INPUTS

          const cardNumberInput =
            document.getElementById(
              "cardNumber"
            );


          const expiryInput =
            document.getElementById(
              "cardExpiry"
            );


          const cvvInput =
            document.getElementById(
              "cardCvv"
            );


          if (
            !cardNumberInput ||
            !expiryInput ||
            !cvvInput
          ) {

            console.error(
              "❌ Card input ვერ მოიძებნა."
            );


            showPopup(
              "❌ ბარათის ველები ვერ მოიძებნა."
            );


            return;

          }


          // VALUES

          const cardNumber =
            cardNumberInput.value.trim();

          const expiry =
            expiryInput.value.trim();

          const cvv =
            cvvInput.value.trim();


          // EMPTY

          if (
            !cardNumber ||
            !expiry ||
            !cvv
          ) {

            showPopup(
              "❌ გთხოვთ შეავსოთ ბარათის ყველა ველი."
            );

            return;

          }


          // CARD NUMBER

          const cleanCardNumber =
            cardNumber.replace(
              /\s/g,
              ""
            );


          if (
            !/^\d{16}$/.test(
              cleanCardNumber
            )
          ) {

            showPopup(
              "❌ ბარათის ნომერი უნდა შეიცავდეს 16 ციფრს."
            );

            return;

          }


          // EXPIRY

          if (
            !/^\d{2}\/\d{2}$/.test(
              expiry
            )
          ) {

            showPopup(
              "❌ ვადის ფორმატი უნდა იყოს MM/YY."
            );

            return;

          }


          // MONTH

          const expiryParts =
            expiry.split("/");


          const expiryMonth =
            Number(
              expiryParts[0]
            );


          if (
            expiryMonth < 1 ||
            expiryMonth > 12
          ) {

            showPopup(
              "❌ თვე უნდა იყოს 01-დან 12-მდე."
            );

            return;

          }


          // CVV

          if (
            !/^\d{3}$/.test(
              cvv
            )
          ) {

            showPopup(
              "❌ CVV უნდა შეიცავდეს 3 ციფრს."
            );

            return;

          }


          console.log(
            "✅ Card validation successful"
          );


          // =================================================
          // PAYMENT PROCESSING
          // =================================================

          payButton.disabled =
            true;


          payButton.textContent =
            "გადახდა მუშავდება...";


          try {

            // FAKE PAYMENT

            await new Promise(
              resolve =>
                setTimeout(
                  resolve,
                  1500
                )
            );


            console.log(
              "✅ Fake payment successful"
            );


            payButton.textContent =
              "გადახდა წარმატებით შესრულდა ✓";


            payButton.style.background =
              "#28a745";


            await new Promise(
              resolve =>
                setTimeout(
                  resolve,
                  300
                )
            );


            // =================================================
            // CREATE BOOKING
            // =================================================

          await createBookingAfterPayment(bookingData);

console.log("✅ Booking successfully created");

// bookedrooms.html-ზე გადასვლა
setTimeout(() => {
  window.location.href = "./bookedrooms.html";
}, 500);
          } catch (error) {

            console.error(
              "❌ Payment / Booking error:",
              error
            );


            payButton.disabled =
              false;


            payButton.textContent =
              `გადახდა ${bookingData.totalPrice} ₾`;


            payButton.style.background =
              "";


            showPopup(
              `❌ ${
                error.message ||
                "გადახდა ან დაჯავშნა ვერ შესრულდა."
              }`
            );

          }

        };

    }


    // ===================================================
    // CREATE BOOKING AFTER PAYMENT
    // ===================================================

    async function createBookingAfterPayment(
      bookingData
    ) {

      // TOKEN

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        throw new Error(
          "Login-ის სესია დასრულებულია. გთხოვთ თავიდან გაიაროთ Login."
        );

      }


      // =================================================
      // BACKEND PAYLOAD
      // =================================================

      const data = {

        roomId:
          bookingData.roomId,

        customerName:
          bookingData.customerName,

        checkInDate:
          bookingData.checkin,

        checkOutDate:
          bookingData.checkout,

        guests:
          bookingData.guests

      };


      console.log(
        "📤 Booking data:",
        data
      );


      // =================================================
      // POST BOOKING
      // =================================================

      const response =
        await fetch(
          BOOKINGS_API,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${token}`

            },

            body:
              JSON.stringify(
                data
              )

          }
        );


      console.log(
        "📥 Booking response status:",
        response.status
      );


      // =================================================
      // 401
      // =================================================

      if (
        response.status === 401
      ) {

        throw new Error(
          "ავტორიზაცია ვერ გაიარა. გთხოვთ თავიდან გაიაროთ Login."
        );

      }


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        let errorMessage =
          "დაჯავშნა ვერ შესრულდა.";


        try {

          const errorData =
            await response.json();


          console.error(
            "❌ Booking API error:",
            errorData
          );


          if (
            errorData?.detail
          ) {

            if (
              Array.isArray(
                errorData.detail
              )
            ) {

              errorMessage =
                errorData.detail
                  .map(
                    item =>
                      item.msg ||
                      "შეცდომა"
                  )
                  .join(
                    ", "
                  );

            } else {

              errorMessage =
                errorData.detail;

            }

          }

        } catch (jsonError) {

          console.error(
            "❌ Error reading API response:",
            jsonError
          );

        }


        throw new Error(
          errorMessage
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      const result =
        await response.json();


      console.log(
        "✅ Booking created:",
        result
      );


      // =================================================
      // CLOSE MODAL
      // =================================================

      const paymentModal =
        document.getElementById(
          "paymentModal"
        );


      if (paymentModal) {

        paymentModal.classList.add(
          "hidden"
        );

      }


      // =================================================
      // SAVE HISTORY
      // =================================================

      Storage.add(
        "checkinHistory",
        bookingData.checkin
      );


      Storage.add(
        "checkoutHistory",
        bookingData.checkout
      );


      Storage.add(
        "nameHistory",
        bookingData.customerName
      );


      if (phoneInput) {

        Storage.add(
          "phoneHistory",
          phoneInput.value.trim()
        );

      }


      // =================================================
      // UPDATE UI
      // =================================================

      renderAll();


      form.reset();


      if (submitBtn) {

        submitBtn.disabled =
          true;

      }


      // =================================================
      // UPDATE BOOKED DATES
      // =================================================

      try {

        const updatedDates =
          await fetchBookedDates(
            bookingData.roomId
          );


        initFlatpickr(
          updatedDates
        );

      } catch (datesError) {

        console.error(
          "❌ Booked dates update error:",
          datesError
        );

      }


      // =================================================
      // SUCCESS POPUP
      // =================================================

      showPopup(

        `✅ გადახდა და დაჯავშნა წარმატებით შესრულდა!\n\n` +

        `🏨 ${bookingData.roomName}\n` +

        `📅 ${bookingData.checkin} → ${bookingData.checkout}\n` +

        `🌙 ${bookingData.nights} ღამე\n` +

        `💰 ${bookingData.roomPrice} ₾ × ${bookingData.nights}\n` +

        `💳 სულ გადახდილი: ${bookingData.totalPrice} ₾\n\n` +

        `📋 გადაგიყვანთ თქვენს ჯავშნებზე...`

      );


      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(
        () => {

          window.location.href =
            "./bookedrooms.html";

        },
        2500
      );


      return result;

    }


    // ===================================================
    // SUBMIT BUTTON
    // ===================================================

    if (submitBtn) {

      submitBtn.addEventListener(
        "click",
        (e) => {

          e.preventDefault();


          console.log(
            "🛎️ BOOK BUTTON CLICKED"
          );


          bookRoom();

        }
      );

    }

  }
);


// =====================================================
// ROOM DETAILS / GALLERY
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const roomId =
      params.get("roomId");


    const roomDetailsEl =
      document.getElementById(
        "room-details"
      );


    const swiperWrapper =
      document.getElementById(
        "swiper-wrapper"
      );


    if (!roomDetailsEl) {

      console.error(
        "#room-details ელემენტი ვერ მოიძებნა"
      );

      return;

    }


    if (!swiperWrapper) {

      roomDetailsEl.innerHTML =
        "გალერეის wrapper (#swiper-wrapper) ვერ მოიძებნა";

      return;

    }


    if (!roomId) {

      roomDetailsEl.innerHTML =
        "ოთახის ID ვერ მოიძებნა URL-ში";

      return;

    }


    const PLACEHOLDER =
      "https://via.placeholder.com/800x500?text=No+Image";


    const BACKUP_IMAGE =
      "https://via.placeholder.com/800x500?text=Backup+Image";


    // =================================================
    // IMAGE URL
    // =================================================

    function toAbsoluteUrl(src) {

      if (!src) {

        return PLACEHOLDER;

      }


      const s =
        String(src).trim();


      if (
        /^https?:\/\//i.test(s) ||
        /^data:/i.test(s)
      ) {

        return s;

      }


      if (
        s.startsWith("/")
      ) {

        return API_BASE + s;

      }


      return (
        API_BASE +
        "/" +
        s.replace(
          /^\.?\//,
          ""
        )
      );

    }


    try {

      // GET ROOMS

      const res =
        await fetch(
          ROOMS_API
        );


      if (!res.ok) {

        throw new Error(
          `ოთახების მიღება ვერ მოხერხდა (${res.status})`
        );

      }


      const data =
        await res.json();


      const rooms =
        Array.isArray(data)
          ? data
          : Array.isArray(data.rooms)
            ? data.rooms
            : [];


      // FIND ROOM

      const room =
        rooms.find(
          r =>
            Number(r.id) ===
            Number(roomId)
        );


      if (!room) {

        throw new Error(
          `ოთახი ID ${roomId} ვერ მოიძებნა`
        );

      }


      console.log(
        "Gallery room:",
        room
      );


      // CLEAR

      swiperWrapper.innerHTML =
        "";


      const images =
        Array.isArray(
          room.images
        )
          ? room.images
          : [];


      // =================================================
      // NO IMAGES
      // =================================================

      if (
        images.length === 0
      ) {

        const slide =
          document.createElement(
            "div"
          );


        slide.className =
          "swiper-slide";


        const img =
          document.createElement(
            "img"
          );


        img.src =
          PLACEHOLDER;


        img.alt =
          "No image";


        img.loading =
          "lazy";


        img.decoding =
          "async";


        slide.appendChild(
          img
        );


        swiperWrapper.appendChild(
          slide
        );


      } else {

        // =================================================
        // SHOW IMAGES
        // =================================================

        images.forEach(
          image => {

            const slide =
              document.createElement(
                "div"
              );


            slide.className =
              "swiper-slide";


            const img =
              document.createElement(
                "img"
              );


            img.alt =
              room.name ||
              "Room image";


            img.loading =
              "lazy";


            img.decoding =
              "async";


            const source =
              typeof image === "string"
                ? image
                : image?.source ||
                  image?.url;


            img.src =
              toAbsoluteUrl(
                source
              );


            img.onerror =
              () => {

                img.onerror =
                  null;


                img.src =
                  BACKUP_IMAGE;


                setTimeout(
                  () => {

                    if (
                      img.src ===
                      BACKUP_IMAGE
                    ) {

                      img.src =
                        PLACEHOLDER;

                    }

                  },
                  1000
                );

              };


            slide.appendChild(
              img
            );


            swiperWrapper.appendChild(
              slide
            );

          }
        );

      }


      // =================================================
      // SWIPER
      // =================================================

      const swiperContainer =
        document.querySelector(
          ".swiper"
        );


      if (
        swiperContainer &&
        typeof Swiper !==
          "undefined"
      ) {

        new Swiper(
          ".swiper",
          {

            loop:
              images.length > 1,

            slidesPerView:
              1,

            spaceBetween:
              10,

            navigation: {

              nextEl:
                ".swiper-button-next",

              prevEl:
                ".swiper-button-prev"

            },

            pagination: {

              el:
                ".swiper-pagination",

              clickable:
                true

            }

          }
        );

      }

    } catch (err) {

      console.error(
        "❌ Room gallery error:",
        err
      );


      roomDetailsEl.innerHTML =
        "ოთახი ვერ მოიძებნა ან მოხდა შეცდომა";

    }

  }
);


// =====================================================
// TABS
// =====================================================

const buttons =
  document.querySelectorAll(
    ".tab-btn"
  );


const displayText =
  document.getElementById(
    "displayText"
  );


const displayImg =
  document.getElementById(
    "displayImg"
  );


buttons.forEach(
  btn => {

    btn.addEventListener(
      "click",
      () => {

        if (
          btn.classList.contains(
            "active"
          )
        ) {

          return;

        }


        buttons.forEach(
          b =>
            b.classList.remove(
              "active"
            )
        );


        btn.classList.add(
          "active"
        );


        if (
          btn.dataset.img &&
          displayImg
        ) {

          displayImg.src =
            btn.dataset.img;

          displayImg.style.display =
            "block";

        } else if (
          displayImg
        ) {

          displayImg.style.display =
            "none";

        }


        if (displayText) {

          displayText.textContent =
            btn.dataset.text ||
            "";

        }

      }
    );

  }
);


// =====================================================
// LOAD ROOMS
// =====================================================

async function loadRooms() {

  try {

    const res =
      await fetch(
        ROOMS_API
      );


    if (!res.ok) {

      throw new Error(
        `ოთახების მიღება ვერ მოხერხდა (${res.status})`
      );

    }


    const data =
      await res.json();


    const rooms =
      Array.isArray(data)
        ? data
        : Array.isArray(data.rooms)
          ? data.rooms
          : [];


    console.log(
      "All rooms:",
      rooms
    );


    const firstThreeRooms =
      rooms.slice(
        0,
        3
      );


    const container =
      document.getElementById(
        "roomsContainer"
      );


    if (!container) {
      return;
    }


    container.innerHTML =
      "";


    firstThreeRooms.forEach(
      room => {

        const imgSrc =
          room.images?.[0]?.source
            ? room.images[0].source
            : "https://via.placeholder.com/300x200?text=No+Image";


        const card =
          document.createElement(
            "div"
          );


        card.className =
          "card";


        card.innerHTML = `
          <img
            src="${imgSrc}"
            alt="${room.name || "Room"}"
            class="img"
          >

          <div class="card1">

            <h3>
              ${room.name || "Room"}
            </h3>

            <div class="cardbody">

              <p class="euro">
                &euro; ${room.pricePerNight ?? 0}
              </p>

              <p class="night">
                a night
              </p>

            </div>

          </div>

          <button
            class="book-btn"
            style="display:none;"
          >
            <a
              href="./booknow.html?roomId=${room.id}"
              class="book"
            >
              Book Now
            </a>
          </button>
        `;


        const bookBtn =
          card.querySelector(
            ".book-btn"
          );


        const img =
          card.querySelector(
            "img"
          );


        if (img) {

          img.addEventListener(
            "error",
            () => {

              img.onerror =
                null;

              img.src =
                "https://via.placeholder.com/300x200?text=No+Image";

            }
          );

        }


        card.addEventListener(
          "mouseenter",
          () => {

            if (bookBtn) {

              bookBtn.style.display =
                "block";

            }


            if (img) {

              img.style.display =
                "none";

            }

          }
        );


        card.addEventListener(
          "mouseleave",
          () => {

            if (bookBtn) {

              bookBtn.style.display =
                "none";

            }


            if (img) {

              img.style.display =
                "block";

            }

          }
        );


        container.appendChild(
          card
        );

      }
    );


  } catch (error) {

    console.error(
      "❌ Load rooms error:",
      error
    );


    const container =
      document.getElementById(
        "roomsContainer"
      );


    if (container) {

      container.textContent =
        "ოთახებზე მონაცემების მიღება ვერ მოხერხდა.";

    }

  }

}


document.addEventListener(
  "DOMContentLoaded",
  loadRooms
);





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