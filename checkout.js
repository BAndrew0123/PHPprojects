document.addEventListener("DOMContentLoaded", function () {
    // Load the cart data from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const orderTotal = document.getElementById("order-total");

    // Display cart items or empty message
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<tr><td colspan='4'>Your cart is empty.</td></tr>";
        orderTotal.textContent = "$0";
        return;
    }

    // Calculate and display order summary
    let totalAmount = 0;
    cart.forEach(item => {
        const row = document.createElement("tr");
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        orderItemsContainer.appendChild(row);
    });
    orderTotal.textContent = `$${totalAmount.toFixed(2)}`;

    // Initialize PayPal button
    if (document.querySelector('input[name="payment"][value="paypal"]').checked) {
        initPayPal(totalAmount);
    }

    // Payment method toggle
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            document.getElementById(`${this.value}-details`).style.display = 'block';
            
            if (this.value === 'paypal') {
                initPayPal(totalAmount);
            }
        });
    });

    // Form submission handler
    document.getElementById("checkout-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const formData = new FormData(this);
        const billingInfo = Object.fromEntries(formData.entries());
        
        if (paymentMethod === 'mpesa') {
            const phone = document.getElementById("mpesa-phone").value;
            if (!phone || !phone.match(/^07[0-9]{8}$/)) {
                alert("Please enter a valid Safaricom number (07XXXXXXXX)");
                return;
            }
            processMpesaPayment(phone, totalAmount, billingInfo);
        } else {
            // For PayPal, the payment is handled by the PayPal button
            // Just show processing message
            showProcessingModal("Completing PayPal payment...");
        }
    });
});

// Initialize PayPal Button
function initPayPal(totalAmount) {
    // Clear any existing buttons
    document.getElementById("paypal-button-container").innerHTML = '';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalAmount.toFixed(2),
                        currency_code: "USD"
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                showProcessingModal("Payment successful! Processing your order...");
                
                // Get form data
                const formData = new FormData(document.getElementById("checkout-form"));
                const billingInfo = Object.fromEntries(formData.entries());
                
                // Process the order
                processOrder(billingInfo, details);
            });
        },
        onError: function(err) {
            showErrorModal("Payment failed: " + err.message);
        }
    }).render('#paypal-button-container');
}

// Process M-Pesa Payment
function processMpesaPayment(phone, amount, billingInfo) {
    showProcessingModal("Initiating M-Pesa payment request...");
    
    // In a real implementation, you would call your backend API
    // This is a simulation of the process
    fetch("mpesa_stk_push.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            phone: phone, 
            amount: amount,
            billingInfo: billingInfo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showProcessingModal("Payment request sent to your phone. Please complete the payment...");
            
            // Simulate checking payment status (in real app, poll your backend)
            setTimeout(() => {
                processOrder(billingInfo, {
                    paymentMethod: "M-Pesa",
                    transactionId: "MPESA" + Math.random().toString(36).substr(2, 9).toUpperCase()
                });
            }, 3000);
        } else {
            showErrorModal(data.message || "M-Pesa payment failed");
        }
    })
    .catch(error => {
        showErrorModal("Error processing M-Pesa payment: " + error.message);
    });
}

// Process the order after successful payment
function processOrder(billingInfo, paymentDetails) {
    // Get cart items
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // In a real implementation, you would send this to your backend
    const orderData = {
        customer: billingInfo,
        items: cart,
        payment: paymentDetails,
        total: document.getElementById("order-total").textContent.replace('$', ''),
        date: new Date().toISOString()
    };
    
    console.log("Order processed:", orderData);
    
    // Simulate API call delay
    setTimeout(() => {
        // Clear cart
        localStorage.removeItem("cart");
        
        // Show success and redirect
        showSuccessModal("Order processed successfully! Redirecting...");
        setTimeout(() => {
            window.location.href = "order-confirmation.html?order=" + 
                encodeURIComponent(JSON.stringify(orderData));
        }, 2000);
    }, 1500);
}

// Modal functions
function showProcessingModal(message) {
    const modal = document.getElementById("payment-modal");
    document.getElementById("modal-title").textContent = "Processing Payment";
    document.getElementById("modal-message").textContent = message;
    modal.style.display = "block";
}

function showSuccessModal(message) {
    const modal = document.getElementById("payment-modal");
    document.getElementById("modal-title").textContent = "Success!";
    document.getElementById("modal-message").textContent = message;
    document.querySelector(".loader").style.display = "none";
    modal.style.display = "block";
}

function showErrorModal(message) {
    const modal = document.getElementById("payment-modal");
    document.getElementById("modal-title").textContent = "Error";
    document.getElementById("modal-message").textContent = message;
    document.querySelector(".loader").style.display = "none";
    modal.style.display = "block";
}

// Close modal when clicking X
document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("payment-modal").style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    const modal = document.getElementById("payment-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});