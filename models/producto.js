const { Schema, model } =  require('mongoose')

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    img: {
        type: String,
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
})

ProductoSchema.methods.toJSON = function() {
    const { __v, estado, _id, ...producto} = this.toObject();
    producto.pid = _id;
    return producto
}

module.exports = model('Producto', ProductoSchema)