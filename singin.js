

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("loginForm");
//     const errBox = document.getElementById("loginError");
//     const okBox  = document.getElementById("loginSuccess");

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         errBox.style.display = okBox.style.display = "none";
//         errBox.textContent = okBox.textContent = "";

//         const email = document.getElementById("email").value.trim();
//         const password = document.getElementById("password").value.trim();

//         if (!email || !password) {
//             return alert("შეიყვანე email და password");
//         }

//         try {
//             const res = await fetch("https://hotel-backend-qeue.onrender.com/auth/sign_in", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password })
//             });

//             const data = await res.json().catch(() => ({}));

//             if (!res.ok) {
//                 errBox.textContent = data.message || data.error || "Login failed.";
//                 errBox.style.display = "block";
//                 return;
//             }

//             okBox.textContent = "You have successfully logged in. !";
//             okBox.style.display = "block";

//             if (data.token && data.userId) {
//                 window.parent.postMessage({
//                     type: "loginSuccess",
//                     token: data.token,
//                     userId: data.userId,
//                     userEmail: email
//                 }, "*");
//             }

//         } catch (err) {
//             errBox.textContent = "Network problem, try again.";
//             errBox.style.display = "block";
//         }
//     });
// })














// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("loginForm");
//     const errBox = document.getElementById("loginError");
//     const okBox  = document.getElementById("loginSuccess");

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         errBox.style.display = okBox.style.display = "none";
//         errBox.textContent = okBox.textContent = "";

//         const email = document.getElementById("email").value.trim();
//         const password = document.getElementById("password").value.trim();

//         if (!email || !password) return alert("შეიყვანე email და password");

//         try {
//             // აქ შეგიძლია შენი API–ს სთხოვო, ან მარტივად საჩვენებლად:
//             const fakeToken = "1234567890";
//             const userId = "1";

//             okBox.textContent = " წარმატებით შეხვედი!";
//             okBox.style.display = "block";

//             // გაგზავნა parent page–ში
//             window.parent.postMessage({
//                 type: "loginSuccess",
//                 token: fakeToken,
//                 userId: userId,
//                 userEmail: email
//             }, "*");

//         } catch (err) {
//             errBox.textContent = "პრობლემა, სცადე თავიდან";
//             errBox.style.display = "block";
//         }
//     });
// });




// document.getElementById("loginForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const email = document.getElementById("email").value;
//   const token = "123456"; // სიმულირებული token
//   window.parent.postMessage({
//     type: "loginSuccess",
//     token: token,
//     userEmail: email
//   }, "*");
// });






















document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const errBox = document.getElementById("loginError");
    const okBox = document.getElementById("loginSuccess");

    if (!form) {
        console.error("loginForm ვერ მოიძებნა.");
        return;
    }


    form.addEventListener("submit", async (e) => {

        e.preventDefault();


        // ==============================
        // CLEAR MESSAGES
        // ==============================

        if (errBox) {
            errBox.style.display = "none";
            errBox.textContent = "";
        }

        if (okBox) {
            okBox.style.display = "none";
            okBox.textContent = "";
        }


        // ==============================
        // GET FORM DATA
        // ==============================

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();


        // ==============================
        // VALIDATION
        // ==============================

        if (!email || !password) {

            if (errBox) {
                errBox.textContent =
                    "შეიყვანე email და password";

                errBox.style.display = "block";
            }

            return;
        }


        try {

            // ==============================
            // LOGIN REQUEST
            // ==============================

            const res = await fetch(
                "https://hotel-backend-qeue.onrender.com/auth/sign_in",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // ==============================
            // RESPONSE
            // ==============================

            const data =
                await res.json().catch(() => ({}));


            // ==============================
            // LOGIN ERROR
            // ==============================

            if (!res.ok) {

                console.error(
                    "Login error:",
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

                return;
            }


            // ==============================
            // CHECK TOKEN
            // ==============================

            if (!data.token) {

                console.error(
                    "Backend-მა token არ დააბრუნა:",
                    data
                );


                if (errBox) {

                    errBox.textContent =
                        "Login წარმატებულია, მაგრამ JWT token ვერ მივიღეთ.";

                    errBox.style.display =
                        "block";
                }

                return;
            }


            // ==============================
            // SAVE JWT TOKEN
            // ==============================

            localStorage.setItem(
                "token",
                data.token
            );


            // ==============================
            // SAVE USER ID
            // ==============================

            if (data.userId !== undefined) {

                localStorage.setItem(
                    "userId",
                    String(data.userId)
                );

            }


            // ==============================
            // SAVE USER EMAIL
            // ==============================

            localStorage.setItem(
                "userEmail",
                data.userEmail || email
            );


            // ==============================
            // SUCCESS MESSAGE
            // ==============================

            if (okBox) {

                okBox.textContent =
                    "You have successfully logged in!";

                okBox.style.display =
                    "block";
            }


            // ==============================
            // SEND MESSAGE TO PARENT
            // ==============================

            window.parent.postMessage(
                {
                    type: "loginSuccess",

                    token: data.token,

                    userId: data.userId,

                    userEmail:
                        data.userEmail || email
                },
                "*"
            );


            // ==============================
            // OPTIONAL REDIRECT
            // ==============================

            // თუ Login-ის შემდეგ პირდაპირ
            // bookedrooms-ზე გადასვლა გინდა,
            // ქვემოთ მოხსენი //:
            //
            // window.location.href =
            //     "./bookedrooms.html";


        } catch (err) {

            console.error(
                "Network error:",
                err
            );


            if (errBox) {

                errBox.textContent =
                    "Network problem, try again.";

                errBox.style.display =
                    "block";
            }

        }

    });

});

