document.addEventListener("DOMContentLoaded", () => {

    localStorage.clear();

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCountElement = document.querySelector(".fa-cart-shopping");

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Create or update the cart count badge
        let badge = document.querySelector(".cart-count");
        if (!badge) {
            badge = document.createElement("span");
            badge.classList.add("cart-count");
            badge.style.backgroundColor = "#ff6600";
            badge.style.color = "white";
            badge.style.borderRadius = "50%";
            badge.style.padding = "2px 6px";
            badge.style.fontSize = "0.8rem";
            badge.style.position = "absolute";
            badge.style.top = "-10px";
            badge.style.right = "-10px";

            cartCountElement.style.position = "relative";
            cartCountElement.appendChild(badge);
        }

        badge.textContent = totalCount;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const product = event.target.closest(".product");
            const productName = product.querySelector("h2").textContent;
            const productPriceText = product.querySelector("p").textContent;
            const productPrice = parseFloat(productPriceText.replace("Price: $", ""));
            const productImage = product.querySelector("img").src;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            let existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        });
    });

    // Update cart count on page load
    updateCartCount();
});
