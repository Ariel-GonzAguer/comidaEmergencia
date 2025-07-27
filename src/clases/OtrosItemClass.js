class OtrosItem {
  id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre, descripcion) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  getNombre() {
    return this.nombre;
  }

  getDescripcion() {
    return this.descripcion;
  }

  static crearOtrosItem(nombre, descripcion) {
    return new OtrosItem(nombre, descripcion);
  }
}

export default OtrosItem;
