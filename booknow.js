const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");


const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");


overlay.innerHTML = `
  <a href="./homs.html"">Home</a>
  <a href="./rooms.html">Rooms</a>
  <a href="./hotel.html">Hotels</a>
  <a href="./bookedrooms.html">Booked Rooms</a>
`;

document.body.appendChild(overlay);


hamburger.addEventListener("click", () => {
  hamburger.style.display = "none";
  overlay.classList.add("active");
});


overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
  hamburger.style.display = "block";
});










document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registrationForm");
  const submitBtn = form.querySelector(".submit");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("popup-close");
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");

  let currentRoomId = new URLSearchParams(window.location.search).get("roomId");
  let currentRoom = null;
  let currentRoomPrice = 0;
  let flatpickrCheckin, flatpickrCheckout;

  function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
  }
  popupClose.addEventListener("click", () => (popup.style.display = "none"));

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
      let list = Storage.get(key);
      if (!list.includes(value)) {
        list.push(value);
        Storage.set(key, list);
      }
    }
  };

  const renderers = [];

  function attachDropdown(input, storageKey) {
    if (!input) return;

    let wrapper = input.closest(".date-wrapper");
    if (!wrapper) {
      wrapper = input.closest(".popup");
    }
    if (!wrapper) return;

    let history = Storage.get(storageKey);

    const list = document.createElement("ul");
    list.classList.add("dropdown-list");
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      history.forEach((val, index) => {
        const li = document.createElement("li");
        li.textContent = val;

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
          input.value = val;
          list.innerHTML = "";
          validateForm();
        };

        list.appendChild(li);
      });
      list.style.display = history.length ? "block" : "none";
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
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

  function renderAll() {
    renderers.forEach(fn => fn());
  }

  attachDropdown(document.getElementById("filter-checkin"), "checkinHistory");
  attachDropdown(document.getElementById("filter-checkout"), "checkoutHistory");
  attachDropdown(nameInput, "nameHistory");
  attachDropdown(phoneInput, "phoneHistory");

  renderAll();

  function validateForm() {
    const checkin = form.checkin.value.trim();
    const checkout = form.checkout.value.trim();
    const customerName = nameInput.value.trim();
    const customerPhone = phoneInput.value.trim();

    let valid = true;

    if (!checkin) {
      document.getElementById("checkin-error").style.display = "block";
      valid = false;
    } else document.getElementById("checkin-error").style.display = "none";

    if (!checkout) {
      document.getElementById("checkout-error").style.display = "block";
      valid = false;
    } else document.getElementById("checkout-error").style.display = "none";

    if (!customerName) {
      document.getElementById("name-error").style.display = "block";
      valid = false;
    } else document.getElementById("name-error").style.display = "none";

    if (!/^\d{9}$/.test(customerPhone)) {
      document.getElementById("phone-error").style.display = "block";
      valid = false;
    } else document.getElementById("phone-error").style.display = "none";

    submitBtn.disabled = !valid;
    return valid;
  }

  form.addEventListener("input", validateForm);
  async function fetchRoomById(roomId) {
    try {
      const res = await fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll");
      if (!res.ok) throw new Error("მონაცემების წამოღება ვერ მოხერხდა");
      const rooms = await res.json();
      return rooms.find(r => r.id === Number(roomId));
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function fetchBookedDates(roomId) {
    try {
      const res = await fetch("https://hotelbooking.stepprojects.ge/api/Booking");
      if (!res.ok) throw new Error("ბაზის წაკითხვის შეცდომა");
      const bookings = await res.json();
      return bookings
        .filter(b => b.roomID === Number(roomId))
        .map(b => ({
          from: b.checkInDate.split("T")[0],
          to: b.checkOutDate.split("T")[0],
        }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function initFlatpickr(disabledDates) {
    const localeGE = {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["კვ","ორ","სამ","ოთხ","ხუთ","პარ","შაბ"],
        longhand: ["კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი","ხუთშაბათი","პარასკევი","შაბათი"],
      },
      months: {
        shorthand: ["იან","თებ","მარ","აპრ","მაი","ივნ","ივლ","აგვ","სექ","ოქტ","ნოე","დეკ"],
        longhand: ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"],
      },
    };

    function markDisabledDates(dateStr) {
      return disabledDates.some(d => {
        const from = new Date(d.from);
        const to = new Date(d.to);
        const current = new Date(dateStr);
        return current >= from && current <= to;
      });
    }

    if (flatpickrCheckin) flatpickrCheckin.destroy();
    if (flatpickrCheckout) flatpickrCheckout.destroy();

    flatpickrCheckin = flatpickr("#filter-checkin", {
      dateFormat: "Y-m-d",
      disableMobile: true,
      locale: localeGE,
      onDayCreate: function(_, __, ___, dayElem) {
        if (markDisabledDates(dayElem.dateObj)) {
          dayElem.classList.add("booked-day");
        }
      },
      onChange: validateForm
    });

    flatpickrCheckout = flatpickr("#filter-checkout", {
      dateFormat: "Y-m-d",
      disableMobile: true,
      locale: localeGE,
      onDayCreate: function(_, __, ___, dayElem) {
        if (markDisabledDates(dayElem.dateObj)) {
          dayElem.classList.add("booked-day");
        }
      },
      onChange: validateForm
    });
  }

  if (currentRoomId) {
    currentRoom = await fetchRoomById(currentRoomId);
    currentRoomPrice = currentRoom?.pricePerNight || 0;
    const bookedDates = await fetchBookedDates(currentRoomId);

    initFlatpickr(bookedDates);
    document.getElementById("registration-title").textContent =
      `${currentRoom.name} - €${currentRoomPrice}`;
  } else {
    document.getElementById("registration-title").textContent = "რეგისტრაცია";
  }

  async function bookRoom() {
    if (!validateForm()) return;

    const checkin = form.checkin.value.trim();
    const checkout = form.checkout.value.trim();
    const customerName = nameInput.value.trim();
    const customerPhone = phoneInput.value.trim();

    const data = {
      id: 0,
      roomID: currentRoomId ? parseInt(currentRoomId) : 1,
      checkInDate: new Date(checkin).toISOString(),
      checkOutDate: new Date(checkout).toISOString(),
      totalPrice: currentRoomPrice || 0,
      isConfirmed: false,
      customerName,
      customerId: null,
      customerPhone,
    };

    try {
      const response = await fetch("https://hotelbooking.stepprojects.ge/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("დაჯავშნა ვერ შესრულდა");

      showPopup("✅ დაჯავშნა წარმატებით შესრულდა!");

      Storage.add("checkinHistory", checkin);
      Storage.add("checkoutHistory", checkout);
      Storage.add("nameHistory", customerName);
      Storage.add("phoneHistory", customerPhone);

      renderAll();

      form.reset();
      submitBtn.disabled = true;

      const updatedDates = await fetchBookedDates(currentRoomId);
      initFlatpickr(updatedDates);

    } catch (error) {
      showPopup("❌ შეცდომა: " + error.message);
    }
  }

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookRoom();
  });
});














































document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("roomId");

  const roomDetailsEl = document.getElementById("room-details");
  const swiperWrapper = document.getElementById("swiper-wrapper");

  if (!roomDetailsEl) {
    console.error("#room-details ელემენტი ვერ მოიძებნა");
    return;
  }
  if (!swiperWrapper) {
    roomDetailsEl.innerHTML = "გალერეის wrapper (#swiper-wrapper) ვერ მოიძებნა";
    return;
  }
  if (!roomId) {
    roomDetailsEl.innerHTML = "ოთახის ID ვერ მოიძებნა URL-ში";
    return;
  }

  const API_BASE = "https://hotelbooking.stepprojects.ge";
  const PLACEHOLDER = "https://via.placeholder.com/800x500?text=No+Image";
  const BACKUP_IMAGE = "https://via.placeholder.com/800x500?text=Backup+Image"; 

  function toAbsoluteUrl(src) {
    if (!src) return PLACEHOLDER;
    const s = String(src).trim();
    if (/^https?:\/\//i.test(s) || /^data:/i.test(s)) return s;
    if (s.startsWith("/")) return API_BASE + s;
    return API_BASE + "/" + s.replace(/^\.?\/*/, "");
  }

  try {
    const res = await fetch(`${API_BASE}/api/Rooms/GetRoom/${encodeURIComponent(roomId)}`);
    if (!res.ok) throw new Error(`მოთხოვნა ვერ შესრულდა (${res.status})`);

    const room = await res.json();

    swiperWrapper.innerHTML = "";
    const images = Array.isArray(room?.images) ? room.images : [];

    if (images.length === 0) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${PLACEHOLDER}" alt="No image" loading="lazy" decoding="async">`;
      swiperWrapper.appendChild(slide);
    } else {
      images.forEach((image) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        const img = document.createElement("img");
        img.alt = room?.name || "Room image";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = toAbsoluteUrl(image?.source);
        img.onerror = () => {
          img.onerror = () => { 
            img.onerror = null; 
            img.src = PLACEHOLDER;
          };
          img.src = BACKUP_IMAGE;
        };

        slide.appendChild(img);
        swiperWrapper.appendChild(slide);
      });
    }

    const swiperContainer = document.querySelector(".swiper");
    if (swiperContainer && typeof Swiper !== "undefined") {
      new Swiper(".swiper", {
        loop: (images.length || 1) > 1,
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        }
      });
    }
  } catch (err) {
    console.error(err);
    roomDetailsEl.innerHTML = "ოთახი ვერ მოიძებნა ან მოხდა შეცდომა";
  }
});






















 const buttons = document.querySelectorAll(".tab-btn");
  const displayText = document.getElementById("displayText");
  const displayImg = document.getElementById("displayImg");


  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.img) {
        displayImg.src = btn.dataset.img;
        displayImg.style.display = "block";
      } else {
        displayImg.style.display = "none";
      }
      displayText.textContent = btn.dataset.text;
    });
  });









async function loadRooms() {
  try {
    const res = await fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll");
    if (!res.ok) throw new Error("მონაცემების მიღება ვერ მოხერხდა");
    const rooms = await res.json();

    const firstThreeRooms = rooms.slice(0, 3);
    const container = document.getElementById("roomsContainer");
    container.innerHTML = "";

    firstThreeRooms.forEach(room => {
      const imgSrc = room.images?.[0]?.source || "https://via.placeholder.com/300x200";

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${imgSrc}" alt="${room.name}" class="img">
        <div class="card1">
          <h3>${room.name}</h3>
          <div class="cardbody">
            <p class="euro"> &euro; ${room.pricePerNight} </p>
            <p class="night">a night</p>
          </div>
        </div>
        <button class="book-btn" style="display: none;">
          <a href="./booknow.html?roomId=${room.id}" class="book">Book Now</a>
        </button>
      `;

      const bookBtn = card.querySelector(".book-btn");
      const img = card.querySelector("img");

      img.addEventListener("error", () => {
        img.src = "https://via.placeholder.com/300x200?text=No+Image";
      });

      card.addEventListener("mouseenter", () => {
        bookBtn.style.display = "block";
        img.style.display = "none";
      });

      card.addEventListener("mouseleave", () => {
        bookBtn.style.display = "none";
        img.style.display = "block";
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("roomsContainer").textContent =
      "ოთახებზე მონაცემების მიღება ვერ მოხერხდა.";
  }
}

document.addEventListener("DOMContentLoaded", loadRooms);














































