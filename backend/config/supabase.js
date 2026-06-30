const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY exists:", !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("typeof supabase.from:", typeof supabase.from);

module.exports = supabase;