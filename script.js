// Product Data
const products = [
    {
        id: 1,
        name: "Memory Locket Necklace",
        description: "Handcrafted silver locket with space for two photos",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Love Letter Bracelet",
        description: "Bracelet with a tiny scroll for a secret message",
        price: 28.50,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Forgotten Memory Ring",
        description: "Adjustable ring with vintage floral engraving",
        price: 32.75,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Vintage Photo Frame",
        description: "Hand-carved wooden frame for 4x6 photo",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Personalized Heart Keychain",
        description: "Custom engraved keychain with name or date",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Sentimental Candle Holder",
        description: "Glass candle holder with hand-painted designs",
        price: 24.50,
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// WhatsApp Configuration - CHANGE THIS TO YOUR NUMBER
const WHATSAPP_NUMBER = "1234567890"; // Your WhatsApp number with country code
const WHATSAPP_MESSAGE_PREFIX = "Hello! I'd like to order from Lost Love:\n\n";

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const productsGrid = document.querySelector('.products-grid');
const messageForm = document.getElementById('messageForm');
const backToTopBtn = document.getElementById('backToTop');
const whatsappFloat = document.getElementById('whatsappFloat');
const whatsappCartCount = document.getElementById('whatsappCartCount');
const whatsappOrderLink = document.getElementById('whatsappOrderLink');

// WhatsApp Modal Elements (will be created dynamically)

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;
    
    // Render products with responsive settings
    renderProducts();
    
    // Update cart display
    updateCartDisplay();
    
    // Initialize WhatsApp
    initWhatsApp();
    
    // Mobile menu functionality
    setupMobileMenu();
    
    // Cart functionality
    setupCart();
    
    // Form handling
    setupForms();
    
    // Back to top button
    setupBackToTop();
    
    // Touch device optimizations
    if (isMobile || 'ontouchstart' in window) {
        optimizeForTouch();
    }
});

// Initialize WhatsApp Integration
function initWhatsApp() {
    // Create WhatsApp Modal
    createWhatsAppModal();
    
    // Update WhatsApp button with cart count
    updateWhatsAppButton();
    
    // Handle WhatsApp order link click
    if (whatsappOrderLink) {
        whatsappOrderLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                showNotification('Your cart is empty! Add items first.', 'warning');
                return;
            }
            
            openWhatsAppModal();
        });
    }
}

// Create WhatsApp Order Modal
function createWhatsAppModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.whatsapp-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="whatsapp-modal" id="whatsappModal">
            <div class="whatsapp-modal-content">
                <div class="whatsapp-modal-header">
                    <h2><i class="fab fa-whatsapp"></i> Order via WhatsApp</h2>
                    <button class="close-whatsapp" id="closeWhatsApp">&times;</button>
                </div>
                
                <div id="whatsappFormContainer">
                    <form class="whatsapp-form" id="whatsappOrderForm">
                        <h3>Shipping Information</h3>
                        
                        <div class="form-group">
                            <label for="customerName">Full Name *</label>
                            <input type="text" id="customerName" required placeholder="Your full name">
                        </div>
                        
                        <div class="form-group">
                            <label for="customerPhone">WhatsApp Number *</label>
                            <input type="tel" id="customerPhone" required placeholder="Your WhatsApp number">
                        </div>
                        
                        <div class="form-group">
                            <label for="customerAddress">Shipping Address *</label>
                            <textarea id="customerAddress" required placeholder="Full shipping address with ZIP code"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="customerEmail">Email (Optional)</label>
                            <input type="email" id="customerEmail" placeholder="Your email for updates">
                        </div>
                        
                        <div class="whatsapp-order-summary">
                            <h4>Order Summary</h4>
                            <div class="whatsapp-order-items" id="whatsappOrderItems">
                                <!-- Order items will be inserted here -->
                            </div>
                            <div class="whatsapp-order-total">
                                <span>Total:</span>
                                <span id="whatsappOrderTotal">$0.00</span>
                            </div>
                        </div>
                        
                        <div class="whatsapp-contact-card">
                            <div class="whatsapp-contact-icon">
                                <i class="fas fa-store"></i>
                            </div>
                            <div class="whatsapp-contact-info">
                                <h4>Lost Love Store</h4>
                                <p>We'll contact you on WhatsApp to confirm your order</p>
                            </div>
                        </div>
                        
                        <div class="whatsapp-buttons">
                            <button type="submit" class="whatsapp-send-btn">
                                <i class="fab fa-whatsapp"></i> Send via WhatsApp
                            </button>
                            <button type="button" class="whatsapp-cancel-btn" id="cancelWhatsApp">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Insert modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for WhatsApp modal
    const whatsappModal = document.getElementById('whatsappModal');
    const closeWhatsApp = document.getElementById('closeWhatsApp');
    const cancelWhatsApp = document.getElementById('cancelWhatsApp');
    const whatsappOrderForm = document.getElementById('whatsappOrderForm');
    
    if (closeWhatsApp) {
        closeWhatsApp.addEventListener('click', closeWhatsAppModal);
    }
    
    if (cancelWhatsApp) {
        cancelWhatsApp.addEventListener('click', closeWhatsAppModal);
    }
    
    if (whatsappModal) {
        whatsappModal.addEventListener('click', function(e) {
            if (e.target === whatsappModal) {
                closeWhatsAppModal();
            }
        });
    }
    
    if (whatsappOrderForm) {
        whatsappOrderForm.addEventListener('submit', handleWhatsAppOrder);
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && whatsappModal.style.display === 'flex') {
            closeWhatsAppModal();
        }
    });
}

// Open WhatsApp Modal
function openWhatsAppModal() {
    const whatsappModal = document.getElementById('whatsappModal');
    const whatsappOrderItems = document.getElementById('whatsappOrderItems');
    const whatsappOrderTotal = document.getElementById('whatsappOrderTotal');
    
    if (!whatsappModal || !whatsappOrderItems) return;
    
    // Update order summary
    renderWhatsAppOrderSummary();
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (whatsappOrderTotal) {
        whatsappOrderTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Show modal
    whatsappModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.getElementById('customerName');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

// Close WhatsApp Modal
function closeWhatsAppModal() {
    const whatsappModal = document.getElementById('whatsappModal');
    if (whatsappModal) {
        whatsappModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Render order summary for WhatsApp
function renderWhatsAppOrderSummary() {
    const whatsappOrderItems = document.getElementById('whatsappOrderItems');
    if (!whatsappOrderItems) return;
    
    whatsappOrderItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'whatsapp-order-item';
        itemElement.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        whatsappOrderItems.appendChild(itemElement);
    });
}

// Handle WhatsApp Order Submission
function handleWhatsAppOrder(e) {
    e.preventDefault();
    
    // Get form values
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerEmail = document.getElementById('customerEmail').value;
    
    // Validate form
    if (!customerName || !customerPhone || !customerAddress) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    // Format phone number (remove non-digits)
    const formattedPhone = customerPhone.replace(/\D/g, '');
    
    // Generate order message
    const orderMessage = generateOrderMessage(customerName, customerPhone, customerAddress, customerEmail);
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(orderMessage);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Close modal
    closeWhatsAppModal();
    
    // Show success message
    showWhatsAppSuccess();
    
    // Clear cart after successful order
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartDisplay();
        updateWhatsAppButton();
    }, 3000);
    
    // Open WhatsApp in new tab after a short delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1500);
}

// Generate order message for WhatsApp
function generateOrderMessage(name, phone, address, email) {
    let message = WHATSAPP_MESSAGE_PREFIX;
    
    // Add customer information
    message += `👤 Customer Information:\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n`;
    if (email) {
        message += `Email: ${email}\n`;
    }
    
    message += `\n🛍️ Order Details:\n`;
    message += `================\n`;
    
    // Add order items
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}\n`;
        message += `  Quantity: ${item.quantity}\n`;
        message += `  Price: $${item.price.toFixed(2)} each\n`;
        message += `  Subtotal: $${itemTotal.toFixed(2)}\n\n`;
    });
    
    message += `================\n`;
    message += `💰 Total: $${total.toFixed(2)}\n\n`;
    message += `📦 Shipping Method: Standard\n`;
    message += `💳 Payment: Cash on Delivery\n\n`;
    message += `Please confirm this order and provide estimated delivery time. Thank you! 🙏`;
    
    return message;
}

// Show WhatsApp success message
function showWhatsAppSuccess() {
    const formContainer = document.getElementById('whatsappFormContainer');
    if (!formContainer) return;
    
    const successHTML = `
        <div class="whatsapp-success">
            <i class="fas fa-check-circle"></i>
            <h3>Order Ready to Send!</h3>
            <p>Your order details have been prepared. WhatsApp will open automatically to send your order.</p>
            <p>If WhatsApp doesn't open, please click the WhatsApp button again.</p>
            <div class="whatsapp-contact-card">
                <div class="whatsapp-contact-icon">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <div class="whatsapp-contact-info">
                    <h4>Need Help?</h4>
                    <p>Contact us directly on WhatsApp: +${WHATSAPP_NUMBER}</p>
                </div>
            </div>
            <button class="whatsapp-cancel-btn" onclick="closeWhatsAppModal()">
                Close
            </button>
        </div>
    `;
    
    formContainer.innerHTML = successHTML;
}

// Update WhatsApp button
function updateWhatsAppButton() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count badge
    if (whatsappCartCount) {
        whatsappCartCount.textContent = totalItems;
        whatsappCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update button text based on cart
    if (whatsappOrderLink) {
        const whatsappText = whatsappOrderLink.querySelector('.whatsapp-text');
        if (whatsappText) {
            whatsappText.textContent = totalItems > 0 ? `Order (${totalItems})` : 'Order Now';
        }
        
        // Update WhatsApp link directly (for quick order without modal)
        if (totalItems > 0) {
            const quickMessage = generateQuickOrderMessage();
            const encodedMessage = encodeURIComponent(quickMessage);
            whatsappOrderLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            whatsappOrderLink.target = '_blank';
        } else {
            whatsappOrderLink.href = '#';
            whatsappOrderLink.removeAttribute('target');
        }
    }
}

// Generate quick order message (for direct WhatsApp link)
function generateQuickOrderMessage() {
    let message = "Hello! I'd like to order the following items:\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}\n\n`;
    message += `I'll provide my shipping details shortly.`;
    
    return message;
}

// Add direct WhatsApp order button to cart modal
function addWhatsAppButtonToCart() {
    const cartTotalDiv = document.querySelector('.cart-total');
    if (!cartTotalDiv) return;
    
    // Check if WhatsApp button already exists
    if (!document.querySelector('.whatsapp-cart-btn')) {
        const whatsappButton = document.createElement('button');
        whatsappButton.className = 'btn whatsapp-cart-btn';
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i> Order via WhatsApp';
        whatsappButton.style.background = '#25D366';
        whatsappButton.style.marginTop = '10px';
        whatsappButton.style.width = '100%';
        
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartModal();
            openWhatsAppModal();
        });
        
        cartTotalDiv.appendChild(whatsappButton);
    }
}

// ====================================
// EXISTING FUNCTIONS (Updated)
// ====================================

// Setup mobile menu
function setupMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active', isActive);
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
        
        // Update icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        }
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-bars';
    }
}

// Setup cart functionality
function setupCart() {
    // Open cart modal
    document.querySelectorAll('.cart-link, a[href="#cart"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    });
    
    // Close cart modal
    closeCart.addEventListener('click', closeCartModal);
    
    // Close cart modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.style.display === 'flex') {
            closeCartModal();
        }
    });
    
    // Replace checkout with WhatsApp
    document.querySelector('.checkout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        closeCartModal();
        openWhatsAppModal();
    });
}

// Setup forms
function setupForms() {
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Setup back to top button
function setupBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Render products to the page
function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('article');
        productCard.className = 'product-card';
        productCard.setAttribute('aria-label', product.name);
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    updateWhatsAppButton();
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Provide haptic feedback on supported devices
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.setAttribute('aria-label', `${totalItems} items in cart`);
    
    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
        addWhatsAppButtonToCart();
    }
}

// Render cart items in the modal
function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-details">
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateWhatsAppButton();
    showNotification('Item removed from cart', 'info');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Open cart modal
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Add WhatsApp button to cart
    addWhatsAppButtonToCart();
    
    // Focus first interactive element in cart
    setTimeout(() => {
        const firstInteractive = cartModal.querySelector('button, [tabindex]');
        if (firstInteractive) {
            firstInteractive.focus();
        }
    }, 100);
}

// Close cart modal
function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    // Return focus to the element that opened the cart
    const cartButton = document.querySelector('.cart-link');
    if (cartButton) {
        cartButton.focus();
    }
}

// Optimize for touch devices
function optimizeForTouch() {
    // Increase tap targets
    document.querySelectorAll('button, .btn, .nav-link').forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        max-width: 90vw;
        width: auto;
        animation: slideInRight 0.3s ease, fadeOut 0.5s ease 2.5s;
        animation-fill-mode: forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification {
        pointer-events: none;
    }
`;
document.head.appendChild(notificationStyles);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        if (href === '#cart') return;
        
        e.preventDefault();
        
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Calculate offset based on header height
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});