(() => {

    // HOMEPAGE PRODUCT CARDS (pehle jaisa hi)
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {

        const image = card.querySelector(".product-image img");
        const name = card.querySelector(".product-info h3");
        const price = card.querySelector(".product-price .new-price");
        const oldPrice = card.querySelector(".product-price .old-price");

        if (!image || !name) return;

        function openDetails() {
            const params = new URLSearchParams({
                name: name.textContent.trim().replace(/\s+/g, " "),
                price: price ? price.textContent.trim() : "",
                oldPrice: oldPrice ? oldPrice.textContent.trim() : "",
                image: image.getAttribute("src") || ""
            });
            window.location.href = "product-details.html?" + params.toString();
        }

        card.addEventListener("click", (event) => {
            if (!event.target.closest("button, a")) openDetails();
        });

        card.querySelectorAll(".add-btn, .buy-now-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                openDetails();
            });
        });
    });


    // PRODUCT DETAILS PAGE
    const mainImage = document.getElementById("mainProductImage");
    if (!mainImage) return;

    const $ = (id) => document.getElementById(id);
    const params = new URLSearchParams(window.location.search);
    const toNum = (s) => Number(String(s).replace(/[^\d]/g, "")) || 0;
    const money = (n) => "Rs. " + n.toLocaleString("en-PK");

    /* ================================================================
       PICTURES YAHAN LAGAYEN
       Har product ki 3 pictures ka path. Apni images "images" folder
       mein rakhein aur neeche naam badal dein. Agar picture nahi milti
       to demo picture khud dikh jati hai.
       ================================================================ */
    const PRODUCT_IMAGES = {
        "Beats Studio Buds Plus+ Cosmic Pink": ["images/product1-main.png", "images/product1-extra1.png", "images/earbud1.png"],
        "Glaze Earbuds":                       ["images/product2-main.png", "images/product2-extra1.png", "images/product2-extra2.png"],
        "VOX|R-7085 -RONIN":                   ["images/product3-main.png", "images/product3-extra1.png", "images/product3-extra2.png"],
        "CLUTCH PRO EARBUDS":                  ["images/product4-main.png", "images/product4-extra1.png", "images/product4-extra2.png"],
        "EARBUDS-IRX4":                        ["images/product5-main.png", "images/product5-extra1.png", "images/product5-extra2.png"],
        "Galaxy Buds 3-Pro":                   ["images/product6-main.png", "images/product6-extra1.png", "images/product6-extra2.png"],
        "TH Gen-Z Earbuds":                    ["images/product7-main.png", "images/product7-extra1.png", "images/product7-extra2.png"],
        "Power Beats Fit":                     ["images/product8-main.png", "images/product8-extra1.png", "images/product8-extra2.png"],
        "ToZo Open EarRing":                   ["images/product9-main.png", "images/product9-extra1.png", "images/product9-extra2.png"]
    };

    // Colors (naam + rang). Pehla color default hota hai.
    const COLORS = [
        { name: "Black", hex: "#11120D" },
        { name: "Ivory", hex: "#EDE6D6" },
        { name: "Cosmic Pink", hex: "#E7AAB3" }
    ];

    // Rating / stock yahan se badlein
    const RATING = 4.7, REVIEWS = 2905, STOCK = 7, MAX_QTY = 10;

    // Demo picture (jab asli picture na mile)
    const demo = (n) => "data:image/svg+xml," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#EFE8D8"/>' +
        '<circle cx="235" cy="250" r="62" fill="#565449"/><circle cx="365" cy="250" r="62" fill="#11120D"/>' +
        '<rect x="185" y="350" width="230" height="115" rx="57" fill="#D8CFBC"/>' +
        '<text x="300" y="540" font-family="sans-serif" font-size="26" fill="#565449" text-anchor="middle">Demo photo ' + n + '</text></svg>');

    function setImg(img, src, n) {
        img.onerror = () => { img.onerror = null; img.src = demo(n); };
        img.src = src;
    }

    /* ---------- Product info ---------- */
    const name = params.get("name") || "Beats Studio Buds Plus+ Cosmic Pink";
    const hasParams = params.has("name");
    const price = toNum(hasParams ? params.get("price") : "Rs. 47,500");
    const oldPrice = toNum(hasParams ? params.get("oldPrice") : "Rs. 52,000");
    const homeImage = params.get("image") || "";

    document.title = name + " | BUDSLICHI";
    $("productName").textContent = name;
    $("productPrice").textContent = money(price);
    $("productDescription").textContent =
        name + " from the BUDSLICHI collection. Explore its design and features.";
    $("ratingValue").textContent = RATING.toFixed(1) + " | " + REVIEWS.toLocaleString();
    $("reviewCount").textContent = "✔ Verified reviews";
    $("installments").textContent = "Pay in 3 installments of " + money(Math.round(price / 3));
    $("stockLeft").innerHTML = STOCK <= 10 ? "Only <b>" + STOCK + "</b> products left" : "";

    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 90000;
    $("skuValue").textContent = String(10000 + hash);

    if (oldPrice > price) {
        $("oldPrice").textContent = money(oldPrice);
    }

    /* ---------- Gallery ---------- */
    const images = (PRODUCT_IMAGES[name] || ["images/product1-main.png", "images/product1-extra1.png", "images/earbud1.png"]).slice();
    if (homeImage) images[0] = homeImage;      // homepage ki picture pehle number par

    let current = 0;
    const thumbRow = $("thumbRow");

    function showImage(i) {
        current = i;
        setImg(mainImage, images[i], i + 1);
        thumbRow.querySelectorAll(".thumbnail").forEach((t, k) => t.classList.toggle("active", k === i));
    }

    images.forEach((src, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "thumbnail";
        b.setAttribute("aria-label", "Show image " + (i + 1));
        const im = document.createElement("img");
        im.alt = "Product image " + (i + 1);
        setImg(im, src, i + 1);
        b.appendChild(im);
        b.addEventListener("click", () => showImage(i));
        thumbRow.appendChild(b);
    });
    showImage(0);

    // Hover zoom
    const stage = $("imageStage");
    stage.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        mainImage.style.transformOrigin =
            ((e.clientX - r.left) / r.width) * 100 + "% " + ((e.clientY - r.top) / r.height) * 100 + "%";
    });
    stage.addEventListener("mouseenter", () => stage.classList.add("zoom"));
    stage.addEventListener("mouseleave", () => stage.classList.remove("zoom"));

    /* ---------- Colors ---------- */
    let colorIndex = Math.max(0, COLORS.findIndex((c) => name.toLowerCase().includes(c.name.toLowerCase())));

    function renderColors() {
        $("colorName").textContent = COLORS[colorIndex].name;
        $("swatches").innerHTML = "";
        COLORS.forEach((c, i) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "swatch" + (i === colorIndex ? " active" : "");
            b.style.setProperty("--c", c.hex);
            b.title = c.name;
            b.setAttribute("aria-label", c.name);
            b.addEventListener("click", () => { colorIndex = i; renderColors(); });
            $("swatches").appendChild(b);
        });
    }
    renderColors();

    /* ---------- Quantity ---------- */
    const qty = $("qtyInput");
    function fixQty() {
        let v = parseInt(qty.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v > MAX_QTY) v = MAX_QTY;
        qty.value = v;
        return v;
    }
    $("qtyMinus").addEventListener("click", () => { qty.value = fixQty() - 1; fixQty(); });
    $("qtyPlus").addEventListener("click", () => { qty.value = fixQty() + 1; fixQty(); });
    qty.addEventListener("change", fixQty);

    /* ---------- Cart ---------- */
    const CART_KEY = "budslichi_cart";
    const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
    function updateCount() {
        $("cartCount").textContent = getCart().reduce((s, i) => s + i.qty, 0);
    }

    function addToCart() {
        const color = COLORS[colorIndex].name;
        const cart = getCart();
        const line = cart.find((i) => i.name === name && i.color === color);
        if (line) line.qty = Math.min(MAX_QTY, line.qty + fixQty());
        else cart.push({ name, color, price, oldPrice, image: images[0], qty: fixQty() });
        try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
        updateCount();
    }

    let toastTimer;
    function toast(msg) {
        const t = $("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
    }

    $("addToCart").addEventListener("click", () => { addToCart(); toast("Added to cart"); });
    $("buyNow").addEventListener("click", () => { addToCart(); window.location.href = "cart.html"; });
    updateCount();
})();