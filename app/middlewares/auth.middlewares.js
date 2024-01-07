const jwtVariable = require('../variables/jwt');

const accountController = require('../controllers/account.controller');

const authMethod = require('../utils/auth.methods');

exports.isAuthenticated = async (req, res, next) => {
    // Lấy access token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access token not found!'); // No Bearer token found
    }

    const accessTokenFromHeader = authHeader.split(' ')[1]; // Splitting "Bearer [token]" and returning the token part
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const verified = await authMethod.verifyToken(accessTokenFromHeader, accessTokenSecret);

    if (!verified) {
        return res
            .status(401)
            .send('You do not have permission. Please contact to administrator!');
    }

    const account = await accountController.findOne(verified.payload.username);
    req.user = account;

    return next();
};