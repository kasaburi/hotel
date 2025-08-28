const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");


const overlay = document.createElement("div");
overlay.classList.add("nav-overlay");


overlay.innerHTML = `
  <a href="./homs.html">Home</a>
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





document.addEventListener("DOMContentLoaded", () => {
  const typeContainer = document.getElementById("roomTypeContainer");
  const roomResults = document.getElementById("roomResults");

  let allRooms = [];
  let selectedRoomType = null;

  function styleButton(btn) {
    btn.style.padding = "6px 12px";
    btn.style.margin = "4px";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.background = "none";
    btn.style.color = "#6a6969ff";
    btn.style.cursor = "pointer";
    btn.style.transition = "background 0.3s, color 0.3s";
   
  }


  
  function highlightSelected(selectedBtn) {
    const buttons = typeContainer.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.classList.remove("all-button");
      btn.style.background = "none";
      btn.style.color = "rgba(47, 48, 48, 0.44)";
    
     
    });
  
    selectedBtn.classList.add("all-button");
    selectedBtn.style.background = "rgba(52, 180, 165, 0.44)";
    selectedBtn.style.color = "#ffffff";
  }







  function renderRooms(rooms) {
    roomResults.innerHTML = "";
    if (!rooms || rooms.length === 0) {
      roomResults.textContent = "";
      return;
    }





    rooms.forEach(room => {
      const imgSrc = room.images?.[0]?.source ?? "https://via.placeholder.com/300x200";
      const card = document.createElement("div");
      card.classList.add("card-container");
      card.innerHTML = `
        <div class="card" style="position: relative;">
          <img src="${imgSrc}" alt="${room.name}" class="img">
          <div class="card1">
            <h3>${room.name}</h3>
            <div class="cardbody">
              <p class="euro"> &euro; ${room.pricePerNight} </p>
              <p class="night">a night</p>
            </div>
          </div>
             <button class="book-btn" style="margin-bottom: 10px; display: none;">
                <a href="./booknow.html?roomId=${room.id}" class="bookbtn">Book Now</a>
            </button>

        </div>`;
      const cardDiv = card.querySelector(".card");
      const bookBtn = card.querySelector(".book-btn");
      const img = cardDiv.querySelector("img");
      cardDiv.addEventListener("mouseenter", () => {
        bookBtn.style.display = "block";
        img.style.filter = "brightness(70%)";
      });
      cardDiv.addEventListener("mouseleave", () => {
        bookBtn.style.display = "none";
        img.style.filter = "brightness(100%)";
      });

      roomResults.appendChild(card);
    });
  }

async function fetchRooms() {
  try {
    const res = await fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll");
    allRooms = await res.json();
    if (Array.isArray(allRooms) && allRooms.length) {
      renderRooms(allRooms);
    } else {
      console.warn("allRooms ცარიელია ან ვერ ჩაიტვირთა");
    }

  } catch (err) {
    console.error("Rooms fetch error:", err);
    roomResults.textContent = "ოთახების ჩატვირთვა ვერ მოხერხდა.";
  }
}
















  async function setupRoomTypeButtons() {
    try {
      const res = await fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes");
      const types = await res.json();

      const allBtn = document.createElement("button");
      allBtn.textContent = "All";
      styleButton(allBtn);
      allBtn.addEventListener("click", () => {
        selectedRoomType = null;
        highlightSelected(allBtn);
        filterRooms();
      });
      typeContainer.appendChild(allBtn);

      types.forEach(type => {
        const btn = document.createElement("button");
        btn.textContent = type.name;
        styleButton(btn);
        btn.addEventListener("click", () => {
          selectedRoomType = type.id;
          highlightSelected(btn);
          filterRooms();
        });
        typeContainer.appendChild(btn);
      });

      highlightSelected(allBtn);
    } catch (err) {
      console.error("Room types fetch error:", err);
      typeContainer.textContent = "ოთახის ტიპების ჩატვირთვა ვერ მოხერხდა.";
    }
  }


const typeSelect = document.getElementById("filter-room-type");
if (typeSelect) {
  typeSelect.addEventListener("change", () => {
    const val = typeSelect.value;
    selectedRoomType = val ? Number(val) : null; 
    filterRooms();
  });
}

function filterRooms() {
  const minPrice = Number(document.getElementById("min-price").textContent) || 0;
  const maxPrice = Number(document.getElementById("max-price").textContent) || Infinity;
  const guests = Number(document.getElementById("adultSelect").value) || 1;
  const searchText = document.getElementById("roomNameInput")?.value.toLowerCase().trim() || "";


  const dropdownValue = document.getElementById("filter-room-type")?.value;
  const roomTypeToFilter = selectedRoomType || (dropdownValue ? Number(dropdownValue) : null);

  const filtered = allRooms.filter(room => {
    if (roomTypeToFilter && room.roomTypeId !== roomTypeToFilter) return false;
    if (room.pricePerNight < minPrice || room.pricePerNight > maxPrice) return false;
    if (room.maxGuests < guests) return false;
    if (
      searchText &&
      !room.name.toLowerCase().includes(searchText) &&
      !(room.roomTypeName && room.roomTypeName.toLowerCase().includes(searchText))
    ) return false;
    return true;
  });

  if (!filtered.length) {
    roomResults.textContent = "";
  } else {
    renderRooms(filtered);
  }

  return filtered;
}
















  const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};
  const guestCount = savedFilters.guestCount || 1;
  const adultSelect = document.getElementById("adultSelect");
  const guestsInput = document.getElementById("guestsInput");
  adultSelect.value = guestCount;
  guestsInput.value = guestCount;

  adultSelect.addEventListener("change", () => {
    const val = parseInt(adultSelect.value);
    guestsInput.value = val;
    let filters = JSON.parse(localStorage.getItem("filters")) || {};
    filters.guestCount = val;
    localStorage.setItem("filters", JSON.stringify(filters));
    filterRooms();
  });


adultSelect.addEventListener("change", () => {
  const val = parseInt(adultSelect.value) || 1;
  guestsInput.value = val;

  let filters = JSON.parse(localStorage.getItem("filters")) || {};
  filters.guestCount = val;
  localStorage.setItem("filters", JSON.stringify(filters));

});

const priceSlider = document.getElementById('price-slider');
const minPriceEl = document.getElementById('min-price');
const maxPriceEl = document.getElementById('max-price');

noUiSlider.create(priceSlider, {
  start: [0, 1000],
  connect: true,
  range: { 'min': 0, 'max': 1000 },
  step: 10
});


priceSlider.noUiSlider.on('update', (values) => {
  minPriceEl.textContent = Math.round(values[0]);
  maxPriceEl.textContent = Math.round(values[1]);
});


document.getElementById("filter-btn").addEventListener("click", filterRooms);



  const nameInput = document.getElementById("roomNameInput");
  if (nameInput) {
    nameInput.addEventListener("input", filterRooms);
  }

  document.getElementById("filter-btn").addEventListener("click", filterRooms);

  fetchRooms().then(() => setupRoomTypeButtons());
});









function filterRooms() {
  const minPrice = Number(document.getElementById("min-price").textContent) || 0;
  const maxPrice = Number(document.getElementById("max-price").textContent) || Infinity;
  const guests = Number(document.getElementById("adultSelect").value) || 1;
  const searchText = document.getElementById("roomNameInput")?.value.toLowerCase().trim() || "";


  const dropdownValue = document.getElementById("filter-room-type")?.value;
  const roomTypeToFilter = dropdownValue ? Number(dropdownValue) : null;


  const checkIn = document.getElementById("filter-checkin")?.value;
  const checkOut = document.getElementById("filter-checkout")?.value;

  const filtered = allRooms.filter(room => {
    if (roomTypeToFilter && room.roomTypeId !== roomTypeToFilter) return false;
    if (room.pricePerNight < minPrice || room.pricePerNight > maxPrice) return false;
    if (room.maxGuests < guests) return false;
    if (
      searchText &&
      !room.name.toLowerCase().includes(searchText) &&
      !(room.roomTypeName && room.roomTypeName.toLowerCase().includes(searchText))
    ) return false;

    if (checkIn && checkOut) {
      const roomAvailableFrom = room.availableFrom ? new Date(room.availableFrom) : null;
      const roomAvailableTo = room.availableTo ? new Date(room.availableTo) : null;
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (roomAvailableFrom && roomAvailableTo) {
        if (checkInDate < roomAvailableFrom || checkOutDate > roomAvailableTo) return false;
      }
    }

    return true;
  });

  renderRooms(filtered);
}

















  flatpickr("#filter-checkout", {
    dateFormat: "Y-m-d",
    disableMobile: true,
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["კვ", "ორ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
        longhand: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"],
      },
      months: {
        shorthand: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"],
        longhand: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
      },
    }
  });
 
  flatpickr("#filter-checkin", {
    dateFormat: "Y-m-d",
    disableMobile: true,
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["კვ", "ორ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
        longhand: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"],
      },
      months: {
        shorthand: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"],
        longhand: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
      },
    }
    
  } 
);



const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
document.body.appendChild(tooltip);

const warningIcons = document.querySelectorAll('.warning-icon');

warningIcons.forEach(icon => {
  icon.addEventListener('mouseenter', e => {
    tooltip.textContent = icon.getAttribute('data-tooltip');
    tooltip.classList.add('show');
    tooltip.style.left = e.pageX + 'px';
    tooltip.style.top = (e.pageY + 20) + 'px';
  });

  icon.addEventListener('mousemove', e => {
    tooltip.style.left = e.pageX + 'px';
    tooltip.style.top = (e.pageY + 20) + 'px';
  });

  icon.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
  });
});







function toggleGuestPopup() {
  const popup = document.getElementById("guestPopup");
  popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", (e) => {
  const popup = document.getElementById("guestPopup");
  const guestsInput = document.getElementById("guestsInput");
  if (
    popup.style.display === "block" &&
    !popup.contains(e.target) &&
    !guestsInput.contains(e.target)
  ) {
    popup.style.display = "none";
  }
});

document.getElementById("adultSelect").addEventListener("change", () => {
  const val = document.getElementById("adultSelect").value;
  document.getElementById("guestsInput").value = val;
  document.getElementById("guestPopup").style.display = "none";
});













const resetBtn = document.getElementById("reset-btn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const priceSlider = document.getElementById("price-slider");
    const minPriceEl  = document.getElementById("min-price");
    const maxPriceEl  = document.getElementById("max-price");
    if (priceSlider && priceSlider.noUiSlider) {
      priceSlider.noUiSlider.set([0, 1000]);
    }
    if (minPriceEl) minPriceEl.textContent = "0";
    if (maxPriceEl) maxPriceEl.textContent = "1000";

    const adultSelect = document.getElementById("adultSelect");
    const guestsInput = document.getElementById("guestsInput");
    if (adultSelect) adultSelect.value = "1";
    if (guestsInput) guestsInput.value = "1";
    localStorage.removeItem("filters");
    const nameInput  = document.getElementById("roomNameInput");
    const typeSelect = document.getElementById("filter-room-type");
    const checkIn    = document.getElementById("filter-checkin");
    const checkOut   = document.getElementById("filter-checkout");
    if (nameInput)  nameInput.value  = "";
    if (typeSelect) typeSelect.value = "";
    if (checkIn)    checkIn.value    = "";
    if (checkOut)   checkOut.value   = "";

  
    if (Array.isArray(allRooms) && allRooms.length) {
  renderRooms(allRooms);
} else {
  console.warn("allRooms ცარიელია ან ჯერ არ ჩაიტვირთა");
}

  });
}

























let allRooms = [];
let selectedRoomType = null;
let currentRenderToken = 0;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const hotelId = params.get("hotelId");
  if (!hotelId) {
    console.log("hotelId ვერ მოიძებნა URL–ში");
    return;
  }

  console.log("hotelId:", hotelId);

  const hotelsContainer = document.getElementById("hotels");
  const roomResults = document.getElementById("roomResults");
  const adultSelect = document.getElementById("adultSelect");
  const guestsInput = document.getElementById("guestsInput");
  const roomTypeSelect = document.getElementById("roomTypeSelect");
  const checkInInput = document.getElementById("filter-checkin");
  const checkOutInput = document.getElementById("filter-checkout");
  const priceSlider = document.getElementById("price-slider");
  const minPriceEl = document.getElementById('min-price');
  const maxPriceEl = document.getElementById('max-price');

  if (hotelsContainer) hotelsContainer.style.display = "none";
  if (roomResults) {
    roomResults.innerHTML = "";
    roomResults.style.display = "none";
  }

  fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`)
    .then(res => res.json())
    .then(data => {
      allRooms = data.rooms || [];
      console.log("მოიძებნა ოთახები:", allRooms.length);
      setupRoomTypeOptions(allRooms, roomTypeSelect);
      filterRooms(); 
    })
    .catch(err => {
      console.error("Fetch შეცდომა:", err);
      allRooms = [];
      filterRooms();
    });

  const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};
  const guestCount = savedFilters.guestCount || 1;
  if (adultSelect) adultSelect.value = guestCount;
  if (guestsInput) guestsInput.value = guestCount;
  console.log("სტუმრების რაოდენობა:", guestCount);

  if (priceSlider && !priceSlider.noUiSlider) {
    noUiSlider.create(priceSlider, {
      start: [0, 1000],
      connect: true,
      range: { min: 0, max: 1000 },
      step: 10
    });

    priceSlider.noUiSlider.on('update', (values) => {
      minPriceEl.textContent = Math.round(values[0]);
      maxPriceEl.textContent = Math.round(values[1]);
    });

    priceSlider.noUiSlider.on('change', () => {
      console.log("Price slider შეიცვალა:", minPriceEl.textContent, maxPriceEl.textContent);
      filterRooms();
    });
  }


  document.getElementById("filter-btn").addEventListener("click", filterRooms);
  if (adultSelect) adultSelect.addEventListener("change", () => {
    console.log("AdultSelect შეიცვალა:", adultSelect.value);
    filterRooms();
  });
  if (guestsInput) guestsInput.addEventListener("change", () => {
    console.log("GuestsInput შეიცვალა:", guestsInput.value);
    filterRooms();
  });
  if (checkInInput) checkInInput.addEventListener("change", () => {
    console.log("Check-in შეიცვალა:", checkInInput.value);
    filterRooms();
  });
  if (checkOutInput) checkOutInput.addEventListener("change", () => {
    console.log("Check-out შეიცვალა:", checkOutInput.value);
    filterRooms();
  });
  if (roomTypeSelect) {
    roomTypeSelect.addEventListener("change", e => {
      selectedRoomType = e.target.value || null;
      console.log("Room type შეიცვალა:", selectedRoomType);
      filterRooms();
    });
  }
});

function filterRooms() {
  currentRenderToken++;
  const token = currentRenderToken;

  const minPrice = Number(document.getElementById("min-price").textContent) || 0;
  const maxPrice = Number(document.getElementById("max-price").textContent) || Infinity;
  const guests = Number(document.getElementById("adultSelect").value) || 1;
  const checkIn = document.getElementById("filter-checkin").value;
  const checkOut = document.getElementById("filter-checkout").value;

  console.log("ფილტრაციის პარამეტრები:", { minPrice, maxPrice, guests, selectedRoomType, checkIn, checkOut });

  const filtered = allRooms.filter(room => {
    if (selectedRoomType && room.roomTypeId != selectedRoomType) return false;
    if (room.pricePerNight < minPrice || room.pricePerNight > maxPrice) return false;
    if (room.maxGuests < guests) return false;



    return true;
  });

  console.log("გადარჩენილი ოთახების რაოდენობა:", filtered.length);

  renderRooms(filtered, token);
}

function renderRooms(rooms, token) {
  if (token !== currentRenderToken) {
    console.log("Render token არ ემთხვევა, render გამოტოვებულია");
    return;
  }
  const container = document.getElementById("roomsContainer");
  if (!container) {
    console.log("roomsContainer ვერ მოიძებნა");
    return;
  }
  container.innerHTML = "";

  if (!rooms.length) {
    console.log("ოთახები ვერ მოიძებნა ფილტრაციის შედეგად");
    container.innerHTML = "";
    return;
  }

  rooms.forEach(room => {
    const imgSrc = room.images?.[0]?.source || "https://via.placeholder.com/300x200";
    const card = document.createElement("div");
    card.classList.add("card-container");

    card.innerHTML = `
      <div class="card" style="position: relative;">
        <img src="${imgSrc}" alt="${room.name}" class="img">
        <div class="card1">
          <h3>${room.name}</h3>
          <div class="cardbody">
            <p class="euro"> &euro; ${room.pricePerNight} </p>
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
    cardDiv.addEventListener("mouseenter", () => bookBtn.style.display = "block");
    cardDiv.addEventListener("mouseleave", () => bookBtn.style.display = "none");

    container.appendChild(card);
  });
}

function setupRoomTypeOptions(rooms, selectElement) {
  if (!selectElement) return;
  const types = [...new Set(rooms.map(r => r.roomTypeId))];
  selectElement.innerHTML = `<option value="">ყველა ტიპი</option>`;
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type; 
    selectElement.appendChild(option);
  });
  console.log("Room type dropdown აგენერირდა:", types);
}
































































