
const reviewForm = document.getElementById("reviewForm");
const reviewGrid = document.getElementById("reviewsGrid");
const reviewFilter = document.getElementById("reviewFilter");
const starButtons = document.querySelectorAll("#starSelector button");

let selectedRating = 0;
let reviews = [];

try {
  const saved = JSON.parse(localStorage.getItem("budslichiReviews"));
  reviews = Array.isArray(saved) ? saved : [];
} catch {
  reviews = [];
}

document.getElementById("writeReviewBtn").addEventListener("click", () => {
  document.getElementById("writeReviewSection")
    .scrollIntoView({ behavior: "smooth" });
});

starButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    updateStars();
    document.getElementById("ratingError").textContent = "";
  });
});

function updateStars() {
  starButtons.forEach(button => {
    const active = Number(button.dataset.rating) <= selectedRating;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(error => {
    error.textContent = "";
  });
  document.getElementById("reviewSuccess").textContent = "";
}

reviewForm.addEventListener("submit", function(e) {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById("reviewName").value;
  const product = document.getElementById("reviewProduct").value;
  const title = document.getElementById("reviewTitle").value;
  const message = document.getElementById("reviewMessage").value;

  let valid = true;

  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
    showError("nameError", "Enter a valid name using letters only.");
    valid = false;
  }

  if (!product) {
    showError("productError", "Please select a product.");
    valid = false;
  }

  if (selectedRating < 1) {
    showError("ratingError", "Please choose a star rating.");
    valid = false;
  }

  if (!title.trim() || title !== title.trim()) {
    showError("titleError", "Enter a valid review title without leading or trailing spaces.");
    valid = false;
  }

  if (!message.trim() || message !== message.trim()) {
    showError("messageError", "Enter a valid review without leading or trailing spaces.");
    valid = false;
  }

  if (!valid) return;

  const newReview = {
    name,
    product,
    rating: selectedRating,
    title,
    message,
    date: new Date().toISOString()
  };

  reviews.push(newReview);

  try {
    localStorage.setItem("budslichiReviews", JSON.stringify(reviews));
  } catch {
    showError("messageError", "Unable to save review in this browser.");
    reviews.pop();
    return;
  }

  reviewForm.reset();
  selectedRating = 0;
  updateStars();
  renderReviews();

  document.getElementById("reviewSuccess").textContent =
    "Thank you! Your review has been submitted successfully.";
});

reviewFilter.addEventListener("change", renderReviews);

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

function renderReviews() {
  reviewGrid.replaceChildren();

  const sorted = [...reviews];

  if (reviewFilter.value === "highest") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (reviewFilter.value === "lowest") {
    sorted.sort((a, b) => a.rating - b.rating);
  } else {
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sorted.length === 0) {
    reviewGrid.appendChild(
      createElement("p", "empty-reviews",
        "No reviews yet. Be the first to share your experience!")
    );
  }

  sorted.forEach(review => {
    const card = createElement("article", "review-card");
    const top = createElement("div", "review-card-top");
    const user = createElement("div", "review-user");

    const avatar = createElement(
      "div", "review-avatar", review.name.charAt(0).toUpperCase()
    );

    const details = createElement("div");
    details.appendChild(createElement("h4", "", review.name));
    details.appendChild(createElement(
      "span", "review-date",
      new Date(review.date).toLocaleDateString()
    ));

    user.append(avatar, details);
    top.appendChild(user);

    const stars = createElement(
      "div", "stars",
      "★".repeat(review.rating) + "☆".repeat(5 - review.rating)
    );

    card.append(
      top,
      stars,
      createElement("h3", "", review.title),
      createElement("p", "", review.message),
      createElement("span", "review-product", review.product)
    );

    reviewGrid.appendChild(card);
  });

  updateRatingOverview();
}

function updateRatingOverview() {
  const total = reviews.length;

  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;

  document.getElementById("averageRating").textContent =
    average.toFixed(1);

  document.getElementById("totalReviews").textContent =
    `${total} customer review${total === 1 ? "" : "s"}`;

  const bars = document.getElementById("ratingBars");
  bars.replaceChildren();

  for (let rating = 5; rating >= 1; rating--) {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = total ? (count / total) * 100 : 0;

    const row = createElement("div", "rating-bar-row");
    const label = createElement("span", "", `${rating} ★`);
    const track = createElement("div", "rating-bar-track");
    const fill = createElement("div", "rating-bar-fill");

    fill.style.width = percentage + "%";
    track.appendChild(fill);

    row.append(label, track, createElement("span", "", String(count)));
    bars.appendChild(row);
  }
}

renderReviews();
