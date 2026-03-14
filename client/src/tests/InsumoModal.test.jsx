import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsumoModal from '../components/InsumoModal';

describe('InsumoModal', () => {
  const categorias = ['alimentos', 'especias', 'bebidas', 'higiene', 'otros'];
  const simbolosDef = [
    { codigo: 'V', descripcion: 'Ya vencido' },
    { codigo: '*', descripcion: 'Vence este año' },
    { codigo: 'R', descripcion: 'Reponer' },
    { codigo: 'PS', descripcion: 'Pronto sacar' },
  ];
  const mockGuardar = vi.fn();
  const mockCerrar = vi.fn();

  beforeEach(() => {
    mockGuardar.mockClear();
    mockCerrar.mockClear();
  });

  it('debe renderizar el formulario en modo crear', () => {
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    expect(screen.getByText(/nuevo insumo/i)).toBeInTheDocument();
  });

  it('debe renderizar the formulario en modo editar', () => {
    render(
      <InsumoModal
        modo="editar"
        insumoInicial={{
          nombre: 'Arroz',
          cantidad: '1',
          unidad: 'kg',
          categoria: 'alimentos',
          vencimiento: '12-2026',
          calorias: 100,
          proteina: 2,
          notas: '',
          simbolos: [],
        }}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    expect(screen.getByText(/editar insumo/i)).toBeInTheDocument();
  });

  it('debe cerrar al presionar Escape', async () => {
    const user = userEvent.setup();
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    await user.keyboard('{Escape}');
    expect(mockCerrar).toHaveBeenCalled();
  });

  it('debe validar que el nombre sea requerido', async () => {
    const user = userEvent.setup();
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const btnGuardar = screen.getByRole('button', { name: /crear/i });
    await user.click(btnGuardar);

    expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
    expect(mockGuardar).not.toHaveBeenCalled();
  });

  it('debe permitir crear un insumo con datos válidos', async () => {
    const user = userEvent.setup();
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const inputNombre = screen.getByPlaceholderText(/Ej: Arroz blanco/i);
    await user.type(inputNombre, 'Arroz blanco');

    const btnGuardar = screen.getByRole('button', { name: /crear/i });
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(mockGuardar).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Arroz blanco',
        })
      );
    });
  });

  it('debe normalizar la fecha de vencimiento', async () => {
    const user = userEvent.setup();
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const inputNombre = screen.getByPlaceholderText(/Ej: Arroz blanco/i);
    const inputFecha = screen.getByPlaceholderText(/4\/2027/i);

    await user.type(inputNombre, 'Producto');
    await user.type(inputFecha, '4/2027');

    const btnGuardar = screen.getByRole('button', { name: /crear/i });
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(mockGuardar).toHaveBeenCalledWith(
        expect.objectContaining({
          vencimiento: '04-2027',
        })
      );
    });
  });

  it('debe permitir seleccionar símbolos', async () => {
    const user = userEvent.setup();
    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const btnSimboloR = screen.getByLabelText(/Reponer/);
    await user.click(btnSimboloR);
    expect(btnSimboloR.getAttribute('aria-pressed')).toBe('true');
  });

  it('debe tener role="dialog" y aria-modal="true"', () => {
    const { container } = render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('debe mostrar un mensaje de error si onGuardar falla', async () => {
    const user = userEvent.setup();
    mockGuardar.mockRejectedValueOnce(new Error('Error en el servidor'));

    render(
      <InsumoModal
        modo="crear"
        insumoInicial={undefined}
        categorias={categorias}
        simbolosDef={simbolosDef}
        onGuardar={mockGuardar}
        onCerrar={mockCerrar}
      />
    );

    const inputNombre = screen.getByPlaceholderText(/Ej: Arroz blanco/i);
    await user.type(inputNombre, 'Producto');

    const btnGuardar = screen.getByRole('button', { name: /crear/i });
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Error en el servidor/i)).toBeInTheDocument();
    });
  });
});
