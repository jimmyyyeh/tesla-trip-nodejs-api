const authTools = require('../../utils/auth-tools');
const model = require('../models/models');


const signIn = async (req, res) => {
    const transaction = await model.sequelize.transaction();
    try {
        const user = await model.User.findOne({
            where: {username: req.body.username},
            transaction: transaction
        });
        if (!user) {
            res.send('user not exists');
            // TODO raise
        }
        if (!authTools.decryptPwd(user.password, req.body.password)) {
            res.send('user invalidate');
            // TODO raise
        }
        let result = {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            birthday: user.birthday,
            sex: user.sex,
            email: user.email,
            point: user.point,
            is_verified: user.is_verified,
            role: user.role,
            charger_id: user.charger_id,
        }
        const token = authTools.generateToken(result)
        result['access_token'] = token
        result['token_type'] = 'bearer'
        res.send(result)
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        // TODO raise
    } finally {
        await transaction.commit();
    }
};

const signUp = async (req, res) => {
    const transaction = await model.sequelize.transaction();
    try{
        const [user, created] = await model.User.findOrCreate({
            where: {username: req.body.username},
            defaults: {
                password: authTools.encryptPwd(req.body.password),
                email: req.body.email,
                birthday: req.body.birthday,
                nickname: req.body.nickname ?? req.body.username,
                sex: req.body.sex,
            }, 
            transaction: transaction
        });
        if (created) {
            const result = {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                birthday: user.birthday,
                sex: user.sex,
                email: user.email,
                point: user.point,
                is_verified: user.is_verified,
                role: user.role,
                charger_id: user.charger_id,
            }
            res.send(result)
        } else {
            res.send('user already exists');
            // TODO raise
        }
    } catch(error) {
        await transaction.rollback();
        console.log(error);
        // TODO raise
    } finally {
        await transaction.commit();
    }
};

const verify = (req, res) => {

};

const resendVerify = (req, res) => {

};

const requestResetPassword = (req, res) => {

};

const resetPassword = (req, res) => {

};

const getProfile = (req, res) => {

};

const updateProfile = (req, res) => {

};


module.exports = {signIn, signUp, verify, resendVerify, requestResetPassword, resetPassword, getProfile, updateProfile};
