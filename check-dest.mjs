import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.goto('http://localhost:3000/destinations', { waitUntil: 'networkidle', timeout: 15000 });
// Wait for any suspense to resolve
await p.waitForTimeout(2000);
const body = await p.textContent('body');
const has = body.includes('E2E') || body.includes('e2e-dest');
console.log('Has E2E dest:', has);
// Find all h3 tags (destination names)
const h3s = await p.locator('h3').allTextContents();
console.log('H3 texts:', h3s.slice(0,5));
// Count links
const links = await p.locator('a[href*="/destinations/"]').count();
console.log('Dest links:', links);
// Check if our slug appears in href
const slugLinks = await p.locator('a[href*="e2e-dest"]').count();
console.log('e2e-dest links:', slugLinks);
await b.close();
