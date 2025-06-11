// SustainaCart Application JavaScript

// Application State
let appState = {
    currentPage: 'home',
    cart: [],
    ecoPoints: 1250,
    userLevel: 'Eco Warrior',
    pointsToNextLevel: 750,
    currentSuggestion: null,
    sustainabilityMetrics: {
        totalTrips: 15,
        carbonSaved: 45.6,
        plasticWasteAvoided: 8.2,
        sustainableChoices: 78
    }
};

// Product Data
const products = [
    {
        id: 1,
        name: "Organic Bananas",
        price: 2.99,
        category: "Produce",
        barcode: "856749003462",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
        sustainability_score: 85,
        carbon_footprint: 0.7,
        packaging_recyclable: true,
        organic: true,
        local_sourced: false,
        transport_distance: 1200,
        certifications: ["USDA Organic"],
        eco_friendly_alternative: null,
        description: "Fresh organic bananas, pesticide-free"
    },
    {
        id: 2,
        name: "Conventional Bananas",
        price: 1.99,
        category: "Produce",
        barcode: "856749003461",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
        sustainability_score: 45,
        carbon_footprint: 1.2,
        packaging_recyclable: true,
        organic: false,
        local_sourced: false,
        transport_distance: 1200,
        certifications: [],
        eco_friendly_alternative: 1,
        description: "Regular bananas"
    },
    {
        id: 3,
        name: "Local Farm Eggs (Dozen)",
        price: 5.99,
        category: "Dairy & Eggs",
        barcode: "856749003463",
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop",
        sustainability_score: 78,
        carbon_footprint: 2.1,
        packaging_recyclable: true,
        organic: false,
        local_sourced: true,
        transport_distance: 25,
        certifications: ["Local Farm"],
        eco_friendly_alternative: null,
        description: "Farm-fresh eggs from local farms within 25 miles"
    },
    {
        id: 4,
        name: "Industrial Eggs (Dozen)",
        price: 3.99,
        category: "Dairy & Eggs",
        barcode: "856749003464",
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop",
        sustainability_score: 35,
        carbon_footprint: 4.8,
        packaging_recyclable: false,
        organic: false,
        local_sourced: false,
        transport_distance: 800,
        certifications: [],
        eco_friendly_alternative: 3,
        description: "Standard eggs from industrial farms"
    },
    {
        id: 5,
        name: "Reusable Water Bottle",
        price: 24.99,
        category: "Home & Garden",
        barcode: "856749003465",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
        sustainability_score: 92,
        carbon_footprint: 1.5,
        packaging_recyclable: true,
        organic: false,
        local_sourced: false,
        transport_distance: 500,
        certifications: ["BPA-Free", "Sustainable Materials"],
        eco_friendly_alternative: null,
        description: "Stainless steel reusable water bottle, BPA-free"
    },
    {
        id: 6,
        name: "Disposable Water Bottles (24-pack)",
        price: 8.99,
        category: "Beverages",
        barcode: "856749003466",
        image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=300&h=300&fit=crop",
        sustainability_score: 15,
        carbon_footprint: 12.4,
        packaging_recyclable: true,
        organic: false,
        local_sourced: false,
        transport_distance: 300,
        certifications: [],
        eco_friendly_alternative: 5,
        description: "Single-use plastic water bottles"
    },
    {
        id: 7,
        name: "Bamboo Toothbrush",
        price: 4.99,
        category: "Health & Beauty",
        barcode: "856749003467",
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
        sustainability_score: 88,
        carbon_footprint: 0.3,
        packaging_recyclable: true,
        organic: false,
        local_sourced: false,
        transport_distance: 200,
        certifications: ["Biodegradable", "Sustainable Materials"],
        eco_friendly_alternative: null,
        description: "Eco-friendly bamboo toothbrush with biodegradable bristles"
    },
    {
        id: 8,
        name: "Plastic Toothbrush",
        price: 2.99,
        category: "Health & Beauty",
        barcode: "856749003468",
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
        sustainability_score: 25,
        carbon_footprint: 2.1,
        packaging_recyclable: false,
        organic: false,
        local_sourced: false,
        transport_distance: 400,
        certifications: [],
        eco_friendly_alternative: 7,
        description: "Standard plastic toothbrush"
    }
];

// Utility Functions
function getSustainabilityClass(score) {
    if (score >= 70) return 'excellent';
    if (score >= 40) return 'good';
    return 'poor';
}

function calculateCartSustainability() {
    if (appState.cart.length === 0) return { score: 0, footprint: 0 };
    
    const totalScore = appState.cart.reduce((sum, item) => sum + item.sustainability_score, 0);
    const totalFootprint = appState.cart.reduce((sum, item) => sum + item.carbon_footprint, 0);
    
    return {
        score: Math.round(totalScore / appState.cart.length),
        footprint: Math.round(totalFootprint * 100) / 100
    };
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalSection = document.getElementById('cart-total-section');
    const cartSustainabilityScore = document.getElementById('cart-sustainability-score');
    const cartCarbonFootprint = document.getElementById('cart-carbon-footprint');
    
    // Update cart count
    cartCount.textContent = appState.cart.length;
    
    // Update cart sustainability metrics
    const sustainability = calculateCartSustainability();
    cartSustainabilityScore.textContent = sustainability.score || '--';
    cartSustainabilityScore.className = `sustainability-score ${getSustainabilityClass(sustainability.score)}`;
    cartCarbonFootprint.textContent = sustainability.footprint ? `${sustainability.footprint} kg CO₂` : '-- kg CO₂';
    
    if (appState.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalSection.style.display = 'none';
    } else {
        const total = appState.cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
        cartTotalSection.style.display = 'block';
        
        cartItems.innerHTML = appState.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">
                        Sustainability: <span class="sustainability-score ${getSustainabilityClass(item.sustainability_score)}">${item.sustainability_score}</span>
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
}

function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toastContainer.removeChild(toast), 300);
    }, 4000);
}

function awardEcoPoints(points, reason) {
    appState.ecoPoints += points;
    document.getElementById('eco-points-display').textContent = appState.ecoPoints.toLocaleString();
    
    // Update progress to next level
    const currentProgress = 1250; // Points needed for current level
    const nextLevelPoints = 2000; // Points needed for next level
    const progress = ((appState.ecoPoints - currentProgress) / (nextLevelPoints - currentProgress)) * 100;
    
    document.getElementById('level-progress-fill').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('points-to-next').textContent = Math.max(0, nextLevelPoints - appState.ecoPoints);
    
    showToast('success', `+${points} EcoPoints!`, reason);
}

function showSuggestionModal(product) {
    if (!product.eco_friendly_alternative) return;
    
    const alternative = products.find(p => p.id === product.eco_friendly_alternative);
    if (!alternative) return;
    
    appState.currentSuggestion = { original: product, alternative: alternative };
    
    const modal = document.getElementById('suggestion-modal');
    const content = document.getElementById('suggestion-content');
    
    const carbonSavings = product.carbon_footprint - alternative.carbon_footprint;
    const scoreDifference = alternative.sustainability_score - product.sustainability_score;
    
    content.innerHTML = `
        <div class="suggestion-comparison">
            <div class="suggestion-product">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
                <div class="sustainability-score ${getSustainabilityClass(product.sustainability_score)}">${product.sustainability_score}</div>
            </div>
            <div class="suggestion-product alternative">
                <img src="${alternative.image}" alt="${alternative.name}">
                <h4>${alternative.name}</h4>
                <p>$${alternative.price.toFixed(2)}</p>
                <div class="sustainability-score ${getSustainabilityClass(alternative.sustainability_score)}">${alternative.sustainability_score}</div>
            </div>
        </div>
        
        <div class="suggestion-benefits">
            <h4>Benefits of switching:</h4>
            <div class="benefit-item">
                <i class="fas fa-leaf"></i>
                <span>${scoreDifference} points higher sustainability score</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-globe"></i>
                <span>Reduces carbon footprint by ${carbonSavings.toFixed(1)} kg CO₂</span>
            </div>
            ${alternative.organic ? '<div class="benefit-item"><i class="fas fa-seedling"></i><span>Certified organic</span></div>' : ''}
            ${alternative.local_sourced ? '<div class="benefit-item"><i class="fas fa-map-marker-alt"></i><span>Locally sourced</span></div>' : ''}
            ${alternative.packaging_recyclable ? '<div class="benefit-item"><i class="fas fa-recycle"></i><span>Recyclable packaging</span></div>' : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

function addToCart(product, showSuggestion = true) {
    appState.cart.push(product);
    updateCartDisplay();
    
    // Show suggestion for non-sustainable products
    if (showSuggestion && product.sustainability_score < 60 && product.eco_friendly_alternative) {
        showSuggestionModal(product);
    } else {
        // Award points for sustainable choices
        if (product.sustainability_score >= 70) {
            awardEcoPoints(15, `Chose sustainable product: ${product.name}`);
        }
        
        showToast('success', 'Added to Cart', `${product.name} has been added to your cart`);
    }
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
                
                <div class="sustainability-info">
                    <div class="sustainability-score ${getSustainabilityClass(product.sustainability_score)}">
                        <i class="fas fa-leaf"></i>
                        ${product.sustainability_score}
                    </div>
                    <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                        ${product.carbon_footprint} kg CO₂
                    </div>
                </div>
                
                <div class="product-badges">
                    ${product.organic ? '<span class="badge organic">Organic</span>' : ''}
                    ${product.local_sourced ? '<span class="badge local">Local</span>' : ''}
                    ${product.packaging_recyclable ? '<span class="badge recyclable">Recyclable</span>' : ''}
                </div>
                
                <div class="product-actions">
                    <button class="scan-button" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-barcode"></i>
                        Scan & Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function switchPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    appState.currentPage = pageName;
    
    // Update checkout page with current cart data
    if (pageName === 'checkout') {
        updateCheckoutSummary();
    }
}

function updateCheckoutSummary() {
    const sustainability = calculateCartSustainability();
    const carbonReduction = Math.round(((4.5 - sustainability.footprint) / 4.5) * 100); // Compared to average
    const plasticSaved = appState.cart.filter(item => item.packaging_recyclable).length * 0.3; // Rough estimate
    const pointsEarned = appState.cart.reduce((sum, item) => {
        return sum + (item.sustainability_score >= 70 ? 15 : item.sustainability_score >= 40 ? 8 : 0);
    }, 0);
    
    document.getElementById('carbon-reduction').textContent = `${Math.max(0, carbonReduction)}%`;
    document.getElementById('plastic-saved').textContent = `${plasticSaved.toFixed(1)}kg`;
    document.getElementById('eco-points-earned').textContent = pointsEarned;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Render initial products
    renderProducts();
    updateCartDisplay();
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            switchPage(page);
        });
    });
    
    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', function() {
        document.getElementById('cart-sidebar').classList.add('open');
    });
    
    document.getElementById('close-cart').addEventListener('click', function() {
        document.getElementById('cart-sidebar').classList.remove('open');
    });
    
    // Suggestion modal
    document.getElementById('close-suggestion-modal').addEventListener('click', function() {
        document.getElementById('suggestion-modal').classList.remove('active');
    });
    
    document.getElementById('reject-suggestion').addEventListener('click', function() {
        if (appState.currentSuggestion) {
            showToast('success', 'Added to Cart', `${appState.currentSuggestion.original.name} has been added to your cart`);
            document.getElementById('suggestion-modal').classList.remove('active');
            appState.currentSuggestion = null;
        }
    });
    
    document.getElementById('accept-suggestion').addEventListener('click', function() {
        if (appState.currentSuggestion) {
            // Remove original product and add alternative
            appState.cart.pop(); // Remove the last added item (original)
            appState.cart.push(appState.currentSuggestion.alternative);
            updateCartDisplay();
            
            // Award bonus points for switching
            awardEcoPoints(25, `Switched to eco-friendly alternative: ${appState.currentSuggestion.alternative.name}`);
            
            document.getElementById('suggestion-modal').classList.remove('active');
            appState.currentSuggestion = null;
        }
    });
    
    // Donation buttons
    document.querySelectorAll('.donation-options .btn').forEach(button => {
        button.addEventListener('click', function() {
            const points = parseInt(this.textContent.match(/\d+/)[0]);
            const cause = this.textContent.match(/([A-Z][a-z\s]+)/)[1];
            
            if (appState.ecoPoints >= points) {
                appState.ecoPoints -= points;
                document.getElementById('eco-points-display').textContent = appState.ecoPoints.toLocaleString();
                showToast('success', 'Donation Successful!', `Donated ${points} points to ${cause}`);
            } else {
                showToast('error', 'Insufficient Points', `You need ${points} points to donate to ${cause}`);
            }
        });
    });
    
    // Complete checkout
    document.getElementById('complete-checkout').addEventListener('click', function() {
        if (appState.cart.length === 0) {
            showToast('warning', 'Empty Cart', 'Please add items to your cart before checkout');
            return;
        }
        
        const pointsEarned = appState.cart.reduce((sum, item) => {
            return sum + (item.sustainability_score >= 70 ? 15 : item.sustainability_score >= 40 ? 8 : 0);
        }, 0);
        
        // Update metrics
        appState.sustainabilityMetrics.totalTrips++;
        appState.sustainabilityMetrics.carbonSaved += calculateCartSustainability().footprint * 0.3; // Savings estimate
        
        // Award final points
        if (pointsEarned > 0) {
            awardEcoPoints(pointsEarned, 'Checkout completed with sustainable choices!');
        }
        
        // Clear cart
        appState.cart = [];
        updateCartDisplay();
        
        showToast('success', 'Purchase Complete!', 'Thank you for your eco-friendly choices!');
        
        // Switch to dashboard
        setTimeout(() => switchPage('dashboard'), 2000);
    });
    
    // Close modal when clicking outside
    document.getElementById('suggestion-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartButton = document.getElementById('cart-toggle');
        
        if (!cartSidebar.contains(e.target) && !cartButton.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });
    
    // Initialize level progress
    const currentProgress = (appState.ecoPoints - 1000) / 1000 * 100; // Assuming 1000 points for current level
    document.getElementById('level-progress-fill').style.width = `${Math.min(currentProgress, 100)}%`;
});

// Global function to make addToCart available to onclick handlers
window.addToCart = addToCart;