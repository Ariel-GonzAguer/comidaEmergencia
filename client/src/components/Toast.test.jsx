import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('debe renderizar mensaje de éxito', () => {
    render(<Toast msg="Insumo guardado" tipo="ok" />);
    expect(screen.getByText(/Insumo guardado/i)).toBeInTheDocument();
  });

  it('debe renderizar mensaje de error', () => {
    render(<Toast msg="Error al guardar" tipo="error" />);
    expect(screen.getByText(/Error al guardar/i)).toBeInTheDocument();
  });

  it('debe tener role="status" para éxito', () => {
    const { container } = render(<Toast msg="Éxito" tipo="ok" />);
    const toast = container.firstChild;
    expect(toast.getAttribute('role')).toBe('status');
  });

  it('debe tener role="alert" para error', () => {
    const { container } = render(<Toast msg="Error" tipo="error" />);
    const toast = container.firstChild;
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('debe tener aria-live="polite" para éxito', () => {
    const { container } = render(<Toast msg="Éxito" tipo="ok" />);
    const toast = container.firstChild;
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });

  it('debe tener aria-live="assertive" para error', () => {
    const { container } = render(<Toast msg="Error" tipo="error" />);
    const toast = container.firstChild;
    expect(toast.getAttribute('aria-live')).toBe('assertive');
  });

  it('debe mostrar ✓ para éxito', () => {
    const { container } = render(<Toast msg="Éxito" tipo="ok" />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon.textContent).toBe('✓');
  });

  it('debe mostrar ✕ para error', () => {
    const { container } = render(<Toast msg="Error" tipo="error" />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon.textContent).toBe('✕');
  });

  it('debe tener aria-label="Éxito" para tipo ok', () => {
    const { container } = render(<Toast msg="Éxito" tipo="ok" />);
    const toast = container.querySelector('[role="status"]');
    expect(toast.getAttribute('aria-label')).toBe('Éxito');
  });

  it('debe tener aria-label="Error" para tipo error', () => {
    const { container } = render(<Toast msg="Error" tipo="error" />);
    const toast = container.querySelector('[role="alert"]');
    expect(toast.getAttribute('aria-label')).toBe('Error');
  });

  it('debe tener aria-atomic="true"', () => {
    const { container } = render(<Toast msg="Mensaje" tipo="ok" />);
    const toast = container.firstChild;
    expect(toast.getAttribute('aria-atomic')).toBe('true');
  });
});
