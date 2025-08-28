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




let section = document.getElementById("section");

function getAll() {
  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
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
      if (section) section.innerHTML = "<p>დატვირთვა ვერ მოხერხდა</p>";
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
          throw new Error("ქალაქების ჩატვირთვა ვერ მოხერხდა");
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
              console.log("არჩეული ქალაქია:", city);
         
            }
          });

          cityContainer.appendChild(cityBtn);
        });
      })
      .catch(error => {
        console.error("შეცდომა:", error);
        cityContainer.innerHTML = "<p style='color:red;'>ქალაქების ჩატვირთვა ვერ მოხერხდა</p>";
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

  localStorage.removeItem("userToken");

  const popup = document.getElementById("authPopup");
  const authContent = document.getElementById("authContent");
  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");
  const btnClose = document.getElementById("btnClose");
  const seeHotelsBtn = document.querySelector(".button1");


  function openPopup(innerHtml) {
    authContent.innerHTML = innerHtml;
    popup.style.display = "flex";
  }


  function closePopup() {
    popup.style.display = "none";
    authContent.innerHTML = "";
  }

  function redirectToHotels() {
    console.log("➡️ გადამისამართება hotel.html–ზე...");
    window.location.href = "./hotel.html";
  }


  function handleProtectedNavigation(source) {
    console.log(" handleProtectedNavigation გამოიძახეს (" + source + ")");
    const token = localStorage.getItem("userToken");
    console.log(" userToken =", token);

    if (token) {
      console.log(" ავტორიზებულია → გადამისამართება მოხდება 2 წამში...");
      setTimeout(() => {
        redirectToHotels();
      }, 2000);
    } else {
      console.log(" არ არის ავტორიზებული → ვაჩვენებ popup-ს");
      openPopup("<p style='font-size:18px; color:red;'>გთხოვთ გაიაროთ ავტორიზაცია hotels გვერდზე გადასასვლელად.</p>");
    }
  }

  
  if (seeHotelsBtn) {
    seeHotelsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(" 'See Hotels' ღილაკზე ჰენდლერი მიებმულა");
      handleProtectedNavigation("See Hotels ღილაკი");
    });
  }

  const navHotelsLink = document.querySelector("a[href='./hotel.html']");
  if (navHotelsLink) {
    navHotelsLink.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("ნავბარის 'Hotels' ლინკზე ჰენდლერი მიებმულა");
      handleProtectedNavigation("Navbar Hotels link");
    });
  }


  



    
  btnLogin.addEventListener("click", () => {
    authContent.innerHTML = '<iframe src="singin.html" style="width:100%; height:400px; border:none;"></iframe>';
    popup.style.display = "flex";
});

    btnRegister.addEventListener("click", () => {
        authContent.innerHTML = '<iframe src="registre.html" style="width:100%; height:400px; border:none;"></iframe>';
        popup.style.display = "flex";
    });












  btnClose.addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => { if (e.target === popup) closePopup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePopup(); });

  window.addEventListener("message", (event) => {
    if (event.data.type === "loginSuccess") {
      localStorage.setItem("userToken", event.data.token);
      if (event.data.userEmail) localStorage.setItem("userEmail", event.data.userEmail);
      closePopup();
      redirectToHotels();
    }
  });
});
