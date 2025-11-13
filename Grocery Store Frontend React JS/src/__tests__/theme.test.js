import theme from '../theme';

describe('theme', () => {
  it('should have primary color defined', () => {
    expect(theme.palette.primary).toBeDefined();
    expect(theme.palette.primary.main).toBe('#0c831f');
    expect(theme.palette.primary.dark).toBe('#0a6b19');
    expect(theme.palette.primary.light).toBe('#3da34f');
  });

  it('should have secondary color defined', () => {
    expect(theme.palette.secondary).toBeDefined();
    expect(theme.palette.secondary.main).toBe('#f8cb46');
  });

  it('should have typography settings', () => {
    expect(theme.typography).toBeDefined();
    expect(theme.typography.fontFamily).toBe('"Okra", "Helvetica", "Arial", sans-serif');
    expect(theme.typography.button.textTransform).toBe('none');
    expect(theme.typography.button.fontWeight).toBe(600);
  });

  it('should have palette background settings', () => {
    expect(theme.palette.background).toBeDefined();
    expect(theme.palette.background.default).toBe('#f7f8f8');
    expect(theme.palette.background.paper).toBe('#ffffff');
  });

  it('should have text color settings', () => {
    expect(theme.palette.text.primary).toBe('#1c1c1c');
    expect(theme.palette.text.secondary).toBe('#666666');
  });

  it('should have shape settings', () => {
    expect(theme.shape.borderRadius).toBe(8);
  });

  it('should have MuiButton component overrides', () => {
    expect(theme.components.MuiButton.styleOverrides.root).toBeDefined();
    expect(theme.components.MuiButton.styleOverrides.root.borderRadius).toBe(8);
    expect(theme.components.MuiButton.styleOverrides.root.fontWeight).toBe(600);
  });

  it('should be a valid Material-UI theme object', () => {
    expect(theme).toHaveProperty('palette');
    expect(theme).toHaveProperty('typography');
    expect(theme).toHaveProperty('spacing');
    expect(theme).toHaveProperty('components');
  });
});

