const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

UsuarioSchema.methods.toJSON = function(){
    const {__v,  _id, password , ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model('Usuarios', UsuarioSchema);