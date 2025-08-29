// Script untuk debug authentication
// Jalankan dengan: node debug-auth.js

const jwt = require('jsonwebtoken');

// Ganti dengan JWT secret yang sama dengan aplikasi
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Fungsi untuk decode JWT token
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
}

// Test dengan token yang ada (ganti dengan token yang sebenarnya)
const testToken = 'YOUR_JWT_TOKEN_HERE';

if (testToken !== 'YOUR_JWT_TOKEN_HERE') {
  console.log('Decoding token:', testToken);
  const decoded = decodeToken(testToken);
  console.log('Decoded token:', JSON.stringify(decoded, null, 2));
} else {
  console.log('Please replace YOUR_JWT_TOKEN_HERE with actual token');
  console.log('You can get the token from browser localStorage or network tab');
}
