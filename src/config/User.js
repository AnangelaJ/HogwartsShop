const db = require('./database')
const bcrypt = require('bcryptjs');

module.exports.getUserByEmail = (username, password)=>{
    return new Promise((res, rej)=>{
        db.connect().then((obj)=>{
            obj.one('SELECT * FROM usuario WHERE email_usuario= $1 AND contrasea_usuario= $2', [
                username,
                password
            ]).then((data)=>{
                res(data);
                obj.done();
            }).catch((error)=>{
                console.log(error);
                rej(error);
                obj.done();
            });
        }).catch((error)=>{
            console.log(error);
            rej(error);
        });
    });
};

module.exports.AddUser = (email, password, nombre) =>{
    return new Promise((res, rej)=>{
        db.connect().then((obj)=>{
            obj.one('INSERT INTO usuario (email_usuario, contrasea_usuario, nombre_usuario) VALUES ($1, $2, $3) RETURNING id_usuario', [
                email,
                password, 
                nombre
            ]).then((data)=>{
                res(data);
                obj.done();
            }).catch((error)=>{
                console.log(error);
                rej(error);
                obj.done();
            });
        }).catch((error)=>{
            console.log(error);
            rej(error);
        });
    });
};


module.exports.comparePassword = (password, hash)=>{
    return new Promise((res, rej)=>{
        let hashedPass = bcrypt.hashSync(hash, 10);
        bcrypt.compare(password, hashedPass, function(err, isMatch){
            if(err) throw rej(err);
            res(isMatch);
        });
    });
};
