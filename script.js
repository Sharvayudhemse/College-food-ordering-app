document.addEventListener('DOMContentLoaded', () => {
    // User Management
    const userName = localStorage.getItem('user') || 'Guest';
    document.getElementById('user-name').textContent = userName;

    // Cart Management
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Initialize Cart
    updateCartDisplay();

    // Search Functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterItems(searchTerm);
    });

    window.addToCart = (name, price) => {
        const existingItem = cart.find(item => item.name === name);
        if(existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartDisplay();
    };

    window.removeFromCart = (name) => {
        cart = cart.filter(item => item.name !== name);
        updateCartDisplay();
    };

    window.checkout = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    };

    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const totalPrice = document.getElementById('total-price');
        const cartCount = document.getElementById('cart-count');
        
        let total = 0;
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <div class="item-controls">
                            <button onclick="adjustQuantity('${item.name}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="adjustQuantity('${item.name}', 1)">+</button>
                        </div>
                    </div>
                    <div class="item-price">₹${item.price * item.quantity}</div>
                </div>
            `;
        });

        totalPrice.textContent = total;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    window.adjustQuantity = (name, change) => {
        const item = cart.find(i => i.name === name);
        if(item) {
            item.quantity += change;
            if(item.quantity < 1) {
                cart = cart.filter(i => i.name !== name);
            }
            updateCartDisplay();
        }
    };

    // Payment Functions
    window.selectPayment = (method) => {
        document.querySelectorAll('.method-card').forEach(card => 
            card.classList.remove('active'));
        document.querySelector(`[onclick="selectPayment('${method}')"]`)
            .classList.add('active');
    };

    window.processPayment = () => {
        alert('Payment Successful! Your order will be delivered soon.');
        localStorage.removeItem('cart');
        window.location.href = 'menu.html';
    };
});

function filterItems(searchTerm) {
    document.querySelectorAll('.food-card').forEach(card => {
        const itemName = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = itemName.includes(searchTerm) ? 'flex' : 'none';
    });
}