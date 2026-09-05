



// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("signupForm");
//   const errBox = document.getElementById("formError");
//   const okBox  = document.getElementById("formSuccess");
//   const phoneInput = document.getElementById("phone");
//   const emailInput = document.getElementById("email");
//   const passwordInput = document.getElementById("password");
//   const showPassword = document.getElementById("showPassword");


//   phoneInput.addEventListener("input", () => {
//     const phonePattern = /^\+995\d{9}$/; 
//     if (!phonePattern.test(phoneInput.value.trim())) {
//       phoneInput.setCustomValidity("Please enter the number in the correct format.: +995XXXXXXXXX");
//     } else {
//       phoneInput.setCustomValidity("");
//     }
//   });


//   emailInput.addEventListener("input", () => {
//     if (emailInput.validity.valueMissing) {
//       emailInput.setCustomValidity("Please enter your email address.");
//     } else if (emailInput.validity.typeMismatch) {
//       emailInput.setCustomValidity("Please enter a valid email address. (მაგ: user@example.com)");
//     } else {
//       emailInput.setCustomValidity("");
//     }
//   });

//   showPassword.addEventListener("change", () => {
//     passwordInput.type = showPassword.checked ? "text" : "password";
//   });

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     errBox.style.display = "none";
//     okBox.style.display  = "none";
//     errBox.textContent = "";
//     okBox.textContent  = "";

//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }

//     const payload = {
//       firstName: form.firstName.value.trim(),
//       lastName:  form.lastName.value.trim(),
//       age:       Number(form.age.value),
//       email:     form.email.value.trim(),
//       password:  form.password.value,
//       address:   form.address.value.trim(),
//       phone:     form.phone.value.trim(),
//       zipcode:   form.zipcode.value.trim(),
//       avatar:    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane",
//       gender:    form.gender.value,
//     };

//     try {
//       console.log(" Request payload:", payload);

//       const res = await fetch("https://hotel-backend-qeue.onrender.com/auth/sign_up", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "accept": "*/*" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       console.log(" Response status:", res.status, "data:", data);

//       if (!res.ok) {
//         if (res.status === 409) {
//           errBox.textContent = "This email address is already in use.";
//         } else {
//           errBox.textContent = data.message || data.error || `Could not register (HTTP ${res.status})`;
//         }
//         errBox.style.display = "block";
//         return;
//       }

//       okBox.textContent = " You have successfully registered.!";
//       okBox.style.display = "block";

//       if (data.token && data.userId) {
//         localStorage.setItem("userToken", data.token);
//         localStorage.setItem("userId", data.userId);

//      window.parent.postMessage({
//   type: "loginSuccess",
//   token: data.token,
//   userId: data.userId,
//   userEmail: email
// }, "*")}

//       form.reset();

//     } catch (err) {
//       console.error(" Network/CORS error:", err);
//       errBox.textContent = "Failed to register (network or CORS problem)";
//       errBox.style.display = "block";
//     }
//   });
// });




















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

            if (errBox) {

                errBox.style.display =
                    "none";

                errBox.textContent =
                    "";

            }

            if (okBox) {

                okBox.style.display =
                    "none";

                okBox.textContent =
                    "";

            }


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

