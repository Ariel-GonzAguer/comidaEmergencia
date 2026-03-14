import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';

describe('Header', () => {
  it('debe renderizar el título "Comida Emergencia"', () => {
    const onNuevo = vi.fn();
    render(<Header onNuevo={onNuevo} total={0} />);
    expect(screen.getByText(/Comida Emergencia/i)).toBeInTheDocument();
  });

  it('debe mostrar el total de insumos', () => {
    const onNuevo = vi.fn();
    render(<Header onNuevo={onNuevo} total={42} />);
    expect(screen.getByText(/Insumos totales: 42/i)).toBeInTheDocument();
  });

  it('debe llamar onNuevo al hacer clic en "+ agregar"', async () => {
    const onNuevo = vi.fn();
    const user = userEvent.setup();
    render(<Header onNuevo={onNuevo} total={0} />);

    const btn = screen.getByRole('button', { name: /agregar nuevo insumo/i });
    await user.click(btn);

    expect(onNuevo).toHaveBeenCalledOnce();
  });

  it('debe mostrar los símbolos de referencia (*,  V, R, PS)', () => {
    const onNuevo = vi.fn();
    render(<Header onNuevo={onNuevo} total={0} />);

    expect(screen.getByText('Vence este año (2026)')).toBeInTheDocument();
    expect(screen.getByText('Ya vencido')).toBeInTheDocument();
    expect(screen.getByText('Reponer')).toBeInTheDocument();
    expect(screen.getByText('Pronto sacar (Reponer asumido)')).toBeInTheDocument();
  });

  it('debe tener aria-live="polite" en el contador de insumos', () => {
    const onNuevo = vi.fn();
    render(<Header onNuevo={onNuevo} total={5} />);

    const counter = screen.getByText(/Insumos totales:/);
    expect(counter.getAttribute('aria-live')).toBe('polite');
  });
});
