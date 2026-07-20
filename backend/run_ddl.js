require('dotenv').config();
const https = require('https');

const url = process.env.SUPABASE_URL;
const projectRef = url.replace('https://', '').split('.')[0];
console.log('Project ref:', projectRef);

const sql = `ALTER TABLE buildings ADD COLUMN IF NOT EXISTS visits INTEGER DEFAULT 0; ALTER TABLE buildings ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb; ALTER TABLE buildings ADD COLUMN IF NOT EXISTS panorama_url TEXT; CREATE TABLE IF NOT EXISTS reviews (id BIGSERIAL PRIMARY KEY, building_id BIGINT REFERENCES buildings(id) ON DELETE CASCADE, user_name TEXT NOT NULL, avatar TEXT, rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL, body TEXT NOT NULL, helpful_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now()); ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;`;

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
