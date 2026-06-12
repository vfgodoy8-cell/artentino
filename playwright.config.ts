import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: path.resolve(__dirname, '.env.test'), override: true })

const TEST_BASE_URL = 'http://localhost:3001'

const testEnv: Record<string, string> = {
  DATABASE_URL: process.env.DATABASE_URL_TEST ?? '',
  NEXTAUTH_URL: TEST_BASE_URL,
  NEXT_PUBLIC_BASE_URL: TEST_BASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'artentino-test-secret-minimo-32-chars!!',
}

// Pass through required external-service keys (tests mock MP; others can be empty)
for (const key of ['MP_ACCESS_TOKEN', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'RESEND_API_KEY']) {
  testEnv[key] = process.env[key] ?? 'test-placeholder'
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: TEST_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /specs\/.*\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'next dev --port 3001',
    url: TEST_BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: testEnv,
    timeout: 120_000,
  },

  globalSetup: './e2e/global-setup.ts',
})
