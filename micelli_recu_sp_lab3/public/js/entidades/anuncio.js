export default class Anuncio
{
    id;
    titulo;
    transaccion;
    descripcion;
    precio

    constructor(id, titulo, descripcion, precio)
    {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = "venta";
        this.descripcion = descripcion;
        this.precio = precio;
    }
}