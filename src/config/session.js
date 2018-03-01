const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
let router = express.Router();

router.get('/value', auth.isAuth, (req, res)=>{
    res.send({
        session: req.session.passport
    });
});

router.post('/login', auth.isLogged, function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(401).send({
                err: info
            });
        }

        req.logIn(user, function(err){
            if(err){
                return res.status(500).send({
                    err: "No se puede ingresar con este usuario"
                });
            }
            res.status(200).send({
                status: "Inicio de Sesion exitoso"
            });
        });
    })(req, res, next);
});

router.get('/logout', auth.isAuth, function(req, res){
    req.logout();
    res.status(200).send({
        status: "Hasta Lueguito"
    });
});


module.exports = router;