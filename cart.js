(() => {
    const $ = (id) => document.getElementById(id);
    const CART_KEY = "budslichi_cart";
    const MAX_QTY = 10;
    const FREE_DELIVERY_MIN = 5000;       // is amount par delivery free
    const money = (n) => "Rs. " + n.toLocaleString("en-PK");
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
    const saveCart = (c) => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} };

    // Picture na mile to demo picture
    const demo = "data:image/svg+xml," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#EFE8D8"/>' +
        '<circle cx="46" cy="50" r="13" fill="#565449"/><circle cx="74" cy="50" r="13" fill="#11120D"/>' +
        '<rect x="36" y="72" width="48" height="24" rx="12" fill="#D8CFBC"/></svg>');

    function render() {
        const cart = getCart();
        const empty = cart.length === 0;
        $("cartEmpty").hidden = !empty;
        $("cartLayout").hidden = empty;
        $("cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
        if (empty) return;

        let subtotal = 0, original = 0;
        $("cartItems").innerHTML = cart.map((item, i) => {
            const lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            original += (item.oldPrice > item.price ? item.oldPrice : item.price) * item.qty;
            return '<article class="cart-row">' +
                '<div class="cart-prod">' +
                    '<img src="' + esc(item.image) + '" alt="" onerror="this.onerror=null;this.src=\'' + demo + '\'">' +
                    '<div><h2>' + esc(item.name) + '</h2><p>Color: ' + esc(item.color) + '</p>' +
                    '<button type="button" class="remove-btn" data-remove="' + i + '">Remove</button></div>' +
                '</div>' +
                '<div class="cell" data-l="Price">' + money(item.price) + '</div>' +
                '<div class="cell" data-l="Quantity"><div class="qty-box">' +
                    '<button type="button" data-dec="' + i + '" aria-label="Decrease quantity">−</button>' +
                    '<span class="qty-num">' + item.qty + '</span>' +
                    '<button type="button" data-inc="' + i + '" aria-label="Increase quantity">+</button>' +
                '</div></div>' +
                '<div class="cell total" data-l="Total">' + money(lineTotal) + '</div>' +
            '</article>';
        }).join("");

        const saved = original - subtotal;
        $("subtotal").textContent = money(original);
        $("saved").textContent = money(saved);
        $("savedRow").hidden = saved <= 0;
        $("grand").textContent = money(subtotal);
        $("installments").textContent = "Pay in 3 installments of " + money(Math.round(subtotal / 3));

        $("shipFill").style.width = Math.min(100, (subtotal / FREE_DELIVERY_MIN) * 100) + "%";
        $("shipMsg").textContent = subtotal >= FREE_DELIVERY_MIN
            ? "Congratulations! You've got free delivery!"
            : "Add " + money(FREE_DELIVERY_MIN - subtotal) + " more to get free delivery.";
    }

    // Quantity / Remove
    $("cartItems").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const cart = getCart(), d = b.dataset;
        if (d.inc !== undefined) cart[d.inc].qty = Math.min(MAX_QTY, cart[d.inc].qty + 1);
        else if (d.dec !== undefined) cart[d.dec].qty = Math.max(1, cart[d.dec].qty - 1);
        else if (d.remove !== undefined) cart.splice(d.remove, 1);
        else return;
        saveCart(cart);
        render();
    });
    $("checkoutBtn").addEventListener("click", () => { window.location.href = "checkout.html"; });

    render();
})();