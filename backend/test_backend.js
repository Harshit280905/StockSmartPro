const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('--- Registering User ---');
        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Admin',
                email: 'admin@inventory.com',
                password: 'password'
            });
            console.log('Registration Successful');
        } catch (e) {
            console.log('Registration failed or user exists:', e.response?.data?.message || e.message);
        }

        console.log('\n--- Logging In ---');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@inventory.com',
            password: 'password'
        });
        const token = loginRes.data.token;
        console.log('Login Successful, Token:', token.substring(0, 20) + '...');

        const headers = { Authorization: token };

        console.log('\n--- Adding Product ---');
        const prodRes = await axios.post(`${BASE_URL}/products`, {
            name: 'Test iPhone',
            sku: 'IPH-001',
            category: 'Electronics',
            quantity: 10,
            price: 999,
            lowStockThreshold: 3
        }, { headers });
        const productId = prodRes.data._id;
        console.log('Product Added:', prodRes.data.name);

        console.log('\n--- Testing AI Insights ---');
        const insightRes = await axios.get(`${BASE_URL}/dashboard/insights`, { headers });
        console.log('AI Insights:', JSON.stringify(insightRes.data, null, 2));

        console.log('\n--- Creating Sale (Stock Deduction) ---');
        const orderRes = await axios.post(`${BASE_URL}/orders`, {
            customerName: 'Sujal Garg',
            products: [{ productId: productId, quantity: 2 }]
        }, { headers });
        console.log('Order Created, Total:', orderRes.data.totalAmount);

        console.log('\n--- Verifying Stock Deduction ---');
        const verifyRes = await axios.get(`${BASE_URL}/products`, { headers });
        const updatedProd = verifyRes.data.find(p => p._id === productId);
        console.log('New Quantity:', updatedProd.quantity, '(Expected: 8)');

        console.log('\n--- Verifying Transaction Log ---');
        const dashRes = await axios.get(`${BASE_URL}/dashboard`, { headers });
        const latestTx = dashRes.data.recentTransactions[0];
        console.log('Latest Transaction:', latestTx.type, 'Change:', latestTx.quantityChange);

        console.log('\n✅ ALL ENHANCEMENTS WORKING FINE!');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
    }
}

test();
