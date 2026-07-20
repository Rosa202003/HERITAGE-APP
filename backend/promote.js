require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
        console.error(listError.message);
        process.exit(1);
    }
    const targetUser = listData.users.find(u => u.email.toLowerCase() === 'rosadamsuya2020@gmail.com');
    if (!targetUser) {
        console.log('User not found');
        process.exit(1);
    }
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        user_metadata: {
            ...targetUser.user_metadata,
            role: 'officer',
            is_super_officer: true
        }
    });
    if (error) {
        console.error(error.message);
    } else {
        console.log('Promoted rosadamsuya2020@gmail.com to super_officer. You will now see the "Manage Officers" tab in the Officer Dashboard.');
    }
    process.exit(0);
})();
