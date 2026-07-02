const crypto = require('crypto');
const salt = '8my1EP9QNCLGjkeAh4wdDFO7zLqofjkHMib1aF0wb2Uo3rE22iwDLZKp6nw8M2z2';

const payload = {
  payment_id: 'test_payment_123',
  payment_request_id: 'pr_12345',
  phone: '',
  amount: '29.90',
  currency: 'SGD',
  status: 'completed',
  reference_number: 'sub_testuser_12345',
  hmac: '' // Will be generated
};

// 1. Sort keys
const data = { ...payload };
delete data.hmac;
const keys = Object.keys(data).sort();

// 2. Concatenate values
let valuesStr = "";
for (const key of keys) {
  valuesStr += data[key];
}

// 3. Generate HMAC
const hmac = crypto.createHmac('sha256', salt);
hmac.update(valuesStr);
const signature = hmac.digest('hex');
console.log('Generated Signature:', signature);

payload.hmac = signature;

fetch('http://localhost:3000/api/webhooks/payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams(payload).toString()
}).then(res => res.text()).then(console.log).catch(console.error);
