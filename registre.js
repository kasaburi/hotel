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








document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const form = document.getElementById("signupForm");

    const errBox =
        document.getElementById("formError");

    const okBox =
        document.getElementById("formSuccess");

    const phoneInput =
        document.getElementById("phone");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const showPassword =
        document.getElementById("showPassword");


    // =====================================================
    // CHECK FORM
    // =====================================================

    if (!form) {
        console.error("signupForm ვერ მოიძებნა.");
        return;
    }


    // =====================================================
    // PHONE VALIDATION
    // Format: +995XXXXXXXXX
    // =====================================================

    if (phoneInput) {

        phoneInput.addEventListener("input", () => {

            const phonePattern =
                /^\+995\d{9}$/;

            if (
                !phonePattern.test(
                    phoneInput.value.trim()
                )
            ) {

                phoneInput.setCustomValidity(
                    "Please enter the number in the correct format: +995XXXXXXXXX"
                );

            } else {

                phoneInput.setCustomValidity("");

            }

        });

    }


    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    if (emailInput) {

        emailInput.addEventListener("input", () => {

            if (emailInput.validity.valueMissing) {

                emailInput.setCustomValidity(
                    "Please enter your email address."
                );

            } else if (
                emailInput.validity.typeMismatch
            ) {

                emailInput.setCustomValidity(
                    "Please enter a valid email address."
                );

            } else {

                emailInput.setCustomValidity("");

            }

        });

    }


    // =====================================================
    // SHOW / HIDE PASSWORD
    // =====================================================

    if (showPassword && passwordInput) {

        showPassword.addEventListener(
            "change",
            () => {

                passwordInput.type =
                    showPassword.checked
                        ? "text"
                        : "password";

            }
        );

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // =================================================
            // CLEAR MESSAGES
            // =================================================

           if (okBox) {
    okBox.textContent =
        "You have successfully logged in!";

    okBox.style.display = "block";
}


setTimeout(() => {
    window.location.href = "./bookedrooms.html";
}, 500);

            // =================================================
            // VALIDATE FORM
            // =================================================

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                firstName:
                    form.firstName.value.trim(),

                lastName:
                    form.lastName.value.trim(),

                age:
                    Number(form.age.value),

                email:
                    form.email.value.trim(),

                password:
                    form.password.value,

                address:
                    form.address.value.trim(),

                phone:
                    form.phone.value.trim(),

             

                gender:
                    form.gender.value

            };


            console.log(
                "Request payload:",
                payload
            );


            // =================================================
            // API REQUEST
            // =================================================

            try {

                const res = await fetch(
                    "https://hotel-backend-qeue.onrender.com/auth/sign_up",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "*/*"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );


                // =============================================
                // RESPONSE
                // =============================================

                const data =
                    await res.json()
                        .catch(() => ({}));


                console.log(
                    "Response status:",
                    res.status
                );

                console.log(
                    "Response data:",
                    data
                );


                // =============================================
                // ERROR
                // =============================================

                if (!res.ok) {

                    if (res.status === 409) {

                        errBox.textContent =
                            "This email address is already in use.";

                    } else {

                        errBox.textContent =
                            data.detail ||
                            data.message ||
                            data.error ||
                            `Could not register (HTTP ${res.status})`;

                    }


                    errBox.style.display =
                        "block";

                    return;

                }


                // =============================================
                // CHECK TOKEN
                // =============================================

                if (!data.token) {

                    console.error(
                        "Registration successful, but token is missing:",
                        data
                    );

                    errBox.textContent =
                        "Registration successful, but JWT token was not received.";

                    errBox.style.display =
                        "block";

                    return;

                }


                // =============================================
                // SAVE JWT TOKEN
                // IMPORTANT:
                // use "token", not "userToken"
                // =============================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // =============================================
                // SAVE USER ID
                // =============================================

                if (
                    data.userId !== undefined &&
                    data.userId !== null
                ) {

                    localStorage.setItem(
                        "userId",
                        String(data.userId)
                    );

                }


                // =============================================
                // SAVE EMAIL
                // =============================================

                localStorage.setItem(
                    "userEmail",
                    data.userEmail ||
                    payload.email
                );


                // =============================================
                // SUCCESS MESSAGE
                // =============================================

                okBox.textContent =
                    "You have successfully registered!";

                okBox.style.display =
                    "block";


                // =============================================
                // SEND LOGIN SUCCESS TO PARENT
                // =============================================

                window.parent.postMessage(
                    {
                        type:
                            "loginSuccess",

                        token:
                            data.token,

                        userId:
                            data.userId,

                        userEmail:
                            data.userEmail ||
                            payload.email
                    },
                    "*"
                );


                // =============================================
                // RESET FORM
                // =============================================

                form.reset();


                // =============================================
                // OPTIONAL REDIRECT
                // =============================================

                // თუ რეგისტრაციის შემდეგ პირდაპირ
                // bookedrooms.html-ზე გადასვლა გინდა,
                // ქვემოთ მოხსენი კომენტარი:
                //
                // setTimeout(() => {
                //     window.location.href =
                //         "./bookedrooms.html";
                // }, 1000);


            } catch (err) {

                console.error(
                    "Network/CORS error:",
                    err
                );


                errBox.textContent =
                    "Failed to register (network or CORS problem).";

                errBox.style.display =
                    "block";

            }

        }
    );

});














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