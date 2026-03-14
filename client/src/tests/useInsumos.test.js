import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInsumos } from '../hooks/useInsumos';

describe('useInsumos', () => {
  const mockInsumosResponse = [
    {
      id: '1',
      nombre: 'Arroz',
      cantidad: '5',
      unidad: 'kg',
      categoria: 'alimentos',
      vencimiento: '06-2027',
      calorias: 150,
      proteina: 3,
      notas: '',
      simbolos: [],
    },
  ];

  const mockCategoriasResponse = {
    success: true,
    data: ['alimentos', 'especias'],
  };
  const mockSimbolosResponse = {
    success: true,
    data: [{ codigo: 'V', descripcion: 'Ya vencido' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(async url => {
      if (url === '/api/categorias') {
        return {
          ok: true,
          json: async () => mockCategoriasResponse,
        };
      }
      if (url === '/api/simbolos') {
        return {
          ok: true,
          json: async () => mockSimbolosResponse,
        };
      }
      if (typeof url === 'string' && url.startsWith('/api/insumos')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: mockInsumosResponse,
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      };
    });
  });

  it('debe tener estado inicial correcto', async () => {
    const { result } = renderHook(() => useInsumos());

    expect(result.current.insumos).toEqual([]);
    expect(result.current.categorias).toEqual([]);
    expect(result.current.simbolos).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Limpieza de efectos asíncronos pendientes
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('debe cargar insumos al montarse', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insumos).toEqual(mockInsumosResponse);
  });

  it('debe cargar categorías', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.categorias.length).toBeGreaterThan(0);
    });

    expect(result.current.categorias).toEqual(mockCategoriasResponse.data);
  });

  it('debe cargar símbolos', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.simbolos.length).toBeGreaterThan(0);
    });

    expect(result.current.simbolos).toEqual(mockSimbolosResponse.data);
  });

  it('debe tener método crearInsumo', async () => {
    const { result } = renderHook(() => useInsumos());

    expect(result.current.crearInsumo).toBeDefined();
    expect(typeof result.current.crearInsumo).toBe('function');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('debe tener método actualizarInsumo', async () => {
    const { result } = renderHook(() => useInsumos());

    expect(result.current.actualizarInsumo).toBeDefined();
    expect(typeof result.current.actualizarInsumo).toBe('function');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('debe tener método eliminarInsumo', async () => {
    const { result } = renderHook(() => useInsumos());

    expect(result.current.eliminarInsumo).toBeDefined();
    expect(typeof result.current.eliminarInsumo).toBe('function');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('debe tener setFiltros', async () => {
    const { result } = renderHook(() => useInsumos());

    expect(result.current.setFiltros).toBeDefined();
    expect(result.current.filtros).toEqual({
      categoria: 'todas',
      texto: '',
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('debe llamar a crearInsumo con POST', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.crearInsumo({ nombre: 'Nuevo' });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/insumos',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('debe llamar a actualizarInsumo con PUT', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.actualizarInsumo('1', { nombre: 'Actualizado' });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/insumos/1',
      expect.objectContaining({
        method: 'PUT',
      })
    );
  });

  it('debe llamar a eliminarInsumo con DELETE', async () => {
    const { result } = renderHook(() => useInsumos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.eliminarInsumo('1');
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/insumos/1',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});
