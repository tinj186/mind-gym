const crypto = require('crypto');
const salt = '8my1EP9QNCLGjkeAh4wdDFO7zLqofjkHMib1aF0wb2Uo3rE22iwDLZKp6nw8M2z2';

const payload = {
  payment_id: 'a227635a-d263-4353-895b-8baff84ef4eb',
  payment_request_id: 'a2276359-d157-4f81-9083-882d46948177',
  phone: '',
  amount: '29.90',
  currency: 'SGD',
  status: 'completed',
  reference_number: 'sub_cmr1txwcx0000pw8h8w9vgrhp_1782900542064'
};

const targetHash = '12c550e50b1d39640991c3187f5e7b865da68061e9e671444155f7a784f27109';

function check(name, str) {
  const hash = crypto.createHmac('sha256', salt).update(str).digest('hex');
  if (hash === targetHash) console.log("MATCH FOUND:", name, "\nString:", str);
}

const keys = Object.keys(payload).sort();
let valStr = keys.map(k => payload[k]).join('');
check('Normal values concatenated', valStr);

let kvStr = keys.map(k => `${k}${payload[k]}`).join('');
check('Key+Value', kvStr);

let qsStr = keys.map(k => `${k}=${payload[k]}`).join('&');
check('Query String', qsStr);

// Without empty values
const keysNoEmpty = keys.filter(k => payload[k] !== '');
let valStrNoEmpty = keysNoEmpty.map(k => payload[k]).join('');
check('Values without empty fields', valStrNoEmpty);

let qsNoEmpty = keysNoEmpty.map(k => `${k}=${payload[k]}`).join('&');
check('Query string without empty fields', qsNoEmpty);

