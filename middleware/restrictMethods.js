const restrictMethods = (allowedMethods) => {
    return (req, res, next) => {
        const methods = Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods];
        const upperMethods = methods.map(m => m.toUpperCase());

        if (!upperMethods.includes(req.method.toUpperCase())) {
            return res.status(405).json({
                status: false,
                message: `Method not allowed. Use ${upperMethods.join(' or ')}.`,
                data: {},
            });
        }

        next();
    };
};

module.exports = restrictMethods;