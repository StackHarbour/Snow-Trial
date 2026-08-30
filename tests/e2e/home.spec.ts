import { test, expect } from '@playwright/test';

test('homepage exposes primary snow search and trust navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Know where the snow is coming/i })).toBeVisible();
  await expect(page.getByPlaceholder(/city, mountain, resort, or ZIP/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Methodology/i }).first()).toBeVisible();
});

test('methodology page explains provider and uncertainty boundaries', async ({ page }) => {
  await page.goto('/methodology');
  await expect(page.getByRole('heading', { name: /Forecast depth without pretending uncertainty/i })).toBeVisible();
  await expect(page.getByText(/NOAA \/ National Weather Service/i).first()).toBeVisible();
});
