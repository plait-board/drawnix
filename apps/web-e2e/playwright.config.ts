// Import Playwright's configuration utilities and device presets
// defineConfig: Provides type-safe configuration with IntelliSense
// devices: Pre-configured browser settings for different platforms
import { defineConfig, devices } from '@playwright/test';

// Import Nx's E2E testing preset for monorepo integration
// Provides standardized configuration for Nx workspace E2E tests
import { nxE2EPreset } from '@nx/playwright/preset';

// Import workspace root utility for consistent path resolution
// Ensures tests work correctly regardless of execution context
import { workspaceRoot } from '@nx/devkit';

// Base URL configuration for test execution
// Uses environment variable for CI/CD flexibility, defaults to local dev server
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:7200';

/**
 * Environment variable configuration (currently disabled)
 * To enable: uncomment require('dotenv').config(); 
 * Used to load environment variables from .env file for test configuration
 * https://github.com/motdotla/dotenv
 */

/**
 * Playwright E2E test configuration for Drawnix web application
 * Provides comprehensive testing across multiple browsers and platforms
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Inherit Nx E2E preset configuration for monorepo consistency
  // Automatically configures test directory, output paths, and reporting
  ...nxE2EPreset(__filename, { testDir: './src' }),
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Base URL for all relative navigation commands in tests
    baseURL,
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // Trace collection helps debug failed tests with detailed execution logs
    // Only collected on retry to avoid performance impact on passing tests
    trace: 'on-first-retry',
  },
  
  /* Run your local dev server before starting the tests */
  // Automatically starts the development server before running E2E tests
  // Ensures tests run against a live application instance
  webServer: {
    // Command to start the Drawnix web application
    command: 'npx nx serve web',
    
    // URL where the application will be available
    url: 'http://localhost:7200',
    
    // Reuse existing server in development, start fresh in CI
    // Improves developer experience by not killing existing dev servers
    reuseExistingServer: !process.env.CI,
    
    // Execute commands from workspace root for proper context
    cwd: workspaceRoot,
  },
  
  // Browser configuration matrix for comprehensive testing
  // Tests run across multiple browsers to ensure cross-browser compatibility
  projects: [
    {
      // Chromium-based testing (Chrome, Edge, etc.)
      // Primary browser for most users, comprehensive feature support
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      // Firefox testing for Gecko engine compatibility
      // Ensures compatibility with Firefox users and different rendering engine
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      // WebKit testing for Safari compatibility
      // Critical for Mac/iOS users and WebKit-specific behaviors
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browser testing (currently disabled)
    // Uncomment when mobile responsiveness testing is needed
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Branded browser testing (currently disabled)
    // Uncomment for testing with specific browser channels
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
