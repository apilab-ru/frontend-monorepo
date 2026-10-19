import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';
import { providePrimeNG } from 'primeng/config';

// Keep Filecab's Lara light-blue theme across applications and Storybook.
const FilecabLara = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});

export function provideFilecabTheme() {
  return providePrimeNG({
    theme: { preset: FilecabLara, options: { darkModeSelector: false } },
  });
}
