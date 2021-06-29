const {response, request} = require('express');
const { Producto } = require('../models');

//obtenerProducto - paginado - total - populate
const obtenerProducto = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true};
    

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                        .populate('usuario', 'nombre')
                        .populate('categoria', 'nombre')
                        .skip(Number( desde ))
                        .limit(Number( limite ))
    ]);
    
    res.json({
        total,
        productos
    })
}

//obtenerProducto - populate
const obtenerProductoPorId = async(req, res = response) => {
    const {id} = req.params;
    // console.log(id);
    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    res.json({
        producto
    })
}


const crearProducto = async(req, res = response) => {

    // console.log(req.body);
    const {estado, usuario, ...body} = req.body;

    // nombre = nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre: body.nombre });


    //Verficamos si exite
    if(productoDB){
        return res.status(400).json({
            msg: `La Producto ${productoDB.nombre}, ya existe`
        })
    }

    //Genera la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        
    }
    
    const producto = new Producto(data);
    //Guardar en la base de datos
    await producto.save();

    res.status(201).json(producto);

}

//Actualizar Producto
const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    
    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    //Genera la data a guardar
    data.usuario = req.usuario._id;
    
    //Guardar en la base de datos
    const productoActualizado = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(productoActualizado);

}

//borraProducto - estado:false
const borrarProducto = async(req, res = response) => {
    
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        productoBorrado, 
    });
}

module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductoPorId,
}