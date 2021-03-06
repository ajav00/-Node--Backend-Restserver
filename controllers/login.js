const response = require('express');
const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const {correo, password} = req.body;
    
    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Si el usario está actuvo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            usuario, 
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }


}

const googleSignin = async (req, res = response) =>{

    const { id_token } = req.body;

    
    try {
        const {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});
        
        if(!usuario){
            //Debemos crearlo
            const data = {
                nombre, 
                correo,
                password: ':P',
                img, 
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado){
            res.status(401).json({
                msg: 'Hablé con el administradora, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario, 
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no válido'
        });
    }
}


const renovarToken = async(req, res = response) =>{

    const { usuario } = req;
    //Generar el JWT
    const token = await generarJWT(usuario.id);

            
    res.json({
        usuario, 
        token
    });
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}