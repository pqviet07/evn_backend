const db = require("../models");
const Account = db.account;

exports.create = async newAccount => {
    try {
        const data = await newAccount.save();
        if (data) return true;
        return false;
    } catch (error) {
        console.log("Error create account:" + error);
        return false;
    }
};

exports.findOne = async username => {
    try {
        const data = await Account.findOne({ username: username });
        return data;
    } catch (error) {
        console.log(`Error find account: ${username} \t with err:` + error);
        return null;
    }
};

exports.updateRefreshToken = async (username, refreshToken) => {
    try {
        const accountUpdated = await Account.findOneAndUpdate(
            { username: username },
            { $set: { refreshToken: refreshToken } },
            { new: true, useFindAndModify: false });

        if (accountUpdated) return true;
        else return false;
    } catch {
        return false;
    }
};