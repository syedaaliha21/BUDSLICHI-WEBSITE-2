
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const cartCount = document.getElementById("cartCount");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuBtn.textContent = nav.classList.contains("active") ? "✕" : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

let count = 0;

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    count++;
   if (cartCount) {
  cartCount.textContent = count;
}

    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = "Add to Bag +";
    }, 1500);
  });
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const fields = {
    name: document.getElementById("contactName"),
    email: document.getElementById("contactEmail"),
    subject: document.getElementById("contactSubject"),
    message: document.getElementById("contactMessage")
  };

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    subject: document.getElementById("subjectError"),
    message: document.getElementById("messageError")
  };

  const successMessage = document.getElementById("contactSuccess");

  function showError(field, message) {
    errors[field].textContent = message;
    fields[field].classList.toggle("input-invalid", message !== "");
  }

  function validateField(field) {
    const value = fields[field].value;
    let error = "";

    if (!value.trim()) {
      error = value.length > 0 ? "Not Valid" : "This field is required.";
    }

    else if (/^\s/.test(value)) {
      error = "Not Valid";
    }

    else if (field === "name") {
      if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value)) {
        error = "Not Valid";
      }
    }
    
    else if (field === "email") {
  if (
    /\s/.test(value) ||
    !/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value)
  ) {
    error = "Not Valid";
  }
   }



    else if (field === "subject") {
      if (!/^[A-Za-z0-9][A-Za-z0-9\s.,!?'-]*$/.test(value)) {
        error = "Not Valid";
      }
    }

    else if (field === "message") {
      if (!/[A-Za-z]/.test(value)) {
        error = "Not Valid";
      }
    }

    showError(field, error);
    return error === "";
  }

  Object.keys(fields).forEach((field) => {
    fields[field].addEventListener("input", () => {
      successMessage.textContent = "";
      validateField(field);
    });

    fields[field].addEventListener("blur", () => {
      validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    Object.keys(fields).forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      successMessage.textContent = "";
      return;
    }

    successMessage.textContent =
      "Your message has been validated successfully!";

    contactForm.reset();

    Object.keys(fields).forEach((field) => {
      showError(field, "");
    });
  });
}

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("signupName");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirm = document.getElementById("signupConfirm");
  const success = document.getElementById("signupSuccess");

  let valid = true;
  success.textContent = "";

  const fields = [
    ["signupName", "signupNameError"],
    ["signupEmail", "signupEmailError"],
    ["signupPassword", "signupPasswordError"],
    ["signupConfirm", "signupConfirmError"]
  ];

  fields.forEach(([fieldId, errorId]) => {
    document.getElementById(fieldId)
      .classList.remove("input-invalid");
    document.getElementById(errorId).textContent = "";
  });

  function showError(input, errorId, message) {
    input.classList.add("input-invalid");
    document.getElementById(errorId).textContent = message;
    valid = false;
  }

  const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const emailPattern = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!namePattern.test(name.value)) {
    showError(name, "signupNameError",
      "Enter a valid name using letters only.");
  }

  if (!emailPattern.test(email.value)) {
    showError(email, "signupEmailError",
      "Enter a valid email without spaces.");
  }

  if (password.value.length < 8 ||
      !/[A-Za-z]/.test(password.value) ||
      !/[0-9]/.test(password.value) ||
      /\s/.test(password.value)) {
    showError(password, "signupPasswordError",
      "Use at least 8 characters with letters and numbers, without spaces.");
  }

  if (!confirm.value || confirm.value !== password.value) {
    showError(confirm, "signupConfirmError",
      "Passwords do not match.");
  }

  if (valid) {
    success.textContent = "Form validated successfully!";
    signupForm.reset();
  }
});

const searchForm = document.getElementById("searchForm");
const productSearch = document.getElementById("productSearch");
const searchMessage = document.getElementById("searchMessage");

const productCards = document.querySelectorAll(".product-card");

function searchProducts() {
  const searchValue = productSearch.value.trim().toLowerCase();
  let found = 0;

  productCards.forEach(card => {
    const productName = card.querySelector("h3")
      ?.textContent.toLowerCase() || "";

    const isMatch = productName.includes(searchValue);

    card.style.display = isMatch ? "" : "none";

    if (isMatch) {
      found++;
    }
  });

  if (searchValue === "") {
    searchMessage.textContent = "";
  } else if (found === 0) {
    searchMessage.textContent = "No products found.";
  } else {
    searchMessage.textContent =
      `${found} product${found > 1 ? "s" : ""} found`;
  }
}

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  searchProducts();

  if (productSearch.value.trim()) {
    document.getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  }
});

productSearch.addEventListener("input", searchProducts);

const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function openChat() {
  chatBox.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  chatInput.focus();
}

function closeChat() {
  chatBox.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
  chatToggle.focus();
}

chatToggle.addEventListener("click", () => {
  if (chatBox.hidden) {
    openChat();
  } else {
    closeChat();
  }
});

chatClose.addEventListener("click", closeChat);

function addChatMessage(message, type) {
  const messageDiv = document.createElement("div");

  messageDiv.className = "chat-message " + type;
  messageDiv.textContent = message;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const message = chatInput.value.trim();

  if (!message) return;

  addChatMessage(message, "user-message");
  chatInput.value = "";

  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("hello") || text.includes("hi")) {
    reply = "Hello! Welcome to BUDSLICHI. How can we help you?";
  } else if (text.includes("price")) {
    reply = "You can explore our earbuds collection for product details.";
  } else if (text.includes("earbuds") || text.includes("product")) {
    reply = "Check out our earbuds collection to discover our products.";
  } else if (text.includes("delivery")) {
    reply = "For delivery information, please contact our support team.";
  } else if (text.includes("contact")) {
    reply = "You can reach us through the Contact Us form on our website.";
  } else {
    reply = "Thank you for your message! This is a demo chat. Please use our Contact Us form for assistance.";
  }

  addChatMessage(reply, "bot-message");
});
