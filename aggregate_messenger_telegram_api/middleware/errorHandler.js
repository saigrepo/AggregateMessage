const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.message.includes('AUTH_KEY_UNREGISTERED')) {
        return res.status(401).json({
            success: false,
            message: "Authentication key expired",
            keyExpired: true
        });
    }

    if (err.message.includes('SESSION_PASSWORD_NEEDED')) {
        return res.status(400).json({
            success: false,
            requiresPassword: true,
            message: "2FA password required"
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

module.exports = errorHandler;