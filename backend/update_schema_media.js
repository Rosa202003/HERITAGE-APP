require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const https = require('https');
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
const sql = `ALTER TABLE buildings ADD COLUMN IF NOT EXISTS video_url TEXT; ALTER TABLE buildings ADD COLUMN IF NOT EXISTS media_urls JSONB;`;
const body = JSON.stringify({ query: sql });
const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/' + projectRef + '/database/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_KEY,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});
req.on('error', e => console.error('Error:', e));
req.write(body);
req.end();
