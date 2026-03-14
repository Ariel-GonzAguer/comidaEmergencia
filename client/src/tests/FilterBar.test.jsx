import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../components/FilterBar';

describe('FilterBar', () => {
  const mockSetFiltros = vi.fn();
  const categorias = ['alimentos', 'especias', 'bebidas', 'higiene', 'otros'];
  const filtros = { categoria: 'todas', texto: '' };

  beforeEach(() => {
    mockSetFiltros.mockClear();
  });

  it('debe renderizar el campo de búsqueda', () => {
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);
    expect(screen.getByPlaceholderText('Buscar insumo... [/]')).toBeInTheDocument();
  });

  it('debe filtrar por texto', async () => {
    const user = userEvent.setup();
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);

    const input = screen.getByPlaceholderText('Buscar insumo... [/]');
    await user.type(input, 'arroz');

    expect(mockSetFiltros).toHaveBeenCalled();
  });

  it('debe renderizar botones para todas las categorías', () => {
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);

    expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument();
    categorias.forEach(cat => {
      expect(screen.getByRole('button', { name: new RegExp(cat, 'i') })).toBeInTheDocument();
    });
  });

  it('debe marcar el botón de categoría activa', () => {
    const filtrosActivos = { categoria: 'alimentos', texto: '' };
    render(
      <FilterBar filtros={filtrosActivos} setFiltros={mockSetFiltros} categorias={categorias} />
    );

    const btnAlimentos = screen.getByRole('button', { name: /alimentos/i });
    expect(btnAlimentos.getAttribute('aria-pressed')).toBe('true');
  });

  it('debe cambiar de categoría al hacer clic', async () => {
    const user = userEvent.setup();
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);

    const btnBebidas = screen.getByRole('button', { name: /bebidas/i });
    await user.click(btnBebidas);

    expect(mockSetFiltros).toHaveBeenCalled();
  });

  it('debe tener role="toolbar" en el contenedor', () => {
    const { container } = render(
      <FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />
    );

    const toolbar = container.querySelector('[role="toolbar"]');
    expect(toolbar.getAttribute('aria-label')).toBe('Filtros de inventario');
  });

  it('debe enfocar el input al presionar //', async () => {
    const user = userEvent.setup();
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);

    const input = screen.getByPlaceholderText('Buscar insumo... [/]');
    await user.keyboard('/');

    expect(input).toHaveFocus();
  });

  it('debe tener aria-describedby en el input de búsqueda', () => {
    render(<FilterBar filtros={filtros} setFiltros={mockSetFiltros} categorias={categorias} />);

    const input = screen.getByPlaceholderText('Buscar insumo... [/]');
    expect(input.getAttribute('aria-describedby')).toBe('buscar-hint');
  });
});
