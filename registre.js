



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const errBox = document.getElementById("formError");
  const okBox  = document.getElementById("formSuccess");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const showPassword = document.getElementById("showPassword");


  phoneInput.addEventListener("input", () => {
    const phonePattern = /^\+995\d{9}$/; 
    if (!phonePattern.test(phoneInput.value.trim())) {
      phoneInput.setCustomValidity("Please enter the number in the correct format.: +995XXXXXXXXX");
    } else {
      phoneInput.setCustomValidity("");
    }
  });


  emailInput.addEventListener("input", () => {
    if (emailInput.validity.valueMissing) {
      emailInput.setCustomValidity("Please enter your email address.");
    } else if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity("Please enter a valid email address. (მაგ: user@example.com)");
    } else {
      emailInput.setCustomValidity("");
    }
  });

  showPassword.addEventListener("change", () => {
    passwordInput.type = showPassword.checked ? "text" : "password";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errBox.style.display = "none";
    okBox.style.display  = "none";
    errBox.textContent = "";
    okBox.textContent  = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      firstName: form.firstName.value.trim(),
      lastName:  form.lastName.value.trim(),
      age:       Number(form.age.value),
      email:     form.email.value.trim(),
      password:  form.password.value,
      address:   form.address.value.trim(),
      phone:     form.phone.value.trim(),
      zipcode:   form.zipcode.value.trim(),
      avatar:    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane",
      gender:    form.gender.value,
    };

    try {
      console.log(" Request payload:", payload);

      const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      console.log(" Response status:", res.status, "data:", data);

      if (!res.ok) {
        if (res.status === 409) {
          errBox.textContent = "This email address is already in use.";
        } else {
          errBox.textContent = data.message || data.error || `Could not register (HTTP ${res.status})`;
        }
        errBox.style.display = "block";
        return;
      }

      okBox.textContent = " You have successfully registered.!";
      okBox.style.display = "block";

      if (data.token && data.userId) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userId", data.userId);

     window.parent.postMessage({
  type: "loginSuccess",
  token: data.token,
  userId: data.userId,
  userEmail: email
}, "*")}

      form.reset();

    } catch (err) {
      console.error(" Network/CORS error:", err);
      errBox.textContent = "Failed to register (network or CORS problem)";
      errBox.style.display = "block";
    }
  });
});






