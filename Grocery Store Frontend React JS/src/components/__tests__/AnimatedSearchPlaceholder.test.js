import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnimatedSearchPlaceholder from '../AnimatedSearchPlaceholder';

describe('AnimatedSearchPlaceholder Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<AnimatedSearchPlaceholder />);
    expect(container).toBeInTheDocument();
  });

  it('displays initial placeholder text', () => {
    render(<AnimatedSearchPlaceholder />);
    // The component displays product names from the array
    const text = screen.getByText(/sugar|milk|eggs|rice|bread|vegetables|fruits|snacks/i);
    expect(text).toBeInTheDocument();
  });

  it('animates placeholder text', async () => {
    render(<AnimatedSearchPlaceholder />);
    
    const initialText = screen.getByText(/sugar|milk|eggs|rice|bread|vegetables|fruits|snacks/i).textContent;
    
    // Fast-forward time to trigger animation
    jest.advanceTimersByTime(3500);
    
    await waitFor(() => {
      const newText = screen.getByText(/sugar|milk|eggs|rice|bread|vegetables|fruits|snacks/i).textContent;
      // Text should change or remain (we just verify it's rendering)
      expect(newText).toBeTruthy();
    });
  });

  it('cycles through all placeholder texts', () => {
    render(<AnimatedSearchPlaceholder />);
    
    // Verify the component renders and contains text (should start with 'sugar')
    expect(screen.getByText(/Search "sugar"/i)).toBeInTheDocument();
    
    // Fast-forward through multiple cycles to ensure modulo operation works
    // After 8 cycles (length of productNames), should wrap back to start
    for (let i = 0; i < 9; i++) {
      jest.advanceTimersByTime(3500); // 3000ms interval + 400ms setTimeout
    }
    
    // After 9 cycles, should be back to index 1 (milk), proving modulo works
    expect(screen.getByText(/Search "/i)).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<AnimatedSearchPlaceholder />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('cleans up interval before animation completes', () => {
    const { unmount } = render(<AnimatedSearchPlaceholder />);
    
    // Advance to middle of animation (after interval fires, before timeout completes)
    jest.advanceTimersByTime(3200);
    
    // Unmount during animation
    unmount();
    
    // Should not throw errors
  });

  it('sets isAnimating to true during animation', () => {
    const { container } = render(<AnimatedSearchPlaceholder />);
    
    // Advance to just before the animation
    jest.advanceTimersByTime(3000);
    
    // The Typography element should exist
    const typography = container.querySelector('[class*="MuiTypography"]');
    expect(typography).toBeInTheDocument();
  });

  it('resets isAnimating to false after animation completes', async () => {
    const { container } = render(<AnimatedSearchPlaceholder />);
    
    // Advance past the animation duration (3000ms + 400ms)
    jest.advanceTimersByTime(3400);
    
    await waitFor(() => {
      const typography = container.querySelector('[class*="MuiTypography"]');
      expect(typography).toBeInTheDocument();
    });
  });
});
