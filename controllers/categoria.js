const {response, request} = require('express');
const { Categoria } = require('../models');

//obtenerCategoria - paginado - total - populate
const obtenerCategoria = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true};
    // if(!limite || !desde){
    //     return res.status(400).json("Error");
    // }

    // const usuarios = await Usuario.find()
    //                     .skip(Number( desde ))
    //                     .limit(Number( limite )); 

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                        .populate('usuario', 'nombre')
                        .skip(Number( desde ))
                        .limit(Number( limite ))
    ]);
    // const {limite = 5, desde = 0} = req.query;
    // const categorias = await Categoria.find().
    //                     limit(limite).skip(desde).populate('_id')
    res.json({
        total,
        categorias
    })
}

//obtenerCategoria - populate
const obtenerCategoriaPorId = async(req, res = response) => {
    const {id} = req.params;
    // console.log(id);
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')
    res.json({
        categoria
    })
}


const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});


    //Verficamos si exite
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Genera la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria(data);
    //Guardar en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}

//Actualizar Categoria
const actualizarCategoria = async(req, res = response) => {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    
    //Verficamos si exite - ya se realiza con el middleware
    // if(!categoriaDB){
    //     return res.status(400).json({
    //         msg: `La categoria ${categoriaDB.nombre}no existe`
    //     })
    // }

    //Genera la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }
    
    //Guardar en la base de datos
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoriaActualizada);

}

//borraCategoria - estado:false
const borrarCategoria = async(req, res = response) => {
    
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoriaBorrada, 
    });
}

module.exports = {
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategoriaPorId,
}