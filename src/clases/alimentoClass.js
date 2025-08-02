class Alimento {

  constructor(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.calorias = Number(calorias) || 0;
    this.cantidad = Number(cantidad) || 0;
    this.ubicacion = ubicacion;
    this.fechaVencimiento = new Date(fechaVencimiento).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getTipo() {
    return this.tipo;
  }

  getFechaVencimiento() {
    return this.fechaVencimiento;
  }
  setFechaVencimiento(fechaVencimiento) {
    this.fechaVencimiento = fechaVencimiento;
  }
  getCalorias() {
    return this.calorias;
  }

  getCantidad() {
    return this.cantidad;
  }

  getUbicacion() {
    return this.ubicacion;
  }



  static crearAlimento(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion) {
    return new Alimento(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion);
  }

}

export default Alimento;
