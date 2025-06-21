document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElement = document.querySelector(".cart-count");

    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to render the cart items
    function renderCart() {
        // Clear the cart items container
        cartItemsContainer.innerHTML = "";

        // Calculate total price and quantity
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            // Create table row for each cart item
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    ${item.name}
                </td>
                <td>$${item.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </td>
            `;

            // Append the row to the cart table
            cartItemsContainer.appendChild(row);
        });

        // Update the cart total
        cartTotalElement.textContent = `$${total.toFixed(2)}`;

        // Update the cart count in the navbar
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Function to update the cart in localStorage
    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    // Event listener to remove an item from the cart
    cartItemsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1); // Remove the item from the cart
            updateCart(); // Update localStorage and re-render the cart
        }
    });

    // Event listener to update item quantity
    cartItemsContainer.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity-input")) {
            const index = event.target.getAttribute("data-index");
            const newQuantity = parseInt(event.target.value);

            if (newQuantity > 0) {
                cart[index].quantity = newQuantity; // Update the quantity in the cart
                updateCart(); // Update localStorage and re-render the cart
            } else {
                event.target.value = cart[index].quantity; // Prevent negative or zero quantities
            }
        }
    });

    // Render the cart when the page is loaded
    renderCart();
});
