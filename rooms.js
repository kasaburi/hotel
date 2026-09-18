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




if (hamburger) {

  hamburger.addEventListener("click", () => {
    hamburger.style.display = "none";
    overlay.classList.add("active");

  });

}



const mobileLogin =document.getElementById("mobileLogin");
const desktopLogin =document.getElementById("btnLoginRegister");
const authPopup =document.getElementById("authPopup");

const btnClose =document.getElementById("btnClose");
function openAuthPopup() {
  if (authPopup) {authPopup.classList.add("active");}}


if (desktopLogin) {
  desktopLogin.addEventListener("click", openAuthPopup );

}


if (mobileLogin) {

  mobileLogin.addEventListener(
    "click",
    () => {

      overlay.classList.remove("active");
      if (hamburger) {
        hamburger.style.display = "block";
      }
      openAuthPopup();

    }
  );
}



if (btnClose) {

  btnClose.addEventListener(
    "click",
    () => {authPopup.classList.remove("active"); });

}







  flatpickr("#filter-checkout", {
    dateFormat: "Y-m-d",
    disableMobile: true,
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      },
    }
  });
 
  flatpickr("#filter-checkin", {
    dateFormat: "Y-m-d",
    disableMobile: true,
    locale: {
      firstDayOfWeek: 1,
        weekdays: {
        shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
  console.warn("allRooms is empty or has not loaded yet.");
}

  });
}












let allRooms = [];
let currentRenderToken = 0;
const ROOMS_PER_PAGE = 10;
let currentPage = 1;


const API_BASE ="https://hotel-backend-qeue.onrender.com";
const ROOMS_API = `${API_BASE}/api/Rooms/GetAll`;



document.addEventListener(
    "DOMContentLoaded",
    () => {
        const params = new URLSearchParams(window.location.search );
        const hotelIdParam =params.get("hotelId");
        const hotelId =hotelIdParam !== null? Number(hotelIdParam): null;
        console.log("hotelId:", hotelId);
        const hotelsContainer =document.getElementById( "hotels" );
        const roomResults =document.getElementById( "roomResults" );
        const adultSelect =document.getElementById( "adultSelect" );
        const guestsInput =document.getElementById("guestsInput" );
        const roomTypeSelect =document.getElementById( "filter-room-type" );
        const priceSlider =document.getElementById("price-slider" )
        const minPriceEl =document.getElementById( "min-price");
        const maxPriceEl =document.getElementById("max-price");
        const filterBtn =document.getElementById( "filter-btn" );
        const roomNameInput = document.getElementById( "roomNameInput" );

        if (hotelsContainer) { hotelsContainer.style.display = "none"; }
        if (roomResults) {roomResults.innerHTML =  ""; }

        let savedFilters = {};
        try {
            savedFilters = JSON.parse(localStorage.getItem( "filters" ) ) || {}; } catch (error) {
            console.warn("filters localStorage ვერ წაიკითხა" ); }
          const guestCount = Number(savedFilters.guestCount ) || 1;
        if (adultSelect) { adultSelect.value =guestCount; }
        if (guestsInput) {guestsInput.value =guestCount;}

        if (
            priceSlider &&  typeof noUiSlider !=="undefined" && !priceSlider.noUiSlider ) {
            noUiSlider.create( priceSlider, {
                    start: [
                        0,
                        1000
                    ],
                    connect: true,
                    range: {
                        min: 0,
                        max: 1000
                    },
                    step: 10});
            priceSlider.noUiSlider.on("update", values => {
                    if (minPriceEl) { minPriceEl.textContent =Math.round( Number(values[0]) );}
                    if (maxPriceEl) { maxPriceEl.textContent =
                            Math.round( Number(values[1]));}} );
            priceSlider.noUiSlider.on( "change",() => {
                    currentPage = 1;
                    filterRooms(); } );}
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener( "change", () => {
                    currentPage = 1;
                    filterRooms(); });}

        if (adultSelect) {adultSelect.addEventListener( "change", () => {
                    currentPage = 1;
                    filterRooms();
                } ); }

        if (guestsInput) {
            guestsInput.addEventListener("input",() => {
                    currentPage = 1;
                    filterRooms();
                } );}


        if (roomNameInput) {
            roomNameInput.addEventListener( "input",() => {
                    currentPage = 1;
                    filterRooms();
                } );}

        if (filterBtn) {

            filterBtn.addEventListener(
                "click",
                event => {event.preventDefault();
                    currentPage = 1;
                    filterRooms();

                } );
        }

        fetch(ROOMS_API) .then(response => {
                if (!response.ok) {throw new Error( `HTTP error: ${response.status}` ); }
                return response.json(); })

          .then(data => { console.log("Rooms API:", data );
            if (Array.isArray(data)) { allRooms = data;}

            else if (Array.isArray(data.rooms) ) {
            allRooms = data.rooms;}


            else {allRooms = []; }
            console.log("სულ ოთახები:",allRooms.length  );
          
              createRoomTypeOptions( allRooms);
              setupRoomTypeButtons();
              filterRooms();
            })
            .catch(error => {
                console.error(
                    "Error retrieving rooms:",
                    error
                );
            });
    });







function setupRoomTypeButtons() {
    const container =
        document.getElementById("roomTypeContainer");
    if (!container) {
        console.error(
            "❌ roomTypeContainer ვერ მოიძებნა HTML-ში");
        return;
    }
    container.innerHTML = "";


  
    const roomTypes = new Map();
    allRooms.forEach(room => {
      const id =Number(room.roomTypeId);
      const name =String(room.roomTypeName || "" ).trim();

        if ( !isNaN(id) && id > 0 && name !== "" && !roomTypes.has(id) ) {
         roomTypes.set( id,name ); }});
    console.log( "Room Type Buttons:",  [...roomTypes.entries()]);


  
    const allButton =document.createElement("button");
    allButton.type = "button";
    allButton.textContent ="All";
    allButton.classList.add( "room-type-btn","active" );
    allButton.addEventListener("click",  () => {
    selectedRoomType = null;
    currentPage = 1
    document.querySelectorAll( ".room-type-btn"  ) .forEach(button => {button.classList.remove(  "active"); });
    allButton.classList.add( "active" );

    if (roomTypeSelect) {roomTypeSelect.value = ""; }
        filterRooms();});
    container.appendChild( allButton);



    roomTypes.forEach(
        (name, id) => { const button =document.createElement("button");
            button.type = "button";
            button.textContent = name;
            button.classList.add(
                "room-type-btn"
            );
            button.addEventListener("click",() => {selectedRoomType =Number(id);
            currentPage = 1;
            document.querySelectorAll( ".room-type-btn").forEach(button => {
            button.classList.remove("active");  });
                    button.classList.add("active" );
                    if (roomTypeSelect) {
                        roomTypeSelect.value =  String(id);  }
                    filterRooms(); });
                    container.appendChild( button ) } );}



function createRoomTypeOptions(rooms) {

    const select =
        document.getElementById(
            "filter-room-type"
        );


    if (!select) {
        return;
    }


 
    select.innerHTML = "";


  
    const allOption =
        document.createElement(
            "option"
        );


    allOption.value = "";

    allOption.textContent =
        "All rooms";


    select.appendChild(
        allOption
    );


   
    const roomTypes =
        new Map();


    rooms.forEach(room => {

        const id =
            Number(
                room.roomTypeId
            );


        const name =
            String(
                room.roomTypeName || ""
            ).trim();


        if (
            !isNaN(id) &&
            name !== ""
        ) {

            if (
                !roomTypes.has(id)
            ) {

                roomTypes.set(
                    id,
                    name
                );

            }

        }

    });


    // ---------------------------------------------
    // CREATE OPTIONS
    // ---------------------------------------------

    roomTypes.forEach(
        (name, id) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                id;


            option.textContent =
                name;


            select.appendChild(
                option
            );

        }
    );


    console.log(
        "Room Types ბაზიდან:",
        [...roomTypes.entries()]
    );

}


// =====================================================
// FILTER ROOMS
// =====================================================

function filterRooms() {

    // =================================================
    // URL / HOTEL ID
    // =================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const hotelIdParam =
        params.get("hotelId");


    const hotelId =
        hotelIdParam !== null
            ? Number(hotelIdParam)
            : null;


    // =================================================
    // PRICE
    // =================================================

    const minPrice =
        Number(
            document
                .getElementById(
                    "min-price"
                )
                ?.textContent
        ) || 0;


    const maxPriceText =
        document
            .getElementById(
                "max-price"
            )
            ?.textContent;


    const maxPrice =
        maxPriceText !== undefined &&
        maxPriceText !== ""
            ? Number(
                maxPriceText
            )
            : Infinity;


    // =================================================
    // GUESTS
    // =================================================

    const adultSelect =
        document.getElementById(
            "adultSelect"
        );


    const guestsInput =
        document.getElementById(
            "guestsInput"
        );


    const adultGuests =
        Number(
            adultSelect?.value
        ) || 1;


    const inputGuests =
        Number(
            guestsInput?.value
        ) || 0;


    const guests =
        Math.max(
            adultGuests,
            inputGuests
        );


    // =================================================
    // SEARCH
    // =================================================

    const searchInput =
        document.getElementById(
            "roomNameInput"
        );


    const searchText =
        searchInput?.value
            ?.toLowerCase()
            ?.trim() || "";


    // =================================================
    // ROOM TYPE
    // =================================================

    const roomTypeSelect =
        document.getElementById(
            "filter-room-type"
        );


    const roomTypeValue =
        roomTypeSelect?.value || "";


    const selectedRoomType =
        roomTypeValue !== ""
            ? Number(
                roomTypeValue
            )
            : null;


    // =================================================
    // FILTER
    // =================================================

    const filtered =
        allRooms.filter(
            room => {


                // =====================================
                // HOTEL
                // =====================================

                if (
                    hotelId !== null &&
                    Number(
                        room.hotelId
                    ) !== hotelId
                ) {

                    return false;

                }


                // =====================================
                // ROOM TYPE
                // =====================================

                if (
                    selectedRoomType !== null &&
                    Number(
                        room.roomTypeId
                    ) !==
                        selectedRoomType
                ) {

                    return false;

                }


                // =====================================
                // PRICE
                // =====================================

                const price =
                    Number(
                        room.pricePerNight
                    );


                if (
                    isNaN(price)
                ) {

                    return false;

                }


                if (
                    price < minPrice
                ) {

                    return false;

                }


                if (
                    price > maxPrice
                ) {

                    return false;

                }


                // =====================================
                // GUESTS
                // =====================================

                const maxGuests =
                    Number(
                        room.maxGuests
                    );


                if (
                    isNaN(maxGuests)
                ) {

                    return false;

                }


                if (
                    maxGuests < guests
                ) {

                    return false;

                }


                // =====================================
                // SEARCH
                // =====================================

                if (
                    searchText !== ""
                ) {

                    const roomName =
                        String(
                            room.name || ""
                        )
                        .toLowerCase();


                    const roomTypeName =
                        String(
                            room.roomTypeName || ""
                        )
                        .toLowerCase();


                    if (
                        !roomName.includes(
                            searchText
                        ) &&
                        !roomTypeName.includes(
                            searchText
                        )
                    ) {

                        return false;

                    }

                }


                // =====================================
                // PASSED
                // =====================================

                return true;

            }
        );


    // =================================================
    // RESET PAGE
    // =================================================

    currentPage = 1;


    // =================================================
    // RENDER
    // =================================================

    console.log(
        "ყველა ოთახი:",
        allRooms.length
    );


    console.log(
        "დაფილტრული:",
        filtered.length
    );


    renderRooms(
        filtered,
        currentRenderToken
    );


    return filtered;

}


// =====================================================
// RESET FILTERS
// =====================================================

function resetFilters() {

    console.log(
        "ფილტრების Reset..."
    );


    // =================================================
    // ROOM TYPE
    // =================================================

    const roomTypeSelect =
        document.getElementById(
            "filter-room-type"
        );


    if (roomTypeSelect) {

        roomTypeSelect.value =
            "";

    }


    // =================================================
    // SEARCH
    // =================================================

    const roomNameInput =
        document.getElementById(
            "roomNameInput"
        );


    if (roomNameInput) {

        roomNameInput.value =
            "";

    }


    // =================================================
    // GUESTS
    // =================================================

    const adultSelect =
        document.getElementById(
            "adultSelect"
        );


    const guestsInput =
        document.getElementById(
            "guestsInput"
        );


    if (adultSelect) {

        adultSelect.value =
            "1";

    }


    if (guestsInput) {

        guestsInput.value =
            "1";

    }


    // =================================================
    // PRICE
    // =================================================

    const priceSlider =
        document.getElementById(
            "price-slider"
        );


    if (
        priceSlider &&
        priceSlider.noUiSlider
    ) {

        priceSlider.noUiSlider.set(
            [0, 1000]
        );

    }


    // =================================================
    // PRICE TEXT
    // =================================================

    const minPriceEl =
        document.getElementById(
            "min-price"
        );


    const maxPriceEl =
        document.getElementById(
            "max-price"
        );


    if (minPriceEl) {

        minPriceEl.textContent =
            "0";

    }


    if (maxPriceEl) {

        maxPriceEl.textContent =
            "1000";

    }


    // =================================================
    // PAGE
    // =================================================

    currentPage = 1;


    // =================================================
    // SHOW ALL ROOMS
    // =================================================

    /*
        Reset-ზე hotelId-ს არ ვშლით.

        ანუ თუ ხარ:

        rooms.html?hotelId=4

        ისევ Radisson-ის ოთახები
        გამოჩნდება ყველა.

        თუ გინდა საერთოდ ყველა სასტუმროს
        ოთახი გამოჩნდეს, ამისთვის URL-დან
        hotelId-ის მოცილებაც შეიძლება.
    */

    renderRooms(
        getRoomsAfterReset(),
        currentRenderToken
    );


    console.log(
        "Reset დასრულდა"
    );

}


// =====================================================
// ROOMS AFTER RESET
// =====================================================

function getRoomsAfterReset() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const hotelIdParam =
        params.get("hotelId");


    // ---------------------------------------------
    // თუ hotelId არსებობს
    // ---------------------------------------------

    if (
        hotelIdParam !== null
    ) {

        const hotelId =
            Number(
                hotelIdParam
            );


        return allRooms.filter(
            room =>
                Number(
                    room.hotelId
                ) === hotelId
        );

    }


    // ---------------------------------------------
    // თუ hotelId არ არსებობს
    // ყველა ოთახი
    // ---------------------------------------------

    return [
        ...allRooms
    ];

}


// =====================================================
// RESET BUTTON
// =====================================================

const resetButton =
    document.getElementById(
        "reset-btn"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            resetFilters();

        }
    );

}






























function renderRooms(
  rooms,
  token
) {

  if (
    token !== currentRenderToken
  ) {

    return;

  }


  const container =
    document.getElementById(
      "roomsContainer"
    );


  if (!container) {

    console.error(
      "❌ roomsContainer ვერ მოიძებნა"
    );

    return;

  }


  container.innerHTML = "";


  // =====================================================
  // NO ROOMS
  // =====================================================

  if (!rooms.length) {

    container.innerHTML = `
      <div class="no-rooms">
        <p>
          ოთახები ვერ მოიძებნა.
        </p>
      </div>
    `;


    renderPagination(0);

    return;

  }


  // =====================================================
  // TOTAL PAGES
  // =====================================================

  const totalPages =
    Math.ceil(
      rooms.length /
      ROOMS_PER_PAGE
    );


  if (
    currentPage > totalPages
  ) {

    currentPage =
      totalPages;

  }


  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const startIndex =
    (currentPage - 1) *
    ROOMS_PER_PAGE;


  const endIndex =
    startIndex +
    ROOMS_PER_PAGE;


  const roomsForCurrentPage =
    rooms.slice(
      startIndex,
      endIndex
    );


  console.log(
    `გვერდი ${currentPage}/${totalPages}`
  );


  console.log(
    "ამ გვერდზე ოთახები:",
    roomsForCurrentPage
  );


  // =====================================================
  // CREATE CARDS
  // =====================================================

  roomsForCurrentPage.forEach(
    room => {


      // =================================================
      // IMAGE
      // =================================================

      const imgSrc =
        room.images?.[0]?.source ||
        room.images?.[0]?.url ||
        room.image ||
        "https://via.placeholder.com/300x200";


      // =================================================
      // CARD
      // =================================================

      const card =
        document.createElement(
          "div"
        );


      card.classList.add(
        "card-container"
      );


      // =================================================
      // CARD HTML
      // =================================================

      card.innerHTML = `

        <div
          class="card"
          style="position: relative;"
        >

          <img
            src="${imgSrc}"
            alt="${room.name || "Room"}"
            class="img"
          >


          <div class="card1">

            <h3>
              ${room.name || room.roomTypeName || "Room"}
            </h3>


            <div class="cardbody">

              <p class="euro">
                &euro;
                ${room.pricePerNight}
              </p>


              <p class="night">
                a night
              </p>

            </div>

          </div>


          <button
            class="book-btn1"
            style="
              margin-bottom: 10px;
              display: none;
            "
          >

            <a
              href="./booknow.html?roomId=${room.id}"
              class="bookbtn"
            >
              Book Now
            </a>

          </button>

        </div>

      `;


      // =================================================
      // HOVER BOOK BUTTON
      // =================================================

      const cardDiv =
        card.querySelector(
          ".card"
        );


      const bookBtn =
        card.querySelector(
          ".book-btn1"
        );


      if (
        cardDiv &&
        bookBtn
      ) {


        cardDiv.addEventListener(
          "mouseenter",
          () => {

            bookBtn.style.display =
              "block";

          }
        );


        cardDiv.addEventListener(
          "mouseleave",
          () => {

            bookBtn.style.display =
              "none";

          }
        );

      }


      // =================================================
      // APPEND
      // =================================================

      container.appendChild(
        card
      );

    });


  // =====================================================
  // PAGINATION
  // =====================================================

  renderPagination(
    totalPages
  );

}


// =====================================================
// RERENDER CURRENT PAGE
// =====================================================

function rerenderCurrentPage() {

  const filtered =
    getFilteredRooms();


  currentRenderToken++;


  renderRooms(
    filtered,
    currentRenderToken
  );

}


// =====================================================
// PAGINATION
// =====================================================

// =====================================================
// PAGINATION
// =====================================================

function renderPagination(totalPages, filteredRooms) {

  const pagination =
    document.getElementById("pagination");


  if (!pagination) {

    console.error(
      "❌ pagination ვერ მოიძებნა"
    );

    return;

  }


  pagination.innerHTML = "";


  // ===================================================
  // მხოლოდ ერთი გვერდია
  // ===================================================

  if (totalPages <= 1) {

    pagination.style.display = "none";

    return;

  }


  pagination.style.display = "flex";


  // ===================================================
  // PREVIOUS
  // ===================================================

  const prevBtn =
    document.createElement("button");

  prevBtn.className = "page-btn";

  prevBtn.textContent = "‹";

  prevBtn.disabled =
    currentPage === 1;


  prevBtn.addEventListener(
    "click",
    () => {

      if (currentPage <= 1) {
        return;
      }

      currentPage--;

      renderRooms(
        filteredRooms,
        currentRenderToken
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  pagination.appendChild(
    prevBtn
  );


  // ===================================================
  // PAGE NUMBERS
  // ===================================================

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {

    const pageBtn =
      document.createElement("button");


    pageBtn.className =
      "page-btn";


    pageBtn.textContent =
      page;


    if (
      page === currentPage
    ) {

      pageBtn.classList.add(
        "active"
      );

    }


    pageBtn.addEventListener(
      "click",
      () => {

        if (
          page === currentPage
        ) {

          return;

        }


        currentPage =
          page;


        renderRooms(
          filteredRooms,
          currentRenderToken
        );


        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );


    pagination.appendChild(
      pageBtn
    );

  }


  // ===================================================
  // NEXT
  // ===================================================

  const nextBtn =
    document.createElement("button");


  nextBtn.className =
    "page-btn";


  nextBtn.textContent =
    "›";


  nextBtn.disabled =
    currentPage === totalPages;


  nextBtn.addEventListener(
    "click",
    () => {

      if (
        currentPage >= totalPages
      ) {

        return;

      }


      currentPage++;


      renderRooms(
        filteredRooms,
        currentRenderToken
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  pagination.appendChild(
    nextBtn
  );

}

// =====================================================
// ROOM TYPE OPTIONS
// =====================================================

function setupRoomTypeOptions(
  rooms,
  selectElement
) {

  if (!selectElement) {

    return;

  }


  selectElement.innerHTML = `
    <option value="">
      ყველა ტიპი
    </option>
  `;


  const types =
    new Map();


  rooms.forEach(
    room => {

      const typeId =
        room.roomTypeId;


      if (
        typeId === null ||
        typeId === undefined
      ) {

        return;

      }


      const typeName =
        room.roomTypeName ||
        `ტიპი ${typeId}`;


      if (
        !types.has(
          String(typeId)
        )
      ) {

        types.set(
          String(typeId),
          typeName
        );

      }

    }
  );


  types.forEach(
    (typeName, typeId) => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        typeId;


      option.textContent =
        typeName;


      selectElement.appendChild(
        option
      );

    }
  );


  console.log(
    "Room type dropdown:",
    [...types.values()]
  );

}































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