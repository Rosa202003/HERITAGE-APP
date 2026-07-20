require('dotenv').config();
const supabase = require("./config/supabase");

async function check() {
  const { data, error } = await supabase.from('buildings').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}
check();
