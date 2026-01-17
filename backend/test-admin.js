// Test admin login
const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    console.log('Sending request to: http://localhost:5000/api/auth/login');
    console.log('Credentials:', {
      email: 'admin9534491220@gmail.com',
      password: 'Shamshad@2005'
    });

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin9534491220@gmail.com',
      password: 'Shamshad@2005'
    });

    console.log('Admin login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

testAdminLogin();