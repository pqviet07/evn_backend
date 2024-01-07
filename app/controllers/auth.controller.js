const db = require("../models");
const randToken = require('rand-token');
const bcrypt = require('bcrypt');

const accountController = require('./account.controller');
const authMethodUtil = require('../utils/auth.methods');
const jwtVariable = require('../variables/jwt');
const { SALT_ROUNDS } = require('../variables/auth');

const Account = db.account;

exports.signup = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "Username and password can not be empty!" });
        return;
    }
    const username = req.body.username.toLowerCase();
    const account = await accountController.findOne(username);

    if (account) {
        res.status(409).send('The username already exists.');
        return;
    } else {
        const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        const newAccount = new Account({
            username: username,
            password: hashPassword
        });

        const result = await accountController.create(newAccount);
        if (!result) {
            res.status(400).send('There was an error in the process of creating the account, please try again.');
            return;
        }

        res.send({ username });
        return;
    }
};

exports.login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const account = await accountController.findOne(username);
    if (!account) {
        res.status(401).send('Invalid username or password.');
        return;
    }

    const isPasswordValid = bcrypt.compareSync(password, account.password);
    if (!isPasswordValid) {
        res.status(401).send('Invalid username or password.');
        return;
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const dataForAccessToken = {
        username: account.username,
    };
    const accessToken = await authMethodUtil.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        res.status(401).send('Login unsuccessful, please try again.');
    }

    let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
    if (!account.refreshToken) {
        // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
        await accountController.updateRefreshToken(account.username, refreshToken);
    } else {
        // Nếu user này đã có refresh token thì lấy refresh token đó từ database
        refreshToken = account.refreshToken;
    }

    return res.json({
        msg: 'Login successful.',
        accessToken,
        refreshToken,
    });
};

exports.refreshToken = async (req, res) => {
    // Lấy access token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access token not found!'); // No Bearer token found
    }
    const accessTokenFromHeader = authHeader.split(' ')[1]; // Splitting "Bearer [token]" and returning the token part

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        res.status(400).send('Rrefresh token not found.');
        return;
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

    // Decode access token đó
    const decoded = await authMethodUtil.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!decoded) {
        return res.status(400).send('Invalid access token.');
    }

    const username = decoded.payload.username; // Lấy username từ payload

    const account = await accountController.findOne(username);
    if (!account) {
        return res.status(401).send('User does not exist');
    }

    if (refreshTokenFromBody !== account.refreshToken) {
        return res.status(400).send('Invalid refresh token');
    }

    // Tạo access token mới
    const dataForAccessToken = {
        username,
    };

    const accessToken = await authMethodUtil.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );

    if (!accessToken) {
        return res
            .status(400)
            .send('Failed to create access token, please try again');
    }
    return res.json({
        accessToken,
    });
};