// app.js - Updated frontend to work with backend API

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const USER_ID = 'demo_user';

// Application State
let appState = {
    currentPage: 'home',
    cart: [],
    ecoPoints: 1250,
    userLevel: 'Eco Warrior',
    pointsToNextLevel: 750,
    currentSuggestion: null,
    products: [],
    userMetrics: {},
    loading: false
};

// API Service Functions
const api = {
    async get(endpoint) {
        try {
            console.log('Fetching:', `${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Received:', data);
            return data;
        } catch (error) {
            console.error('API GET Error:', error);
            showToast('error', 'Error', `Failed to fetch data: ${error.message}`);
            return null;
        }
    },

    async post(endpoint, data) {
        try {
            console.log('Posting to:', `${API_BASE_URL}${endpoint}`, 'Data:', data);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            console.log('Response:', result);
            return result;
        } catch (error) {
            console.error('API POST Error:', error);
            showToast('error', 'Error', `Failed to send data: ${error.message}`);
            return null;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            showToast('error', 'Error', 'Failed to delete data');
            return null;
        }
    }
};

// Utility Functions
function getSustainabilityClass(score) {
    if (score >= 70) return 'excellent';
    if (score >= 40) return 'good';
    return 'poor';
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
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function setLoading(isLoading) {
    appState.loading = isLoading;
    // You can add loading indicators here
}

// Product Functions
async function loadProducts() {
    setLoading(true);
    const products = await api.get('/products');
    if (products) {
        appState.products = products;
        renderProducts();
    }
    setLoading(false);
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!appState.products || appState.products.length === 0) {
        productsGrid.innerHTML = '<p>Loading products...</p>';
        return;
    }
    
    productsGrid.innerHTML = appState.products.map(product => `
        <div class="product-card card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-price">${product.price.toFixed(2)}</span>
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
                    <button class="scan-button" onclick="scanProduct('${product.barcode}')">
                        <i class="fas fa-barcode"></i>
                        Scan & Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions
async function updateCartDisplay() {
    const cartData = await api.get('/cart');
    if (!cartData) return;

    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalSection = document.getElementById('cart-total-section');
    const cartSustainabilityScore = document.getElementById('cart-sustainability-score');
    const cartCarbonFootprint = document.getElementById('cart-carbon-footprint');
    
    // Update cart count
    cartCount.textContent = cartData.items.length;
    
    // Update cart sustainability metrics
    const sustainability = cartData.metrics;
    cartSustainabilityScore.textContent = sustainability.average_score || '--';
    cartSustainabilityScore.className = `sustainability-score ${getSustainabilityClass(sustainability.average_score)}`;
    cartCarbonFootprint.textContent = sustainability.total_carbon_footprint ? 
        `${sustainability.total_carbon_footprint} kg CO₂` : '-- kg CO₂';
    
    if (cartData.items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalSection.style.display = 'none';
    } else {
        cartTotal.textContent = cartData.total_cost.toFixed(2);
        cartTotalSection.style.display = 'block';
        
        cartItems.innerHTML = cartData.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">
                        Sustainability: <span class="sustainability-score ${getSustainabilityClass(item.sustainability_score)}">${item.sustainability_score}</span>
                    </div>
                </div>
                <div class="cart-item-price">${item.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    // Update app state
    appState.cart = cartData.items;
}

async function scanProduct(barcode) {
    setLoading(true);
    const scanResult = await api.post(`/products/scan/${barcode}`, { userId: USER_ID });
    
    if (scanResult) {
        // Add product to cart
        const addResult = await api.post('/cart/add', { 
            productId: scanResult.product.id,
            quantity: 1 
        });
        
        if (addResult) {
            await updateCartDisplay();
            
            // Show suggestion modal if alternatives exist
            if (scanResult.suggestion_triggered && scanResult.alternatives.length > 0) {
                showSuggestionModal(scanResult.product, scanResult.alternatives[0]);
            } else {
                // Award points for sustainable choices
                if (scanResult.product.sustainability_score >= 70) {
                    showToast('success', '+15 EcoPoints!', `Chose sustainable product: ${scanResult.product.name}`);
                }
                showToast('success', 'Added to Cart', `${scanResult.product.name} has been added to your cart`);
            }
        }
    }
    setLoading(false);
}

function showSuggestionModal(original, alternative) {
    appState.currentSuggestion = { original, alternative };
    
    const modal = document.getElementById('suggestion-modal');
    const content = document.getElementById('suggestion-content');
    
    const improvement = alternative.improvement || {
        carbon_reduction: original.carbon_footprint - alternative.carbon_footprint,
        score_improvement: alternative.sustainability_score - original.sustainability_score,
        water_savings: (original.water_usage || 0) - (alternative.water_usage || 0)
    };
    
    content.innerHTML = `
        <div class="suggestion-comparison">
            <div class="suggestion-product">
                <img src="${original.image}" alt="${original.name}">
                <h4>${original.name}</h4>
                <p>${original.price.toFixed(2)}</p>
                <div class="sustainability-score ${getSustainabilityClass(original.sustainability_score)}">${original.sustainability_score}</div>
            </div>
            <div class="suggestion-product alternative">
                <img src="${alternative.image}" alt="${alternative.name}">
                <h4>${alternative.name}</h4>
                <p>${alternative.price.toFixed(2)}</p>
                <div class="sustainability-score ${getSustainabilityClass(alternative.sustainability_score)}">${alternative.sustainability_score}</div>
            </div>
        </div>
        
        <div class="suggestion-benefits">
            <h4>Benefits of switching:</h4>
            <div class="benefit-item">
                <i class="fas fa-leaf"></i>
                <span>${improvement.score_improvement} points higher sustainability score</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-globe"></i>
                <span>Reduces carbon footprint by ${improvement.carbon_reduction.toFixed(1)} kg CO₂</span>
            </div>
            ${improvement.water_savings > 0 ? `<div class="benefit-item"><i class="fas fa-tint"></i><span>Saves ${improvement.water_savings.toFixed(1)} liters of water</span></div>` : ''}
            ${alternative.organic ? '<div class="benefit-item"><i class="fas fa-seedling"></i><span>Certified organic</span></div>' : ''}
            ${alternative.local_sourced ? '<div class="benefit-item"><i class="fas fa-map-marker-alt"></i><span>Locally sourced</span></div>' : ''}
            ${alternative.packaging_recyclable ? '<div class="benefit-item"><i class="fas fa-recycle"></i><span>Recyclable packaging</span></div>' : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

// User and Analytics Functions
async function loadUserMetrics() {
    const userData = await api.get(`/users/${USER_ID}`);
    if (userData) {
        appState.userMetrics = userData;
        updateUserDisplay(userData);
    }
}

function updateUserDisplay(userData) {
    // Update header display
    document.getElementById('eco-points-display').textContent = userData.eco_points.toLocaleString();
    document.getElementById('user-level').textContent = userData.current_level;
    document.getElementById('points-to-next').textContent = userData.points_to_next_level;
    
    // Update progress bar
    const currentLevelPoints = {
        'Eco Beginner': 0,
        'Green Explorer': 500,
        'Eco Warrior': 1000,
        'Eco Master': 2000,
        'Green Champion': 5000
    };
    
    const nextLevelPoints = {
        'Eco Beginner': 500,
        'Green Explorer': 1000,
        'Eco Warrior': 2000,
        'Eco Master': 5000,
        'Green Champion': 5000
    };
    
    const current = currentLevelPoints[userData.current_level] || 0;
    const next = nextLevelPoints[userData.current_level] || 5000;
    const progress = ((userData.eco_points - current) / (next - current)) * 100;
    
    document.getElementById('level-progress-fill').style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

async function loadDashboardData() {
    const analytics = await api.get(`/analytics/dashboard/${USER_ID}`);
    if (analytics) {
        updateDashboardDisplay(analytics);
    }
}

function updateDashboardDisplay(analytics) {
    const metrics = analytics.user_metrics;
    
    // Update stat cards
    const statElements = {
        carbon_saved: document.querySelector('.stat-card:nth-child(1) h3'),
        plastic_avoided: document.querySelector('.stat-card:nth-child(2) h3'),
        sustainable_choices: document.querySelector('.stat-card:nth-child(3) h3'),
        total_trips: document.querySelector('.stat-card:nth-child(4) h3')
    };
    
    if (statElements.carbon_saved) statElements.carbon_saved.textContent = `${metrics.carbon_saved_kg} kg`;
    if (statElements.plastic_avoided) statElements.plastic_avoided.textContent = `${metrics.plastic_waste_avoided_kg} kg`;
    if (statElements.sustainable_choices) statElements.sustainable_choices.textContent = `${metrics.sustainable_choices_percentage}%`;
    if (statElements.total_trips) statElements.total_trips.textContent = metrics.total_trips;
    
    // Update leaderboard
    const leaderboardList = document.querySelector('.leaderboard-list');
    if (leaderboardList && analytics.leaderboard) {
        leaderboardList.innerHTML = analytics.leaderboard.map(user => `
            <div class="leaderboard-item ${user.is_current_user ? 'current' : ''}">
                <span class="rank">#${user.rank}</span>
                <span class="name">${user.name}</span>
                <span class="points">${user.points} pts</span>
            </div>
        `).join('');
    }
}

async function updateCheckoutSummary() {
    const analysis = await api.post('/cart/analyze');
    if (analysis) {
        document.getElementById('carbon-reduction').textContent = `${analysis.carbon_reduction_percentage}%`;
        document.getElementById('plastic-saved').textContent = `${analysis.plastic_saved_kg}kg`;
        document.getElementById('eco-points-earned').textContent = analysis.eco_points_potential;
    }
}

async function completePurchase() {
    if (appState.cart.length === 0) {
        showToast('warning', 'Empty Cart', 'Please add items to your cart before checkout');
        return;
    }
    
    setLoading(true);
    const result = await api.post('/shopping/complete', { userId: USER_ID });
    
    if (result) {
        showToast('success', 'Purchase Complete!', 
            `Earned ${result.impact_summary.points_earned} EcoPoints! Carbon saved: ${result.impact_summary.carbon_saved}kg`);
        
        // Update displays
        await loadUserMetrics();
        await updateCartDisplay();
        
        // Switch to dashboard after a delay
        setTimeout(() => switchPage('dashboard'), 2000);
    }
    setLoading(false);
}

// Page Navigation
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
    
    // Load page-specific data
    if (pageName === 'dashboard') {
        loadDashboardData();
    } else if (pageName === 'checkout') {
        updateCheckoutSummary();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial data loading
    loadProducts();
    loadUserMetrics();
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
    
    document.getElementById('accept-suggestion').addEventListener('click', async function() {
        if (appState.currentSuggestion) {
            // Add alternative product to cart
            const addResult = await api.post('/cart/add', { 
                productId: appState.currentSuggestion.alternative.id,
                quantity: 1 
            });
            
            if (addResult) {
                await updateCartDisplay();
                showToast('success', '+25 EcoPoints!', `Switched to eco-friendly alternative: ${appState.currentSuggestion.alternative.name}`);
            }
            
            document.getElementById('suggestion-modal').classList.remove('active');
            appState.currentSuggestion = null;
        }
    });
    
    // Donation buttons
    document.querySelectorAll('.donation-options .btn').forEach(button => {
        button.addEventListener('click', function() {
            const pointsMatch = this.textContent.match(/\d+/);
            const points = pointsMatch ? parseInt(pointsMatch[0]) : 0;
            const causeMatch = this.textContent.match(/([A-Z][a-z\s]+)/);
            const cause = causeMatch ? causeMatch[1] : 'Environmental cause';
            
            if (appState.userMetrics.eco_points >= points) {
                showToast('success', 'Donation Successful!', `Donated ${points} points to ${cause}`);
                // In a real app, you'd make an API call here
                appState.userMetrics.eco_points -= points;
                updateUserDisplay(appState.userMetrics);
            } else {
                showToast('error', 'Insufficient Points', `You need ${points} points to donate to ${cause}`);
            }
        });
    });
    
    // Complete checkout
    document.getElementById('complete-checkout').addEventListener('click', completePurchase);
    
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
});

// Global function to make scanProduct available to onclick handlers
window.scanProduct = scanProduct;