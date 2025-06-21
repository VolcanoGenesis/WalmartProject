// server.js - Complete working server without database dependencies
const express = require('express');
const app = express();
const PORT = 3001;

// Enable CORS properly
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});

app.use(express.json());

// Sample data - all in memory
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
        water_usage: 12.5,
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
        water_usage: 18.3,
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
        water_usage: 25.8,
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
        water_usage: 48.6,
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
        water_usage: 8.2,
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
        water_usage: 156.8,
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
        water_usage: 2.1,
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
        water_usage: 8.5,
        packaging_recyclable: false,
        organic: false,
        local_sourced: false,
        transport_distance: 400,
        certifications: [],
        eco_friendly_alternative: 7,
        description: "Standard plastic toothbrush"
    }
];

let cart = [];
let shopping_trips = [];
let user = {
    id: 'demo_user',
    username: 'Demo User',
    eco_points: 1250,
    current_level: 'Eco Warrior',
    total_trips: 15,
    carbon_saved_kg: 45.6,
    plastic_waste_avoided_kg: 8.2,
    sustainable_choices: 78,
    points_to_next_level: 750
};

// Utility functions
function getSustainabilityClass(score) {
    if (score >= 70) return 'excellent';
    if (score >= 40) return 'good';
    return 'poor';
}

function calculateCartMetrics(items) {
    if (items.length === 0) {
        return {
            total_score: 0,
            average_score: 0,
            total_carbon_footprint: 0,
            total_water_usage: 0,
            sustainable_items: 0,
            plastic_saved: 0,
            eco_points_earned: 0
        };
    }

    const totalScore = items.reduce((sum, item) => sum + item.sustainability_score, 0);
    const averageScore = Math.round(totalScore / items.length);
    const totalCarbonFootprint = items.reduce((sum, item) => sum + item.carbon_footprint, 0);
    const totalWaterUsage = items.reduce((sum, item) => sum + (item.water_usage || 0), 0);
    const sustainableItems = items.filter(item => item.sustainability_score >= 70).length;
    
    const plasticSaved = items.filter(item => item.packaging_recyclable).length * 0.3;
    
    const ecoPointsEarned = items.reduce((sum, item) => {
        if (item.sustainability_score >= 70) return sum + 15;
        if (item.sustainability_score >= 40) return sum + 8;
        return sum;
    }, 0);

    return {
        total_score: totalScore,
        average_score: averageScore,
        total_carbon_footprint: Math.round(totalCarbonFootprint * 100) / 100,
        total_water_usage: Math.round(totalWaterUsage * 100) / 100,
        sustainable_items: sustainableItems,
        plastic_saved: Math.round(plasticSaved * 100) / 100,
        eco_points_earned: ecoPointsEarned
    };
}

function updateUserMetrics(tripMetrics) {
    user.total_trips += 1;
    user.eco_points += tripMetrics.eco_points_earned;
    user.carbon_saved_kg += tripMetrics.carbon_reduction_vs_average;
    user.plastic_waste_avoided_kg += tripMetrics.plastic_saved;
    
    const totalSustainableItems = shopping_trips.reduce((sum, trip) => sum + trip.sustainable_items, 0);
    const totalItems = shopping_trips.reduce((sum, trip) => sum + trip.total_items, 0);
    user.sustainable_choices = totalItems > 0 ? Math.round((totalSustainableItems / totalItems) * 100) : 0;

    // Update level based on eco points
    if (user.eco_points >= 5000) {
        user.current_level = 'Green Champion';
        user.points_to_next_level = 0;
    } else if (user.eco_points >= 2000) {
        user.current_level = 'Eco Master';
        user.points_to_next_level = 5000 - user.eco_points;
    } else if (user.eco_points >= 1000) {
        user.current_level = 'Eco Warrior';
        user.points_to_next_level = 2000 - user.eco_points;
    } else if (user.eco_points >= 500) {
        user.current_level = 'Green Explorer';
        user.points_to_next_level = 1000 - user.eco_points;
    } else {
        user.current_level = 'Eco Beginner';
        user.points_to_next_level = 500 - user.eco_points;
    }

    return user;
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        products_count: products.length,
        active_carts: cart.length,
        total_trips: shopping_trips.length
    });
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products/scan/:barcode', (req, res) => {
    const { barcode } = req.params;
    const product = products.find(p => p.barcode === barcode);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    let alternatives = [];
    if (product.eco_friendly_alternative) {
        const alternative = products.find(p => p.id === product.eco_friendly_alternative);
        if (alternative) {
            const improvement = {
                carbon_reduction: product.carbon_footprint - alternative.carbon_footprint,
                score_improvement: alternative.sustainability_score - product.sustainability_score,
                water_savings: (product.water_usage || 0) - (alternative.water_usage || 0)
            };
            alternatives.push({ ...alternative, improvement });
        }
    }

    res.json({
        product,
        alternatives,
        suggestion_triggered: alternatives.length > 0,
        scan_timestamp: new Date().toISOString()
    });
});

app.get('/api/products/:id/alternatives', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const alternatives = [];
    
    if (product.eco_friendly_alternative) {
        const alternative = products.find(p => p.id === product.eco_friendly_alternative);
        if (alternative) {
            alternatives.push(alternative);
        }
    }
    
    const categoryAlternatives = products.filter(p => 
        p.category === product.category && 
        p.id !== productId && 
        p.sustainability_score > product.sustainability_score
    ).slice(0, 2);
    
    alternatives.push(...categoryAlternatives);

    res.json(alternatives);
});

app.post('/api/cart/add', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    for (let i = 0; i < quantity; i++) {
        cart.push({ ...product, added_at: new Date().toISOString() });
    }

    const cartMetrics = calculateCartMetrics(cart);

    res.json({
        message: 'Product added to cart',
        cart_items: cart.length,
        cart_metrics: cartMetrics,
        product
    });
});

app.get('/api/cart', (req, res) => {
    const cartMetrics = calculateCartMetrics(cart);
    
    res.json({
        items: cart,
        metrics: cartMetrics,
        total_cost: cart.reduce((sum, item) => sum + item.price, 0)
    });
});

app.post('/api/cart/analyze', (req, res) => {
    const cartMetrics = calculateCartMetrics(cart);
    
    const averageCarbonFootprint = 4.5;
    const carbonReduction = Math.max(0, ((averageCarbonFootprint - cartMetrics.total_carbon_footprint) / averageCarbonFootprint) * 100);
    
    const analysis = {
        cart_sustainability_score: cartMetrics.average_score,
        total_carbon_footprint: cartMetrics.total_carbon_footprint,
        carbon_reduction_percentage: Math.round(carbonReduction),
        sustainable_item_percentage: cart.length > 0 ? Math.round((cartMetrics.sustainable_items / cart.length) * 100) : 0,
        eco_points_potential: cartMetrics.eco_points_earned,
        plastic_saved_kg: cartMetrics.plastic_saved,
        water_saved_liters: Math.round(cartMetrics.total_water_usage * 0.2),
        improvement_suggestions: cartMetrics.average_score < 60 ? [
            'Consider replacing conventional items with organic alternatives',
            'Look for locally sourced products to reduce transportation impact',
            'Choose items with recyclable packaging'
        ] : []
    };

    res.json(analysis);
});

app.delete('/api/cart/clear', (req, res) => {
    cart = [];
    res.json({ message: 'Cart cleared successfully' });
});

app.post('/api/shopping/complete', (req, res) => {
    const { userId = 'demo_user' } = req.body;
    
    if (cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartMetrics = calculateCartMetrics(cart);
    
    const averageCarbonFootprint = 4.5;
    const carbonReduction = Math.max(0, averageCarbonFootprint - cartMetrics.total_carbon_footprint);
    
    const tripData = {
        id: shopping_trips.length + 1,
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        total_items: cart.length,
        sustainable_items: cartMetrics.sustainable_items,
        total_carbon_footprint: cartMetrics.total_carbon_footprint,
        carbon_reduction_vs_average: carbonReduction,
        plastic_saved_kg: cartMetrics.plastic_saved,
        water_saved_liters: Math.round(cartMetrics.total_water_usage * 0.2),
        eco_points_earned: cartMetrics.eco_points_earned,
        total_spent: cart.reduce((sum, item) => sum + item.price, 0),
        sustainable_percentage: cart.length > 0 ? Math.round((cartMetrics.sustainable_items / cart.length) * 100) : 0,
        items: [...cart]
    };

    shopping_trips.push(tripData);
    const updatedUser = updateUserMetrics(tripData);
    cart = [];

    res.json({
        message: 'Purchase completed successfully',
        trip: tripData,
        user: updatedUser,
        impact_summary: {
            carbon_saved: Math.round(carbonReduction * 100) / 100,
            plastic_saved: cartMetrics.plastic_saved,
            water_saved: Math.round(cartMetrics.total_water_usage * 0.2),
            points_earned: cartMetrics.eco_points_earned
        }
    });
});

app.get('/api/users/:userId', (req, res) => {
    res.json(user);
});

app.get('/api/users/:userId/trips', (req, res) => {
    res.json(shopping_trips.slice(-10).reverse());
});

app.get('/api/analytics/dashboard/:userId', (req, res) => {
    const recentTrips = shopping_trips.slice(-5);
    const avgSustainabilityTrend = recentTrips.length > 0 ? 
        recentTrips.reduce((sum, trip) => sum + trip.sustainable_percentage, 0) / recentTrips.length : 0;

    const analytics = {
        user_metrics: {
            eco_points: user.eco_points,
            current_level: user.current_level,
            points_to_next_level: user.points_to_next_level,
            total_trips: user.total_trips,
            carbon_saved_kg: Math.round(user.carbon_saved_kg * 100) / 100,
            plastic_waste_avoided_kg: Math.round(user.plastic_waste_avoided_kg * 100) / 100,
            sustainable_choices_percentage: user.sustainable_choices
        },
        recent_trends: {
            avg_sustainability_score: Math.round(avgSustainabilityTrend),
            total_impact_last_month: {
                carbon_saved: recentTrips.reduce((sum, trip) => sum + trip.carbon_reduction_vs_average, 0),
                plastic_saved: recentTrips.reduce((sum, trip) => sum + trip.plastic_saved_kg, 0),
                points_earned: recentTrips.reduce((sum, trip) => sum + trip.eco_points_earned, 0)
            }
        },
        leaderboard: [
            { rank: 1, name: 'Sarah M.', points: 2450, level: 'Eco Master' },
            { rank: 2, name: 'John D.', points: 1890, level: 'Eco Warrior' },
            { rank: 3, name: user.username, points: user.eco_points, level: user.current_level, is_current_user: true },
            { rank: 4, name: 'Mike R.', points: 1180, level: 'Eco Warrior' },
            { rank: 5, name: 'Lisa K.', points: 950, level: 'Green Explorer' }
        ]
    };

    res.json(analytics);
});

app.get('/api/analytics/trends/:userId', (req, res) => {
    const trends = {
        carbon_footprint: shopping_trips.slice(-12).map((trip, index) => ({
            week: `Week ${index + 1}`,
            carbon_footprint: trip.total_carbon_footprint,
            carbon_saved: trip.carbon_reduction_vs_average
        })),
        sustainability_progress: shopping_trips.slice(-12).map((trip, index) => ({
            week: `Week ${index + 1}`,
            sustainability_percentage: trip.sustainable_percentage,
            eco_points: trip.eco_points_earned
        }))
    };

    res.json(trends);
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌱 GreenBasket Backend running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/analytics/dashboard/demo_user`);
    console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;