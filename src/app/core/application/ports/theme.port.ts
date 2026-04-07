export abstract class ThemePort {
  abstract readonly isDark: () => boolean;
  abstract init(): void;
  abstract toggle(): void;
}
