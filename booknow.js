const API_BASE = "https://hotel-backend-qeue.onrender.com";

const ROOMS_API = `${API_BASE}/api/Rooms/GetAll`;
const BOOKINGS_API = `${API_BASE}/api/Booking`;


// =====================================================
// NAVIGATION
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


// =====================================================
// BOOKING FORM
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

  const form = document.getElementById("registrationForm");

  if (!form) {
    console.error("registrationForm ვერ მოიძებნა");
    return;
  }

  const submitBtn = form.querySelector(".submit");

  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("popup-close");

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");

  const params = new URLSearchParams(window.location.search);

  const currentRoomId = params.get("roomId");

  let currentRoom = null;
  let currentRoomPrice = 0;

  let flatpickrCheckin = null;
  let flatpickrCheckout = null;


  // ===================================================
  // POPUP
  // ===================================================

  function showPopup(message) {

    if (!popup || !popupMessage) {
      return;
    }

    popupMessage.textContent = message;
    popup.style.display = "flex";
  }

  if (popupClose) {

    popupClose.addEventListener("click", () => {
      popup.style.display = "none";
    });

  }


  // ===================================================
  // LOCAL STORAGE
  // ===================================================

  const Storage = {

    get(key) {

      try {

        return JSON.parse(
          localStorage.getItem(key)
        ) || [];

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

      const list = Storage.get(key);

      if (!list.includes(value)) {

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

  function attachDropdown(input, storageKey) {

    if (!input) {
      return;
    }

    let wrapper = input.closest(".date-wrapper");

    if (!wrapper) {
      wrapper = input.closest(".popup");
    }

    if (!wrapper) {
      return;
    }

    let history = Storage.get(storageKey);

    const list = document.createElement("ul");

    list.classList.add("dropdown-list");

    wrapper.appendChild(list);


    function render() {

      list.innerHTML = "";

      history.forEach((value, index) => {

        const li = document.createElement("li");

        li.textContent = value;


        const delBtn = document.createElement("button");

        delBtn.textContent = "✖";
        delBtn.classList.add("delete-btn");


        delBtn.onclick = (e) => {

          e.stopPropagation();

          history.splice(index, 1);

          Storage.set(
            storageKey,
            history
          );

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


      list.style.display =
        history.length
          ? "block"
          : "none";

    }


    input.addEventListener("keydown", (e) => {

      if (e.key === "Enter") {

        e.preventDefault();

        const value = input.value.trim();

        if (
          value &&
          !history.includes(value)
        ) {

          history.push(value);

          Storage.set(
            storageKey,
            history
          );

          render();

        }

      }

    });


    input.addEventListener(
      "focus",
      render
    );


    document.addEventListener("click", (e) => {

      if (
        !e.target.closest(".date-wrapper") &&
        !e.target.closest(".popup")
      ) {

        list.style.display = "none";

      }

    });


    renderers.push(render);

  }


  function renderAll() {

    renderers.forEach(
      fn => fn()
    );

  }


  attachDropdown(
    document.getElementById("filter-checkin"),
    "checkinHistory"
  );

  attachDropdown(
    document.getElementById("filter-checkout"),
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
      form.checkin?.value.trim() || "";

    const checkout =
      form.checkout?.value.trim() || "";

    const customerName =
      nameInput?.value.trim() || "";

    const customerPhone =
      phoneInput?.value.trim() || "";


    let valid = true;


    const checkinError =
      document.getElementById("checkin-error");

    const checkoutError =
      document.getElementById("checkout-error");

    const nameError =
      document.getElementById("name-error");

    const phoneError =
      document.getElementById("phone-error");


    if (!checkin) {

      if (checkinError) {
        checkinError.style.display = "block";
      }

      valid = false;

    } else {

      if (checkinError) {
        checkinError.style.display = "none";
      }

    }


    if (!checkout) {

      if (checkoutError) {
        checkoutError.style.display = "block";
      }

      valid = false;

    } else {

      if (checkoutError) {
        checkoutError.style.display = "none";
      }

    }


    if (!customerName) {

      if (nameError) {
        nameError.style.display = "block";
      }

      valid = false;

    } else {

      if (nameError) {
        nameError.style.display = "none";
      }

    }


    if (!/^\d{9}$/.test(customerPhone)) {

      if (phoneError) {
        phoneError.style.display = "block";
      }

      valid = false;

    } else {

      if (phoneError) {
        phoneError.style.display = "none";
      }

    }


    if (submitBtn) {
      submitBtn.disabled = !valid;
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
  // IMPORTANT:
  // Backend does not have /GetRoom/{id}
  // We get all rooms and find the required room by ID.
  // ===================================================

  async function fetchRoomById(roomId) {

    try {

      const res = await fetch(
        ROOMS_API
      );


      if (!res.ok) {

        throw new Error(
          `ოთახების მიღება ვერ მოხერხდა (${res.status})`
        );

      }


      const data = await res.json();


      const rooms =
        Array.isArray(data)
          ? data
          : Array.isArray(data.rooms)
            ? data.rooms
            : [];


      const room = rooms.find(
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
        "Room loading error:",
        err
      );

      return null;

    }

  }


  // ===================================================
  // GET BOOKED DATES
  // ===================================================

  async function fetchBookedDates(roomId) {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        console.warn(
          "JWT token ვერ მოიძებნა."
        );

        return [];

      }


      const res = await fetch(
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


      if (res.status === 401) {

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


      const bookings =
        await res.json();


      if (!Array.isArray(bookings)) {

        console.error(
          "Booking API-მ array არ დააბრუნა:",
          bookings
        );

        return [];

      }


      return bookings

        .filter(
          booking =>

            Number(
              booking.roomID ??
              booking.roomId
            ) === Number(roomId)
        )

        .map(
          booking => ({

            from:
              String(
                booking.checkInDate
              ).split("T")[0],

            to:
              String(
                booking.checkOutDate
              ).split("T")[0]

          })
        );


    } catch (err) {

      console.error(
        "Booked dates error:",
        err
      );

      return [];

    }

  }


  // ===================================================
  // FLATPICKR
  // ===================================================

  function initFlatpickr(disabledDates) {


    const localeGE = {

      firstDayOfWeek: 1,

      weekdays: {

        shorthand: [
          "კვ",
          "ორ",
          "სამ",
          "ოთხ",
          "ხუთ",
          "პარ",
          "შაბ"
        ],

        longhand: [
          "კვირა",
          "ორშაბათი",
          "სამშაბათი",
          "ოთხშაბათი",
          "ხუთშაბათი",
          "პარასკევი",
          "შაბათი"
        ]

      },

      months: {

        shorthand: [
          "იან",
          "თებ",
          "მარ",
          "აპრ",
          "მაი",
          "ივნ",
          "ივლ",
          "აგვ",
          "სექ",
          "ოქტ",
          "ნოე",
          "დეკ"
        ],

        longhand: [
          "იანვარი",
          "თებერვალი",
          "მარტი",
          "აპრილი",
          "მაისი",
          "ივნისი",
          "ივლისი",
          "აგვისტო",
          "სექტემბერი",
          "ოქტომბერი",
          "ნოემბერი",
          "დეკემბერი"
        ]

      }

    };


    function markDisabledDates(dateObj) {

      const current =
        new Date(dateObj);

      current.setHours(
        0,
        0,
        0,
        0
      );


      return disabledDates.some(d => {

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


        // Check-out date remains available
        return (
          current >= from &&
          current < to
        );

      });

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


    if (!checkinInput || !checkoutInput) {

      console.error(
        "Check-in / Check-out input ვერ მოიძებნა"
      );

      return;

    }


    flatpickrCheckin =
      flatpickr(
        checkinInput,
        {

          dateFormat: "Y-m-d",

          disableMobile: true,

          locale: localeGE,

          disable: [
            markDisabledDates
          ],

          onChange:
            validateForm,

          onDayCreate:
            function(
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

          dateFormat: "Y-m-d",

          disableMobile: true,

          locale: localeGE,

          disable: [
            markDisabledDates
          ],

          onChange:
            validateForm,

          onDayCreate:
            function(
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
        currentRoom.pricePerNight || 0
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
        `${currentRoom.name} - €${currentRoomPrice}`;

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
  if (!validateForm()) return;

  const token = localStorage.getItem("token");

  if (!token) {
    showPopup("❌ გთხოვთ თავიდან გაიაროთ Login.");
    return;
  }

  // კონკრეტული ოთახის ID URL-დან
  if (!currentRoomId) {
    showPopup("❌ ოთახის ID ვერ მოიძებნა.");
    return;
  }

  // თუ ოთახის ინფორმაცია ვერ ჩაიტვირთა
  if (!currentRoom) {
    showPopup("❌ ოთახის ინფორმაცია ვერ მოიძებნა.");
    return;
  }

  const checkin = form.checkin.value.trim();
  const checkout = form.checkout.value.trim();
  const customerName = nameInput.value.trim();

  // -----------------------------------------
  // DATE VALIDATION
  // -----------------------------------------

  const checkInDate = new Date(checkin);
  const checkOutDate = new Date(checkout);

  if (
    Number.isNaN(checkInDate.getTime()) ||
    Number.isNaN(checkOutDate.getTime())
  ) {
    showPopup("❌ გთხოვთ სწორად მიუთითოთ თარიღები.");
    return;
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const nights = Math.round(
    (checkOutDate - checkInDate) /
    millisecondsPerDay
  );

  if (nights <= 0) {
    showPopup(
      "❌ Check-out უნდა იყოს Check-in-ზე გვიან."
    );
    return;
  }

  // -----------------------------------------
  // GUESTS
  // -----------------------------------------

  // ამ ეტაპზე ერთი სტუმარი
  // თუ ფორმაში guests input გაქვს,
  // შემდეგ შეგვიძლია იქიდან ავიღოთ.
  const guests = 1;

  // ოთახის მაქსიმალური სტუმრების რაოდენობის შემოწმება
  const maxGuests = Number(
    currentRoom.maxGuests || 1
  );

  if (guests > maxGuests) {
    showPopup(
      `❌ ამ ოთახში მაქსიმუმ ${maxGuests} სტუმარია შესაძლებელი.`
    );
    return;
  }

  // -----------------------------------------
  // PRICE
  // -----------------------------------------

  const roomPrice = Number(
    currentRoom.pricePerNight || 0
  );

  const totalPrice =
    nights * roomPrice;

  console.log("Selected room:", currentRoom);
  console.log("Room ID:", currentRoomId);
  console.log("Nights:", nights);
  console.log("Guests:", guests);
  console.log("Total price:", totalPrice);

  // -----------------------------------------
  // BACKEND PAYLOAD
  // -----------------------------------------

  // IMPORTANT:
  // totalPrice და isConfirmed აქ აღარ იგზავნება,
  // რადგან BookingCreate schema-ში არ არსებობს.
  const data = {
    roomId: Number(currentRoomId),
    customerName: customerName,
    checkInDate: checkin,
    checkOutDate: checkout,
    guests: guests
  };

  console.log("Booking data:", data);

  // -----------------------------------------
  // SEND BOOKING
  // -----------------------------------------

  try {
    const response = await fetch(BOOKINGS_API, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(data)
    });

    // -----------------------------------------
    // UNAUTHORIZED
    // -----------------------------------------

    if (response.status === 401) {
      showPopup(
        "❌ ავტორიზაცია ვერ გაიარა. გთხოვთ თავიდან გაიაროთ Login."
      );
      return;
    }

    // -----------------------------------------
    // OTHER ERRORS
    // -----------------------------------------

    if (!response.ok) {
      let errorMessage =
        "დაჯავშნა ვერ შესრულდა.";

      try {
        const errorData =
          await response.json();

        console.error(
          "Booking API error:",
          errorData
        );

        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage =
              errorData.detail
                .map(item =>
                  item.msg || "შეცდომა"
                )
                .join(", ");
          } else {
            errorMessage =
              errorData.detail;
          }
        }
      } catch (jsonError) {
        console.error(
          "Error reading API response:",
          jsonError
        );
      }

      throw new Error(errorMessage);
    }

    // -----------------------------------------
    // SUCCESS
    // -----------------------------------------

    const result =
      await response.json();

    console.log(
      "Booking created:",
      result
    );

    showPopup(
      "✅ დაჯავშნა წარმატებით შესრულდა!"
    );

    // -----------------------------------------
    // SAVE HISTORY
    // -----------------------------------------

    Storage.add(
      "checkinHistory",
      checkin
    );

    Storage.add(
      "checkoutHistory",
      checkout
    );

    Storage.add(
      "nameHistory",
      customerName
    );

    Storage.add(
      "phoneHistory",
      phoneInput.value.trim()
    );

    // -----------------------------------------
    // UPDATE UI
    // -----------------------------------------

    renderAll();

    form.reset();

    submitBtn.disabled = true;

    // -----------------------------------------
    // UPDATE BOOKED DATES
    // -----------------------------------------

    const updatedDates =
      await fetchBookedDates(
        currentRoomId
      );

    initFlatpickr(
      updatedDates
    );

  } catch (error) {
    console.error(
      "Booking error:",
      error
    );

    showPopup(
      "❌ შეცდომა: " +
      error.message
    );
  }
}









//   async function bookRoom() {


//     if (!validateForm()) {
//       return;
//     }


//     // -----------------------------------------------
//     // JWT TOKEN
//     // -----------------------------------------------

//     const token =
//       localStorage.getItem("token");


//     if (!token) {

//       showPopup(
//         "❌ გთხოვთ თავიდან გაიაროთ Login."
//       );

//       return;

//     }


//     // -----------------------------------------------
//     // ROOM ID
//     // -----------------------------------------------

//     if (!currentRoomId) {

//       showPopup(
//         "❌ ოთახის ID ვერ მოიძებნა."
//       );

//       return;

//     }


//     const checkin =
//       form.checkin.value.trim();

//     const checkout =
//       form.checkout.value.trim();

//     const customerName =
//       nameInput.value.trim();


//     // -----------------------------------------------
//     // CALCULATE NIGHTS
//     // -----------------------------------------------

//     const checkInDate =
//       new Date(checkin);

//     const checkOutDate =
//       new Date(checkout);


//     const millisecondsPerDay =
//       1000 *
//       60 *
//       60 *
//       24;


//     const nights =
//       Math.round(
//         (
//           checkOutDate -
//           checkInDate
//         ) /
//         millisecondsPerDay
//       );


//     if (nights <= 0) {

//       showPopup(
//         "❌ Check-out უნდა იყოს Check-in-ზე გვიან."
//       );

//       return;

//     }


//     // -----------------------------------------------
//     // TOTAL PRICE
//     // -----------------------------------------------

//     const totalPrice =
//       nights *
//       Number(currentRoomPrice);


//     // -----------------------------------------------
//     // DATA FOR FASTAPI
//     // -----------------------------------------------

//     const data = {

//       roomId:
//         Number(currentRoomId),

//       checkInDate:
//         checkin,

//       checkOutDate:
//         checkout,

//       totalPrice:
//         totalPrice,

//       isConfirmed:
//         false,

//       customerName:
//         customerName

//     };


//     console.log(
//       "Booking data:",
//       data
//     );


//     // -----------------------------------------------
//     // POST BOOKING
//     // -----------------------------------------------

//     try {


//       const response =
//         await fetch(
//           BOOKINGS_API,
//           {

//             method: "POST",

//             headers: {

//               "Content-Type":
//                 "application/json",

//               "Authorization":
//                 `Bearer ${token}`

//             },

//             body:
//               JSON.stringify(data)

//           }
//         );


//       // ---------------------------------------------
//       // 401
//       // ---------------------------------------------

//       if (
//         response.status === 401
//       ) {

//         showPopup(
//           "❌ ავტორიზაცია ვერ გაიარა. გთხოვთ თავიდან გაიაროთ Login."
//         );

//         return;

//       }


//       // ---------------------------------------------
//       // OTHER ERRORS
//       // ---------------------------------------------

//       if (!response.ok) {


//         let errorMessage =
//           "დაჯავშნა ვერ შესრულდა";


//         try {

//           const errorData =
//             await response.json();


//           if (errorData.detail) {


//             if (
//               Array.isArray(
//                 errorData.detail
//               )
//             ) {

//               errorMessage =
//                 errorData.detail

//                   .map(
//                     item =>
//                       item.msg
//                   )

//                   .join(", ");

//             } else {

//               errorMessage =
//                 errorData.detail;

//             }

//           }


//         } catch {

//           // ignore JSON parse error

//         }


//         throw new Error(
//           errorMessage
//         );

//       }


//       // ---------------------------------------------
//       // SUCCESS
//       // ---------------------------------------------

//       const result =
//         await response.json();


//       console.log(
//         "Booking created:",
//         result
//       );


//       showPopup(
//         "✅ დაჯავშნა წარმატებით შესრულდა!"
//       );


//       // ---------------------------------------------
//       // SAVE HISTORY
//       // ---------------------------------------------

//       Storage.add(
//         "checkinHistory",
//         checkin
//       );

//       Storage.add(
//         "checkoutHistory",
//         checkout
//       );

//       Storage.add(
//         "nameHistory",
//         customerName
//       );

//       Storage.add(
//         "phoneHistory",
//         phoneInput.value.trim()
//       );


//       renderAll();


//       form.reset();


//       submitBtn.disabled = true;


//       // ---------------------------------------------
//       // UPDATE BOOKED DATES
//       // ---------------------------------------------

//       const updatedDates =
//         await fetchBookedDates(
//           currentRoomId
//         );


//       initFlatpickr(
//         updatedDates
//       );


//     } catch (error) {


//       console.error(
//         "Booking error:",
//         error
//       );


//       showPopup(
//         "❌ შეცდომა: " +
//         error.message
//       );

//     }

//   }


//   // ===================================================
  // SUBMIT
  // ===================================================

  if (submitBtn) {

    submitBtn.addEventListener(
      "click",
      (e) => {

        e.preventDefault();

        bookRoom();

      }
    );

  }

});
































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


      if (s.startsWith("/")) {

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


      // ---------------------------------------------
      // GET ALL ROOMS
      // ---------------------------------------------

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


      // ---------------------------------------------
      // FIND CURRENT ROOM
      // ---------------------------------------------

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


      // ---------------------------------------------
      // CLEAR GALLERY
      // ---------------------------------------------

      swiperWrapper.innerHTML =
        "";


      const images =
        Array.isArray(room.images)
          ? room.images
          : [];


      // ---------------------------------------------
      // NO IMAGES
      // ---------------------------------------------

      if (images.length === 0) {


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


        // -------------------------------------------
        // SHOW IMAGES
        // -------------------------------------------

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


            img.src =
              toAbsoluteUrl(
                image?.source
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


      // ---------------------------------------------
      // SWIPER
      // ---------------------------------------------

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
        "Room gallery error:",
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

        } else if (displayImg) {

          displayImg.style.display =
            "none";

        }


        if (displayText) {

          displayText.textContent =
            btn.dataset.text || "";

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
      rooms.slice(0, 3);


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


        // -------------------------------------------
        // IMAGE
        // -------------------------------------------

        const imgSrc =
          room.images?.[0]?.source ||
          "https://via.placeholder.com/300x200?text=No+Image";


        // -------------------------------------------
        // CARD
        // -------------------------------------------

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
            style="display: none;"
          >

            <a
              href="./booknow.html?roomId=${room.id}"
              class="book"
            >
              Book Now
            </a>

          </button>

        `;


        // -------------------------------------------
        // BOOK BUTTON
        // -------------------------------------------

        const bookBtn =
          card.querySelector(
            ".book-btn"
          );


        // -------------------------------------------
        // IMAGE
        // -------------------------------------------

        const img =
          card.querySelector(
            "img"
          );


        if (img) {

          img.addEventListener(
            "error",
            () => {

              img.src =
                "https://via.placeholder.com/300x200?text=No+Image";

            }
          );

        }


        // -------------------------------------------
        // HOVER
        // -------------------------------------------

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
      "Load rooms error:",
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