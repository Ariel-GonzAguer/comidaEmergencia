import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirm from '../components/DeleteConfirm';

describe('DeleteConfirm', () => {
  const mockConfirmar = vi.fn();
  const mockCancelar = vi.fn();

  beforeEach(() => {
    mockConfirmar.mockClear();
    mockCancelar.mockClear();
  });

  it('debe mostrar el nombre del insumo a eliminar', () => {
    render(
      <DeleteConfirm nombre="Arroz blanco" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />
    );
    expect(screen.getByText(/Arroz blanco/i)).toBeInTheDocument();
  });

  it('debe tener role="dialog" y aria-modal="true"', () => {
    const { container } = render(
      <DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('debe llamar onConfirmar al hacer clic en confirmar', async () => {
    const user = userEvent.setup();
    render(<DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />);

    const btnConfirmar = screen.getByRole('button', { name: /confirmar/i });
    await user.click(btnConfirmar);

    expect(mockConfirmar).toHaveBeenCalledOnce();
  });

  it('debe llamar onCancelar al hacer clic en cancelar', async () => {
    const user = userEvent.setup();
    render(<DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />);

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    await user.click(btnCancelar);

    expect(mockCancelar).toHaveBeenCalledOnce();
  });

  it('debe cerrar al presionar Escape', async () => {
    const user = userEvent.setup();
    render(<DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />);

    await user.keyboard('{Escape}');

    expect(mockCancelar).toHaveBeenCalled();
  });

  it('debe cerrar al hacer clic fuera del diálogo', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />
    );

    const backdrop = container.querySelector('.bg-black\\/70');
    await user.click(backdrop);

    expect(mockCancelar).toHaveBeenCalled();
  });

  it('debe mantener el foco dentro del diálogo (focus trap)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DeleteConfirm nombre="Test" onConfirmar={mockConfirmar} onCancelar={mockCancelar} />
    );

    const btns = container.querySelectorAll('button');
    const primero = btns[0];
    const ultimo = btns[btns.length - 1];

    // Tab desde el último botón debería ir al primero
    ultimo.focus();
    await user.keyboard('{Tab}');
    expect(primero).toHaveFocus();
  });
});
