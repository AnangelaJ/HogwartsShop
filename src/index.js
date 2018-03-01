const express = require('express');
const app = express();

const path = require('path');
//const pg = require('pg-promise');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const body = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const cons = require('consolidate');
const { url } = require('./config/database');

/*pg.connect(dbUrl, {
    usePgClient: true
})*/ //OJO

//require('./config/passport')(passport);

//Configuraciones
//app.engine('html', cons.swig);
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
//npm install morgan
app.use(morgan('dev'));
app.use(cookieParser());
app.use(body.urlencoded({extended: false}));
app.use(session({
    secret: 'HogwartsShop',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(require('./config/localStrategy'));
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

//Rutas
require('./app/routes')(app, passport);
//require('./config/session');

//Archivos Estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), ()=>{
    console.log("Servidor desde el puerto", app.get('port'));
});