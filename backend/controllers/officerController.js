// ========================================
// OFFICER CONTROLLER
// Manage officer accounts (super-officer only)
// ========================================

const { createClient } = require("@supabase/supabase-js");

// Admin client uses service_role key — full access
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// ----------------------------------------
// GET /api/officers — List all officers
// ----------------------------------------
const getOfficers = async (req, res) => {
    try {
        // List all users from Supabase Auth
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        // Filter to only users with role === 'officer'
        const officers = data.users
            .filter(u => u.user_metadata?.role === "officer")
            .map(u => ({
                id: u.id,
                email: u.email,
                full_name: u.user_metadata?.full_name || u.email,
                is_super_officer: u.user_metadata?.is_super_officer === true,
                created_at: u.created_at,
                last_sign_in_at: u.last_sign_in_at
            }));

        res.json(officers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ----------------------------------------
// POST /api/officers/invite
// Promotes an existing user to officer role by email
// ----------------------------------------
const inviteOfficer = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Find the user by email
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            return res.status(500).json({ message: listError.message });
        }

        const targetUser = listData.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!targetUser) {
            return res.status(404).json({
                message: `No account found for ${email}. The person must sign up first before they can be made an officer.`
            });
        }

        // Update user_metadata to set role = officer
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
            user_metadata: {
                ...targetUser.user_metadata,
                role: "officer",
                is_super_officer: false
            }
        });

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.json({
            message: `${email} has been promoted to officer.`,
            officer: {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || email,
                is_super_officer: false
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ----------------------------------------
// DELETE /api/officers/:userId
// Revokes officer access (demotes to citizen)
// Cannot remove yourself or another super-officer
// ----------------------------------------
const removeOfficer = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent self-removal
        if (userId === req.user.id) {
            return res.status(400).json({ message: "You cannot remove yourself." });
        }

        // Fetch user to check if they're a super officer
        const { data: userData, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (fetchError || !userData.user) {
            return res.status(404).json({ message: "Officer not found." });
        }

        if (userData.user.user_metadata?.is_super_officer) {
            return res.status(403).json({ message: "Cannot remove a super-officer." });
        }

        // Demote to citizen
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: {
                ...userData.user.user_metadata,
                role: "citizen",
                is_super_officer: false
            }
        });

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.json({
            message: `Officer access revoked for ${data.user.email}.`,
            user: { id: data.user.id, email: data.user.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// ----------------------------------------
// GET /api/officers/citizens — List all non-officer users
// ----------------------------------------
const getCitizens = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) {
            return res.status(500).json({ message: error.message });
        }

        const citizens = data.users
            .filter(u => u.user_metadata?.role !== "officer")
            .map(u => ({
                id: u.id,
                email: u.email,
                full_name: u.user_metadata?.full_name || ''
            }));

        res.json(citizens);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getOfficers, inviteOfficer, removeOfficer, getCitizens };
