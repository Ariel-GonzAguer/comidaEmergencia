import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'backend',
          environment: 'node',
          include: ['server/**/*.test.js', 'cli/**/*.test.js'],
        },
      },
      // Proyecto del cliente: usa su propia config (plugins de React, jsdom y setup)
      'client/vitest.config.js',
    ],
  },
});
