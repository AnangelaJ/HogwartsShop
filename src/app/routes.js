//import { inflate } from 'zlib';

//import { error } from 'util';
const express = require('express');
const db = require ('../config/database');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
var User = require('../config/User');
const router=express.Router();



module.exports = (app, passport)=>{
    app.get('/', (req, res)=>{
        res.render('index');
    });

    app.get('/perfil', (req, res)=>{
        res.render('perfil');
    });

    app.get('/carrito', (req, res)=>{
        res.render('carrito');
    });

    app.get('/consultaProd', (req, res)=>{
        db.connect().then((obj)=>{
            obj.any('SELECT * FROM productos WHERE estado_prod = true').then((data)=>{
                console.log(data);
                res.send({
                    data: data,
                    status: 200
                });
                obj.done();
            }).catch((error)=>{
                res.send({
                    error: error,
                    msg: "Catalago Vacío",
                    status: 404
                });
                obj.done();
            });    
            }).catch((error)=>{
                console.log(error);
                res.send({
                    error: error,
                    status: 500
                });
            });
        });

        app.post('/InsertProd', (req, res)=>{
            db.connect().then((obj)=>{
                obj.one('INSERT INTO productos (precio_prod,descripcion_prod,nombre_prod, cantidad_prod) VALUES($1,$2,$3, $4) RETURNING id_prod',
                [req.body.precio,
                req.body.descripcion,
                req.body.nombre,
                req.body.cantidad
            ]).then((data)=>{
                    console.log(data);
                    res.send({data:data,
                                status:200});
                    obj.done();                
                }).catch((error)=>{
                    console.log(error);
                    res.send({error:error,
                        msg:'No se pudo registrar',
                        status:500});
                    obj.done();    
                });
            }).catch((error)=>{
                console.log(error);
                console.log("data Base ", db);
                res.send({error:error,
                    msg:'Error al conectar',
                    status:500});
            });
        });

        app.post('/UpdateProd', (req, res)=>{
            db.connect().then((obj)=>{
                obj.one('UPDATE productos SET precio_prod = $1, descripcion_prod = $2, nombre_prod = $3, cantidad_prod = $4 WHERE id_prod = $5 RETURNING id_prod',
                [req.body.precio,
                req.body.descripcion,
                req.body.nombre,
                req.body.cantidad,
                req.body.id.trim()
            ]).then((data)=>{
                    console.log(data);
                    res.send({data:data,
                                status:200});
                    obj.done();                
                }).catch((error)=>{
                    console.log(error);
                    res.send({error:error,
                        msg:'No se pudo registrar',
                        status:500});
                    obj.done();    
                });
            }).catch((error)=>{
                console.log(error);
                console.log("data Base ", db);
                res.send({error:error,
                    msg:'Error al conectar',
                    status:500});
            });
        });

        app.post('/DeleteProd', (req, res)=>{
            db.connect().then((obj)=>{
                obj.query('UPDATE productos SET estado_prod = false WHERE id_prod = $1',
                [req.body.id.trim()
            ]).then(()=>{
                    res.send({
                        status:200});
                    obj.done();                
                }).catch((error)=>{
                    console.log(error);
                    res.send({error:error,
                        msg:'No se pudo registrar',
                        status:500});
                    obj.done();    
                });
            }).catch((error)=>{
                console.log(error);
                console.log("data Base ", db);
                res.send({error:error,
                    msg:'Error al conectar',
                    status:500});
            });
        });

        app.post('/compra', (req, res)=>{
            var row = 0;
            db.connect().then((obj)=>{
                obj.any("SELECT * FROM carrito").then((data)=>{
                    row = data.length;
                    console.log(row);
                    row ++;
            let j = req.body.tam;
            var sql = "INSERT INTO carrito(id_compra, id_usuario, monto_compra, id_prod) VALUES ";  
            console.log("Tamaño: " + req.body.tam);     
            console.log("Productos: " + req.body.prod);     
            var prod = [];
            prod = req.body.prod.split(",");
            console.log("Productos arreglo: " + prod.length);
            for(let i = 0; i < req.body.tam; i++){
                console.log("Producto " + i + ": " + req.body.prod[i]);
                sql += "(" + row + "," + req.body.idU + "," + req.body.monto + "," + prod[i] + "),";
            }
            var sql2 = sql.slice(0,-1);
            sql2+=" RETURNING id_compra;";
            console.log(sql2);
            db.connect().then((obj)=>{
                obj.query(sql2).then((data)=>{
                    console.log(data);
                    res.send({data:data,
                                status:200});
                    obj.done();                
                }).catch((error)=>{
                    console.log(error);
                    res.send({error:error,
                        msg:'No se pudo registrar',
                        status:500});
                    obj.done();    
                });
            }).catch((error)=>{
                console.log(error);
                console.log("data Base ", db);
                res.send({error:error,
                    msg:'Error al conectar',
                    status:500});
            });
                });
            });
            //console.log(row);
        
        });

        app.post('/buscar', (req, res)=>{
            db.connect().then((obj)=>{
                console.log(req.body.name);
                obj.any("SELECT * FROM productos WHERE nombre_prod LIKE '%" +req.body.name.trim()+"%'").then((data)=>{
                    console.log(data);
                    res.send({
                        data: data,
                        status: 200
                    });
                    obj.done();
                }).catch((error)=>{
                    res.send({
                        error: error,
                        msg: "Catalago Vacío",
                        status: 404
                    });
                    obj.done();
                });    
                }).catch((error)=>{
                    console.log(error);
                    res.send({
                        error: error,
                        status: 500
                    });
                });
        });
        
        app.get('/value', auth.isAuth, (req, res)=>{
                res.send({
                    session: req.session.passport,
                    id: req.user.id_usuario,
                    status: 200
                });
        });
            
        app.post('/login', auth.isLogged, function(req, res, next){
                passport.authenticate('local', function(err, user, info){
                    console.log(user);
                    if(err){
                        return next(err);
                    }
                    if(!user){
                        return res.status(401).send({
                            err: info
                        });
                    }
            
                    req.logIn(user, function(err){
                        console.log("LogIn");
                        //console.log(err);
                        if(err){
                            return res.status(500).send({
                                err: "No se puede ingresar con este usuario"
                            });
                            console.log(err);
                        }
                        res.status(200).send({
                            msg: "Inicio de Sesion exitoso", 
                            status: 200
                        });
                    });
                })(req, res, next);
                console.log("Salió de Passport");
        });
            
        app.get('/logout', auth.isAuth, function(req, res){
                req.logout();
                res.status(200).send({
                    status: 200,
                    msg: "Hasta Lueguito"
                });
        });

        app.post('/signup',auth.isLogged,(req, res) => {
                User.AddUser(req.body.email, req.body.passwordR, req.body.name);
                res.send({status:200});
       });

       app.post('/consultaCarrito', (req, res)=>{
        db.connect().then((obj)=>{
            obj.any('SELECT * FROM carrito WHERE id_usuario= $1 ORDER BY id_compra',[
                req.body.idUser
            ]).then((data)=>{
                console.log(data);
                res.send({
                    data: data,
                    status: 200
                });
                obj.done();
            }).catch((error)=>{
                res.send({
                    error: error,
                    msg: "Catalago Vacío",
                    status: 404
                });
                obj.done();
            });    
            }).catch((error)=>{
                console.log(error);
                res.send({
                    error: error,
                    status: 500
                });
            });
        });
};