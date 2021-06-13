const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res)=>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta en UpTaskNode'
    })
}

exports.formIniciarSesion = (req,res)=>{
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar sesion en UpTaskNode',
        error
    })
}

exports.crearCuenta = async (req,res)=>{
    //leo los datos del formulario
    const { email, password } = req.body;

    try {
        //Creo el usuario
        await Usuarios.create({email,password});
        //crear una url para confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = { email };

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });
        //redirigir al usuario
        req.flash('correo', 'Te enviamos un correo para confirmar tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTaskNode',
            email:email, //puedo poner solo email porque es igual key y dato
            password: password
        })
    }


}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}