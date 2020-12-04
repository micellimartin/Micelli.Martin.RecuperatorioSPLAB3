import Anuncio from './anuncio.js';

export default class Anuncio_Mascota extends Anuncio
{
    animal;
    raza;
    fechaNacimiento;
    vacuna;

    constructor(id, titulo, descripcion, precio, animal, raza, fechaNacimiento, vacuna)
    {
        super(id, titulo, descripcion, precio);
        this.animal = animal;
        this.raza = raza;
        this.fechaNacimiento = fechaNacimiento;
        this.vacuna = vacuna;
    }
}