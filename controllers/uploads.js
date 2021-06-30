const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const path = require('path');
const fs = require('fs');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto }= require('../models')

const response = require('express');


const cargarArchivo = async(req, res = response) => {
    
    

    try {
        
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({
            nombre
        });
    } catch (msg) {
        res.status(400).json({msg})
    }

}


const actualizarImagen = async(req, res = response) =>{
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Falta esta validación'});
            break;
    }
    // console.log(modelo);


    try {
        // console.log(modelo);
        //Limpiar imagenes previas
        // borraArchivo(modelo.img, coleccion);

        let pathImagen = path.join(__dirname, `../uploads/${ coleccion }/${ modelo.img }`);
        // console.log(pathImagen);
        if (fs.existsSync(pathImagen)) {
            // console.log('Entre');
            fs.unlinkSync(pathImagen);
        }
        const nombre = await subirArchivo(req.files, undefined, coleccion);

        modelo.img = nombre;

        await modelo.save();

        res.json({
            modelo
        });
    } catch (msg) {
        res.status(400).json({msg})
    }

    
}

const actualizarImagenCloudinary = async(req, res = response) =>{
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Falta esta validación'});
            break;
    }
    // console.log(modelo);


    try {
        // console.log(modelo);
        //Limpiar imagenes previas
        
        if(modelo.img){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath}= req.files.archivo;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

        
        modelo.img = secure_url;

        await modelo.save();

        res.json({
            modelo
        });
    } catch (msg) {
        res.status(400).json({msg})
    }

    
}

const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Falta esta validación'});
            break;
    }
    //console.log(modelo);


    try {
        // console.log(modelo);
        //Limpiar imagenes previas
        const pathImagen = path.join(__dirname, `../uploads/${ coleccion }/${ modelo.img }`);
        // console.log(pathImagen);
        if (fs.existsSync(pathImagen)) {
            // console.log('Entre');
            return res.sendFile(pathImagen);
        }

        const pathNoImage = path.join(__dirname, `../assets/no-image.jpg`);

        return res.sendFile(pathNoImage);
    } catch (msg) {
        res.status(400).json({msg})
    }

}

const mostrarImagenCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Falta esta validación'});
            break;
    }
    

    try {
        // const pathImagen = path.join(__dirname, `../uploads/${ coleccion }/${ modelo.img }`);
        if (modelo.img) {
            // return res.send(modelo.img);
            return res.json({img: modelo.img});
        }

        const pathNoImage = path.join(__dirname, `../assets/no-image.jpg`);

        return res.sendFile(pathNoImage);
    } catch (msg) {
        res.status(400).json({msg})
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary,
}