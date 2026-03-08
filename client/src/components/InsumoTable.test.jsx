import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsumoTable from './InsumoTable';

describe('InsumoTable', () => {
  const mockEditar = vi.fn();
  const mockEliminar = vi.fn();
  const simbolosDef = [
    { codigo: 'V', descripcion: 'Ya vencido' },
    { codigo: '*', descripcion: 'Vence este año' },
    { codigo: 'R', descripcion: 'Reponer' },
    { codigo: 'PS', descripcion: 'Pronto sacar' },
  ];

  const insumosEjemplo = [
    {
      id: '1',
      nombre: 'Arroz blanco',
      cantidad: '5',
      unidad: 'kg',
      categoria: 'alimentos',
      vencimiento: '06-2027',
      calorias: 150,
      proteina: 3,
      notas: '',
      simbolos: [],
    },
    {
      id: '2',
      nombre: 'Sal',
      cantidad: '1',
      unidad: 'kg',
      categoria: 'especias',
      vencimiento: 'no vence',
      calorias: null,
      proteina: null,
      notas: 'Esencial',
      simbolos: ['R'],
    },
  ];

  beforeEach(() => {
    mockEditar.mockClear();
    mockEliminar.mockClear();
  });

  it('debe mostrar una tabla con los insumos', () => {
    render(
      <InsumoTable
        cargando={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByText('Arroz blanco')).toBeInTheDocument();
    expect(screen.getByText('Sal')).toBeInTheDocument();
  });

  it('debe mostrar un spinner cuando está cargando', () => {
    render(
      <InsumoTable
        loading={true}
        insumos={[]}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByLabelText(/cargando inventario/i)).toBeInTheDocument();
  });

  it('debe mostrar mensaje vacío cuando no hay insumos', () => {
    render(
      <InsumoTable
        loading={false}
        insumos={[]}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByLabelText(/no hay insumos/i)).toBeInTheDocument();
  });

  it('debe hacer clic en editar para un insumo', async () => {
    const user = userEvent.setup();
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    const btnEditar = screen.getByLabelText(/editar arroz blanco/i);
    await user.click(btnEditar);

    expect(mockEditar).toHaveBeenCalledWith(insumosEjemplo[0]);
  });

  it('debe hacer clic en eliminar para un insumo', async () => {
    const user = userEvent.setup();
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    const btnEliminar = screen.getByLabelText(/eliminar arroz blanco/i);
    await user.click(btnEliminar);

    expect(mockEliminar).toHaveBeenCalledWith(insumosEjemplo[0]);
  });

  it('debe mostrar la categoría del insumo', () => {
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByLabelText(/categoría: alimentos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría: especias/i)).toBeInTheDocument();
  });

  it('debe mostrar vencimiento "no vence" como símbolo infinito', () => {
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByLabelText(/no vence/i)).toBeInTheDocument();
  });

  it('debe mostrar las calorías y proteínas correctamente', () => {
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('3g')).toBeInTheDocument();
  });

  it('debe tener una tabla con encabezados semánticos', () => {
    render(
      <InsumoTable
        loading={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    // Verificar que hay encabezados visibles en la tabla
    const headers = screen.queryAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('debe mostrar las notas en la columna correspondiente', () => {
    render(
      <InsumoTable
        cargando={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    expect(screen.getByText('Esencial')).toBeInTheDocument();
  });

  it('debe tener la primera celda de datos como th scope="row"', () => {
    const { container } = render(
      <InsumoTable
        cargando={false}
        insumos={insumosEjemplo}
        simbolosDef={simbolosDef}
        onEditar={mockEditar}
        onEliminar={mockEliminar}
      />
    );

    // Buscar la primera celda de datos en una fila de insumo
    const thRows = container.querySelectorAll('th[scope="row"]');
    expect(thRows.length).toBeGreaterThan(0);
  });
});
