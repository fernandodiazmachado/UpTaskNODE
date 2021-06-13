const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al Modelo a Utenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        //consulto a la bd
        async (email,password,done)=>{ //done finaliza la ejecucion
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                });
                //Usuario correccto pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{message:"Password incorrecto"});    
                }
                //si el email existe y la contraseña es correcta
                return done(null,usuario);
            } catch (error) {
                //si el usuario no existe
                return done(null,false,{message:"Esa cuenta no existe"});
            }
        }
    )
    
);

//Serializar el usuario ( ponerlo junto nuevamente como el objeto)
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});


//deserializar el usuario (si es un objeto, acceder a sus valores internos)
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;