/**
 * @file Hook personalizado que encapsula toda la lógica de comunicación
 * con la API REST del inventario de emergencia.
 *
 * Provee estado reactivo para insumos, categorías, símbolos, filtros,
 * carga y errores, además de funciones CRUD.
 *
 * @module hooks/useInsumos
 */

import { useState, useEffect, useCallback } from 'react';

/** @constant {string} Prefijo base de la API (relativo, usa el proxy de Vite. Ver `vite.config.js`) */
const API = '/api';

/**
 * @typedef {Object} Filtros
 * @property {string} categoria - Categoría seleccionada ("todas" para no filtrar).
 * @property {string} texto     - Texto libre para búsqueda parcial por nombre.
 */

/**
 * @typedef {Object} Simbolo
 * @property {string} codigo      - Código corto (ej: "V", "*", "R").
 * @property {string} descripcion - Descripción legible del símbolo.
 */

/**
 * @typedef {Object} Insumo
 * @property {string}        id           - UUID.
 * @property {string}        nombre       - Nombre del producto.
 * @property {string}        cantidad     - Cantidad textual (ej: "2x 500").
 * @property {string}        unidad       - Unidad de medida.
 * @property {string}        categoria    - Categoría del insumo.
 * @property {string}        vencimiento  - "MM-AAAA" o "no vence".
 * @property {number|null}   calorias     - kcal por porción.
 * @property {number|null}   proteina     - Gramos de proteína.
 * @property {string}        notas        - Observaciones libres.
 * @property {string[]}      simbolos     - Códigos de símbolos aplicados.
 * @property {boolean}       esEmergencia - true = emergencia, false = no-emergencia.
 * @property {string}        creadoEn     - Fecha ISO de creación.
 * @property {string}        actualizadoEn- Fecha ISO de última modificación.
 */

/**
 * Hook que gestiona el estado y las operaciones CRUD del inventario.
 *
 * Se conecta a la API REST local y mantiene sincronizado el estado
 * del frontend tras cada operación de escritura.
 *
 * @returns {{
 *   insumos:          Insumo[],
 *   categorias:       string[],
 *   simbolos:         Simbolo[],
 *   loading:          boolean,
 *   error:            string|null,
 *   filtros:          Filtros,
 *   setFiltros:       Function,
 *   crearInsumo:      (datos: Object) => Promise<void>,
 *   actualizarInsumo: (id: string, datos: Object) => Promise<void>,
 *   eliminarInsumo:   (id: string) => Promise<void>,
 * }}
 *
 * @example
 * const { insumos, loading, crearInsumo } = useInsumos();
 * await crearInsumo({ nombre: 'Arroz blanco', categoria: 'alimentos' });
 */
export function useInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [simbolos, setSimbolos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ categoria: 'todas', texto: '' });

  /**
   * Obtiene la lista de insumos desde la API aplicando los filtros activos.
   * Actualiza los estados `insumos`, `loading` y `error`.
   *
   * @async
   * @function
   */
  const fetchInsumos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filtros.categoria && filtros.categoria !== 'todas')
        params.set('categoria', filtros.categoria);
      if (filtros.texto) params.set('texto', filtros.texto);
      const res = await fetch(`${API}/insumos?${params}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al obtener insumos');
      }
      const json = await res.json();
      setInsumos(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchInsumos();
  }, [fetchInsumos]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/categorias`).then(r => r.json()),
      fetch(`${API}/simbolos`).then(r => r.json()),
    ])
      .then(([categoriasRes, simbolosRes]) => {
        if (categoriasRes.success) setCategorias(categoriasRes.data);
        if (simbolosRes.success) setSimbolos(simbolosRes.data);
      })
      .catch(e => setError('Error al cargar datos iniciales: ' + e.message));
  }, []);

  /**
   * Crea un nuevo insumo enviando los datos al servidor y recarga la lista.
   *
   * @async
   * @param {Object} datos - Campos del nuevo insumo (sin `id` ni timestamps).
   * @throws {Error} Si el servidor responde con un error (ej: nombre vacío).
   */
  async function crearInsumo(datos) {
    try {
      const res = await fetch(`${API}/insumos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al crear');
      }
      await fetchInsumos();
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  /**
   * Actualiza parcialmente un insumo existente y recarga la lista.
   *
   * @async
   * @param {string} id    - UUID del insumo a actualizar.
   * @param {Object} datos - Campos a modificar.
   * @throws {Error} Si el insumo no existe o el servidor devuelve error.
   */
  async function actualizarInsumo(id, datos) {
    try {
      const res = await fetch(`${API}/insumos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al actualizar');
      }
      await fetchInsumos();
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  /**
   * Elimina un insumo por su UUID y recarga la lista.
   *
   * @async
   * @param {string} id - UUID del insumo a eliminar.
   * @throws {Error} Si el insumo no existe o el servidor devuelve error.
   */
  async function eliminarInsumo(id) {
    try {
      const res = await fetch(`${API}/insumos/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al eliminar');
      }
      await fetchInsumos();
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  return {
    insumos,
    categorias,
    simbolos,
    loading,
    error,
    filtros,
    setFiltros,
    crearInsumo,
    actualizarInsumo,
    eliminarInsumo,
  };
}
