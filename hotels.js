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









let citiesContainer = document.querySelector(".sity");
let container = document.getElementById('hotels');


async function fetchData(url) {
  let response = await fetch(url);
  if (!response.ok) throw new Error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
  return await response.json();
}

async function fetchHotelsByCity(city) {
  const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotels?city=${city}`);
  if (!response.ok) {
    throw new Error(`სასტუმროები ვერ ჩაიტვირთა ${city} -თვის`);
  }
  return await response.json();
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

if (hotelId) {
  fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`)
    .then(res => res.json())
    .then(data => {
      renderRooms(data.rooms); 
    })
    .catch(err => console.error("შეცდომა:", err));
}







