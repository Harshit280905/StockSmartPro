const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: 'admin@inventory.com' },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log('User admin@inventory.com updated to ADMIN role successfully.');
        } else {
            console.log('User admin@inventory.com not found.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

makeAdmin();
