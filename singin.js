// =========================================================
// NAVIGATION / HAMBURGER
// =========================================================

const hamburger =
    document.getElementById("hamburger");

const navLinks =
    document.getElementById("navLinks");


// =========================================================
// MOBILE OVERLAY
// =========================================================

const overlay =
    document.createElement("div");

overlay.classList.add("nav-overlay");

overlay.innerHTML = `
    <a href="./index.html">Home</a>

    <a href="./rooms.html">Rooms</a>

    <a href="./hotel.html">Hotels</a>

    <a href="./bookedrooms.html">Booked Rooms</a>

    <button
        type="button"
        id="mobileLogin"
    >
        Login

        <img
            src="./image/login.svg"
            class="login"
            alt="Login"
        >
    </button>
`;

document.body.appendChild(overlay);


// =========================================================
// AUTH ELEMENTS
// =========================================================

const btnLoginRegister =
    document.getElementById(
        "btnLoginRegister"
    );

const authPopup =
    document.getElementById(
        "authPopup"
    );

const authContent =
    document.getElementById(
        "authContent"
    );

const btnClose =
    document.getElementById(
        "btnClose"
    );


// =========================================================
// TOKEN
// =========================================================

function getToken() {

    return localStorage.getItem(
        "token"
    );

}


// =========================================================
// HAMBURGER OPEN
// =========================================================

if (hamburger) {

    hamburger.addEventListener(
        "click",
        () => {

            hamburger.style.display =
                "none";

            overlay.classList.add(
                "active"
            );

        }
    );

}


// =========================================================
// AUTH POPUP
// =========================================================

function openAuthPopup() {

    if (
        !authPopup ||
        !authContent
    ) {

        console.error(
            "❌ Auth popup ვერ მოიძებნა."
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


    authPopup.style.display =
        "flex";


    // =====================================================
    // AUTHORIZATION
    // =====================================================

    const popupLogin =
        document.getElementById(
            "popupLogin"
        );

    if (popupLogin) {

        popupLogin.addEventListener(
            "click",
            () => {

                window.location.href =
                    "./singin.html";

            }
        );

    }


    // =====================================================
    // REGISTRATION
    // =====================================================

    const popupRegister =
        document.getElementById(
            "popupRegister"
        );

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


    authPopup.style.display =
        "none";


    if (authContent) {

        authContent.innerHTML =
            "";

    }

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    console.log(
        "🚪 Logging out..."
    );


    // Remove authentication data

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "userId"
    );

    localStorage.removeItem(
        "userEmail"
    );


    console.log(
        "✅ Logout successful"
    );


    // Redirect to home

    window.location.href =
        "./index.html";

}


// =========================================================
// UPDATE DESKTOP LOGIN / LOGOUT BUTTON
// =========================================================

function updateAuthButton() {

    if (!btnLoginRegister) {

        console.log(
            "ℹ️ btnLoginRegister ამ გვერდზე არ არის."
        );

        return;

    }


    const token =
        getToken();


    console.log(
        "🔐 Current token:",
        token
    );


    // =====================================================
    // LOGGED IN
    // =====================================================

    if (token) {

        btnLoginRegister.innerHTML = `

            Log Out

            <img
                src="./image/login.svg"
                class="login"
                alt="Log Out"
            >

        `;


        // Remove old event

        btnLoginRegister.onclick =
            null;


        // Add logout

        btnLoginRegister.onclick =
            () => {

                logout();

            };


        console.log(
            "✅ Log Out ღილაკი ჩაიტვირთა."
        );

    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    else {

        btnLoginRegister.innerHTML = `

            Login

            <img
                src="./image/login.svg"
                class="login"
                alt="Login"
            >

        `;


        // Remove old event

        btnLoginRegister.onclick =
            null;


        // Add login popup

        btnLoginRegister.onclick =
            () => {

                openAuthPopup();

            };


        console.log(
            "🔐 Login ღილაკი ჩაიტვირთა."
        );

    }

}


// =========================================================
// UPDATE MOBILE LOGIN / LOGOUT BUTTON
// =========================================================

function updateMobileAuthButton() {

    const mobileLogin =
        document.getElementById(
            "mobileLogin"
        );


    if (!mobileLogin) {
        return;
    }


    const token =
        getToken();


    // =====================================================
    // LOGGED IN
    // =====================================================

    if (token) {

        mobileLogin.innerHTML = `

            Log Out

            <img
                src="./image/login.svg"
                class="login"
                alt="Log Out"
            >

        `;

    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    else {

        mobileLogin.innerHTML = `

            Login

            <img
                src="./image/login.svg"
                class="login"
                alt="Login"
            >

        `;

    }

}


// =========================================================
// MOBILE LOGIN / LOGOUT CLICK
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


        // =================================================
        // LOGGED IN → LOGOUT
        // =================================================

        if (token) {

            logout();

            return;

        }


        // =================================================
        // NOT LOGGED IN → OPEN LOGIN POPUP
        // =================================================

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
// CLOSE AUTH POPUP BUTTON
// =========================================================

if (btnClose) {

    btnClose.addEventListener(
        "click",
        () => {

            closeAuthPopup();

        }
    );

}


// =========================================================
// CLOSE POPUP WHEN CLICKING OUTSIDE
// =========================================================

if (authPopup) {

    authPopup.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                authPopup
            ) {

                closeAuthPopup();

            }

        }
    );

}


// =========================================================
// ESC → CLOSE POPUP
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
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

        // Don't close when clicking Login / Logout

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

updateMobileAuthButton();


// =========================================================
// LOGIN PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "loginForm"
            );

        const errBox =
            document.getElementById(
                "loginError"
            );

        const okBox =
            document.getElementById(
                "loginSuccess"
            );


        // =================================================
        // IF THIS IS NOT LOGIN PAGE
        // =================================================

        if (!form) {

            console.log(
                "ℹ️ loginForm ამ გვერდზე არ არის."
            );

            return;

        }


        // =================================================
        // LOGIN SUBMIT
        // =================================================

        form.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                // =========================================
                // CLEAR OLD MESSAGES
                // =========================================

                if (errBox) {

                    errBox.textContent =
                        "";

                    errBox.style.display =
                        "none";

                }


                if (okBox) {

                    okBox.textContent =
                        "";

                    okBox.style.display =
                        "none";

                }


                // =========================================
                // INPUTS
                // =========================================

                const emailInput =
                    document.getElementById(
                        "email"
                    );

                const passwordInput =
                    document.getElementById(
                        "password"
                    );


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value.trim()
                        : "";


                // =========================================
                // VALIDATION
                // =========================================

                if (
                    !email ||
                    !password
                ) {

                    if (errBox) {

                        errBox.textContent =
                            "შეიყვანე email და password";

                        errBox.style.display =
                            "block";

                    }

                    return;

                }


                // =========================================
                // DISABLE SUBMIT
                // =========================================

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                }


                // =========================================
                // LOGIN REQUEST
                // =========================================

                try {

                    const res =
                        await fetch(
                            "https://hotel-backend-qeue.onrender.com/auth/sign_in",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        {
                                            email:
                                                email,

                                            password:
                                                password
                                        }
                                    )
                            }
                        );


                    // =====================================
                    // RESPONSE
                    // =====================================

                    const data =
                        await res
                            .json()
                            .catch(
                                () => ({})
                            );


                    console.log(
                        "🔐 Login response:",
                        data
                    );


                    // =====================================
                    // LOGIN ERROR
                    // =====================================

                    if (!res.ok) {

                        console.error(
                            "❌ Login error:",
                            data
                        );


                        if (errBox) {

                            errBox.textContent =
                                data.detail ||
                                data.message ||
                                data.error ||
                                "Login failed.";

                            errBox.style.display =
                                "block";

                        }


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                        }


                        return;

                    }


                    // =====================================
                    // TOKEN CHECK
                    // =====================================

                    if (!data.token) {

                        console.error(
                            "❌ Backend-მა token არ დააბრუნა:",
                            data
                        );


                        if (errBox) {

                            errBox.textContent =
                                "Login was successful, but JWT token was not received.";

                            errBox.style.display =
                                "block";

                        }


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                        }


                        return;

                    }


                    // =====================================
                    // SAVE JWT TOKEN
                    // =====================================

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    console.log(
                        "✅ JWT token saved."
                    );


                    // =====================================
                    // SAVE USER ID
                    // =====================================

                    if (
                        data.userId !==
                        undefined
                    ) {

                        localStorage.setItem(
                            "userId",
                            String(
                                data.userId
                            )
                        );

                    }


                    // =====================================
                    // SAVE USER EMAIL
                    // =====================================

                    localStorage.setItem(
                        "userEmail",
                        data.userEmail ||
                        email
                    );


                    // =====================================
                    // CHECK SAVED TOKEN
                    // =====================================

                    console.log(
                        "🔐 Saved token:",
                        localStorage.getItem(
                            "token"
                        )
                    );


                    // =====================================
                    // SUCCESS MESSAGE
                    // =====================================

                    if (okBox) {

                        okBox.textContent =
                            "You have successfully logged in!";

                        okBox.style.display =
                            "block";

                    }


                    // =====================================
                    // REDIRECT AFTER SUCCESS
                    // =====================================

                    setTimeout(
                        () => {

                            window.location.href =
                                "./bookedrooms.html";

                        },
                        700
                    );

                }


                // =========================================
                // NETWORK ERROR
                // =========================================

                catch (err) {

                    console.error(
                        "❌ Network error:",
                        err
                    );


                    if (errBox) {

                        errBox.textContent =
                            "Network problem, try again.";

                        errBox.style.display =
                            "block";

                    }


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                    }

                }

            }
        );

    }
);


// =========================================================
// BOOKED ROOMS / BOOKING SECTION
// =========================================================

const citiesContainer =
    document.getElementById(
        "city"
    );

const container =
    document.getElementById(
        "container"
    );

const statusDiv =
    document.getElementById(
        "status"
    );


const API_BASE =
    "https://hotel-backend-qeue.onrender.com";


const HOTELS_API =
    `${API_BASE}/api/hotels`;


const BOOKINGS_API =
    `${API_BASE}/api/Booking`;


const HOTEL_PLACEHOLDER =
    "https://via.placeholder.com/100x60?text=No+Hotel+Image";


const ROOM_PLACEHOLDER =
    "https://via.placeholder.com/80x60?text=No+Room+Image";


// =========================================================
// TOKEN HELPERS
// =========================================================

function getBookingToken() {

    return localStorage.getItem(
        "token"
    );

}


function getAuthHeaders() {

    const token =
        getBookingToken();


    if (!token) {

        console.error(
            "❌ JWT token not found."
        );


        return {
            "Content-Type":
                "application/json"
        };

    }


    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


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


    const data =
        await response
            .json()
            .catch(
                () => ({})
            );


    if (!response.ok) {

        throw new Error(
            data.detail ||
            data.message ||
            "Request failed."
        );

    }


    return data;

}


// =========================================================
// FETCH BOOKINGS
// =========================================================

async function fetchBookings() {

    const token =
        getBookingToken();


    if (!token) {

        throw new Error(
            "გთხოვთ თავიდან გაიაროთ Login."
        );

    }


    const response =
        await fetch(
            BOOKINGS_API,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


    if (response.status === 401) {

        localStorage.removeItem(
            "token"
        );

        throw new Error(
            "ავტორიზაცია ვადაგასულია. გთხოვთ თავიდან გაიაროთ Login."
        );

    }


    const data =
        await response
            .json()
            .catch(
                () => ({})
            );


    if (!response.ok) {

        throw new Error(
            data.detail ||
            data.message ||
            "Booking data ვერ ჩაიტვირთა."
        );

    }


    if (Array.isArray(data)) {

        return data;

    }


    if (
        data &&
        Array.isArray(
            data.bookings
        )
    ) {

        return data.bookings;

    }


    return [];

}


// =========================================================
// FORMAT PRICE
// =========================================================

function formatPrice(price) {

    const number =
        Number(price);


    if (
        Number.isNaN(
            number
        )
    ) {

        return "0 ₾";

    }


    return `${number} ₾`;

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
    dateStr
) {

    if (!dateStr) {

        return "-";

    }


    const date =
        new Date(
            dateStr
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "ka-GE"
    );

}


// =========================================================
// IMAGE URL
// =========================================================

function getImageUrl(
    image
) {

    if (!image) {
        return null;
    }


    if (
        typeof image !==
        "string"
    ) {

        return null;

    }


    if (
        image.startsWith(
            "http://"
        ) ||
        image.startsWith(
            "https://"
        )
    ) {

        return image;

    }


    return image;

}


// =========================================================
// HOTEL CELL
// =========================================================

function renderHotelCell(
    hotel
) {

    if (!hotel) {

        return `
            <div class="hotel-cell">
                <span>No hotel information</span>
            </div>
        `;

    }


    const image =
        getImageUrl(
            hotel.featuredImage ||
            hotel.image ||
            hotel.imageUrl
        ) ||
        HOTEL_PLACEHOLDER;


    const name =
        hotel.name ||
        hotel.hotelName ||
        "Unknown hotel";


    const city =
        hotel.city ||
        hotel.location ||
        "";


    return `

        <div class="hotel-cell">

            <img
                src="${image}"
                alt="${name}"
                class="hotel-image"
                onerror="
                    this.src='${HOTEL_PLACEHOLDER}'
                "
            >

            <div>

                <strong>
                    ${name}
                </strong>

                ${
                    city
                        ? `<small>${city}</small>`
                        : ""
                }

            </div>

        </div>

    `;

}


// =========================================================
// ROOM CELL
// =========================================================

function renderRoomCell(
    room
) {

    if (!room) {

        return `
            <div class="room-cell">
                <span>No room information</span>
            </div>
        `;

    }


    const image =
        getImageUrl(
            room.image ||
            room.imageUrl ||
            room.featuredImage
        ) ||
        ROOM_PLACEHOLDER;


    const name =
        room.roomTypeName ||
        room.roomType ||
        room.name ||
        "Unknown room";


    const price =
        room.pricePerNight ||
        room.price ||
        room.price_per_night ||
        "";


    return `

        <div class="room-cell">

            <img
                src="${image}"
                alt="${name}"
                class="room-image"
                onerror="
                    this.src='${ROOM_PLACEHOLDER}'
                "
            >

            <div>

                <strong>
                    ${name}
                </strong>

                ${
                    price !== ""
                        ? `<small>${formatPrice(price)} / night</small>`
                        : ""
                }

            </div>

        </div>

    `;

}


// =========================================================
// CREATE HOTEL FROM BOOKING
// =========================================================

function createHotelFromBooking(
    booking
) {

    return {

        id:
            booking.hotelId ||
            booking.hotel_id ||
            booking.hotel?.id,

        name:
            booking.hotelName ||
            booking.hotel?.name ||
            "Unknown hotel",

        city:
            booking.city ||
            booking.hotel?.city ||
            booking.hotelCity ||
            "",

        featuredImage:
            booking.hotelImage ||
            booking.hotel?.featuredImage ||
            booking.hotel?.image ||
            booking.hotel?.imageUrl ||
            null

    };

}


// =========================================================
// CREATE ROOM FROM BOOKING
// =========================================================

function createRoomFromBooking(
    booking
) {

    return {

        id:
            booking.roomId ||
            booking.room_id ||
            booking.room?.id,

        roomTypeName:
            booking.roomTypeName ||
            booking.room?.roomTypeName ||
            booking.roomType ||
            booking.room?.roomType ||
            booking.room?.name ||
            "Unknown room",

        pricePerNight:
            booking.pricePerNight ||
            booking.room?.pricePerNight ||
            booking.price ||
            booking.room?.price ||
            "",

        image:
            booking.roomImage ||
            booking.room?.image ||
            booking.room?.imageUrl ||
            null

    };

}


// =========================================================
// BOOKING STATUS
// =========================================================

function getBookingStatus(
    booking
) {

    const status =
        String(
            booking.status ||
            booking.bookingStatus ||
            ""
        )
        .toLowerCase();


    if (
        status.includes(
            "cancel"
        )
    ) {

        return "Cancelled";

    }


    if (
        status.includes(
            "confirm"
        )
    ) {

        return "Confirmed";

    }


    if (
        status.includes(
            "book"
        )
    ) {

        return "Booked";

    }


    if (
        status.includes(
            "pending"
        )
    ) {

        return "Pending";

    }


    return (
        booking.status ||
        "Pending"
    );

}


// =========================================================
// CONFIRM POPUP
// =========================================================

function showConfirmPopup(
    message,
    subMessage,
    bookingId,
    callback
) {

    const oldPopup =
        document.getElementById(
            "confirm-popup"
        );


    if (oldPopup) {

        oldPopup.remove();

    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "confirm-popup";


    popup.className =
        "popup-overlay";


    popup.innerHTML = `

        <div class="popup-box">

            <div class="popup-content">

                <h3>
                    ${message}
                </h3>

                <p>
                    ${subMessage}
                </p>

                <div class="popup-buttons">

                    <button
                        type="button"
                        class="popup-btn confirm"
                        id="confirmCancel"
                    >
                        Yes
                    </button>

                    <button
                        type="button"
                        class="popup-btn cancel"
                        id="cancelPopup"
                    >
                        No
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    const confirmButton =
        document.getElementById(
            "confirmCancel"
        );

    const cancelButton =
        document.getElementById(
            "cancelPopup"
        );


    // =====================================================
    // CONFIRM CANCELLATION
    // =====================================================

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            async () => {

                try {

                    const token =
                        getBookingToken();


                    if (!token) {

                        throw new Error(
                            "გთხოვთ თავიდან გაიაროთ Login."
                        );

                    }


                    const response =
                        await fetch(
                            `${BOOKINGS_API}/${bookingId}`,
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


                    const data =
                        await response
                            .json()
                            .catch(
                                () => ({})
                            );


                    if (!response.ok) {

                        throw new Error(
                            data.detail ||
                            data.message ||
                            "Reservation cancellation failed."
                        );

                    }


                    popup.remove();


                    showConfirmPopup(
                        "Reservation cancelled",
                        "The reservation has been cancelled successfully.",
                        null,
                        null
                    );


                    const successPopup =
                        document.getElementById(
                            "confirm-popup"
                        );


                    if (
                        successPopup
                    ) {

                        const buttons =
                            successPopup.querySelector(
                                ".popup-buttons"
                            );


                        if (buttons) {

                            buttons.innerHTML = `

                                <button
                                    type="button"
                                    class="popup-btn confirm"
                                    id="successClose"
                                >
                                    OK
                                </button>

                            `;

                        }


                        const successClose =
                            document.getElementById(
                                "successClose"
                            );


                        if (successClose) {

                            successClose.addEventListener(
                                "click",
                                () => {

                                    successPopup.remove();


                                    if (
                                        typeof callback ===
                                        "function"
                                    ) {

                                        callback();

                                    }

                                }
                            );

                        }

                    }

                }
                catch (error) {

                    console.error(
                        "Cancellation error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Reservation cancellation failed."
                    );

                }

            }
        );

    }


    // =====================================================
    // CLOSE
    // =====================================================

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                popup.remove();

            }
        );

    }

}


// =========================================================
// CANCEL BOOKING
// =========================================================

function cancelBooking(
    bookingId
) {

    if (!bookingId) {

        console.error(
            "Booking ID ვერ მოიძებნა."
        );

        return;

    }


    showConfirmPopup(
        "Cancel reservation?",
        "Are you sure you want to cancel this reservation?",
        bookingId,
        () => {

            loadBookings();

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


        // ================================================
        // TRY HOTEL CITIES ENDPOINT
        // ================================================

        try {

            const data =
                await fetchData(
                    `${HOTELS_API}/GetCities`
                );


            if (
                Array.isArray(
                    data
                )
            ) {

                cities = data;

            }
            else if (
                data &&
                Array.isArray(
                    data.cities
                )
            ) {

                cities =
                    data.cities;

            }

        }
        catch (error) {

            console.log(
                "GetCities unavailable. Getting cities from bookings..."
            );

        }


        // ================================================
        // FALLBACK → BOOKINGS
        // ================================================

        if (
            !cities.length
        ) {

            const bookings =
                await fetchBookings();


            cities = [
                ...new Set(

                    bookings
                        .map(
                            booking =>
                                booking.city ||
                                booking.hotel?.city ||
                                booking.hotelCity
                        )
                        .filter(Boolean)

                )
            ];

        }


        // ================================================
        // RENDER CITIES
        // ================================================

        citiesContainer.innerHTML =
            "";


        const allButton =
            document.createElement(
                "div"
            );


        allButton.className =
            "city-item active";


        allButton.textContent =
            "All";


        allButton.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".city-item"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                allButton.classList.add(
                    "active"
                );


                loadBookings();

            }
        );


        citiesContainer.appendChild(
            allButton
        );


        cities.forEach(
            city => {

                const cityButton =
                    document.createElement(
                        "div"
                    );


                cityButton.className =
                    "city-item";


                cityButton.textContent =
                    city;


                cityButton.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".city-item"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        cityButton.classList.add(
                            "active"
                        );


                        loadBookings(
                            city
                        );

                    }
                );


                citiesContainer.appendChild(
                    cityButton
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Cities error:",
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


    if (statusDiv) {

        statusDiv.textContent =
            "Loading...";

    }


    try {

        const bookings =
            await fetchBookings();


        // ================================================
        // FILTER
        // ================================================

        const filteredBookings =
            filterCity
                ? bookings.filter(
                    booking => {

                        const city =
                            booking.city ||
                            booking.hotel?.city ||
                            booking.hotelCity ||
                            "";


                        return (
                            String(city)
                                .toLowerCase() ===
                            String(filterCity)
                                .toLowerCase()
                        );

                    }
                )
                : bookings;


        // ================================================
        // EMPTY
        // ================================================

        if (
            !filteredBookings.length
        ) {

            container.innerHTML = `
                <div class="no-data">
                    No data found.
                </div>
            `;


            if (statusDiv) {

                statusDiv.textContent =
                    "";

            }


            return;

        }


        // ================================================
        // TABLE
        // ================================================

        let html = `

            <table class="booking-table">

                <thead>

                    <tr>

                        <th>
                            Hotel
                        </th>

                        <th>
                            Room
                        </th>

                        <th>
                            Customer
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Check in
                        </th>

                        <th>
                            Check out
                        </th>

                        <th>
                            Total Price
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

        `;


        // ================================================
        // ROWS
        // ================================================

        filteredBookings.forEach(
            booking => {

                const hotel =
                    createHotelFromBooking(
                        booking
                    );


                const room =
                    createRoomFromBooking(
                        booking
                    );


                const bookingId =
                    booking.id ||
                    booking.bookingId ||
                    booking.booking_id;


                const customerName =
                    booking.customerName ||
                    booking.customer_name ||
                    booking.name ||
                    booking.user?.name ||
                    "Unknown";


                const checkIn =
                    booking.checkIn ||
                    booking.check_in ||
                    booking.fromDate ||
                    booking.startDate ||
                    booking.start_date;


                const checkOut =
                    booking.checkOut ||
                    booking.check_out ||
                    booking.toDate ||
                    booking.endDate ||
                    booking.end_date;


                const totalPrice =
                    booking.totalPrice ||
                    booking.total_price ||
                    booking.price ||
                    0;


                const status =
                    getBookingStatus(
                        booking
                    );


                html += `

                    <tr>

                        <td>
                            ${renderHotelCell(
                                hotel
                            )}
                        </td>

                        <td>
                            ${renderRoomCell(
                                room
                            )}
                        </td>

                        <td>
                            ${customerName}
                        </td>

                        <td>
                            ${status}
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

                        <td>

                            <button
                                type="button"
                                class="cancel-booking"
                                data-booking-id="${bookingId}"
                            >
                                Cancel
                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            html;


        // ================================================
        // CANCEL BUTTONS
        // ================================================

        container
            .querySelectorAll(
                ".cancel-booking"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const bookingId =
                                button.dataset
                                    .bookingId;


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

    }
    catch (error) {

        console.error(
            "❌ Booking loading error:",
            error
        );


        if (statusDiv) {

            statusDiv.textContent =
                error.message;

        }


        container.innerHTML = `
            <div class="error-message">
                ${error.message}
            </div>
        `;

    }

}


// =========================================================
// INITIAL BOOKING LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCities();

        loadBookings();

    }
);