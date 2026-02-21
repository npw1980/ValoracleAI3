import { chromium, type Browser, type Page } from 'playwright';

interface UXFinding {
  page: string;
  category: 'broken' | 'missing' | 'confusing' | 'incomplete' | 'working';
  element: string;
  issue?: string;
  details: string;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Map page names to routes
const ROUTES: Record<string, string> = {
  'Dashboard': '/',
  'Assets': '/assets',
  'Projects': '/projects',
  'Contracts': '/contracts',
  'Settings': '/settings',
  'Billing': '/billing',
};

const PAGES = [
  { name: 'Dashboard', checks: ['stats cards', 'navigation', 'quick actions'] },
  { name: 'Assets', checks: ['asset list', 'filters', 'search', 'create button'] },
  { name: 'Projects', checks: ['project cards', 'status', 'create button'] },
  { name: 'Contracts', checks: ['contract list', 'status badges', 'create form'] },
  { name: 'Settings', checks: ['form fields', 'save button', 'tabs'] },
  { name: 'Billing', checks: ['billing info', 'payment methods', 'history'] },
];

async function checkPage(page: Page, name: string, checks: string[]): Promise<UXFinding[]> {
  const findings: UXFinding[] = [];
  const path = ROUTES[name] || '/';

  try {
    console.log(`   Navigating to ${BASE_URL}${path}...`);
    const response = await page.goto(`${BASE_URL}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    if (!response || response.status() >= 400) {
      findings.push({ page: name, category: 'broken', element: 'page', issue: `HTTP ${response?.status()}`, details: 'Page returned error' });
      return findings;
    }

    await page.waitForTimeout(2000);

    // Check page loaded
    const bodyText = await page.locator('body').innerText();
    if (!bodyText || bodyText.length < 50) {
      findings.push({ page: name, category: 'broken', element: 'page', issue: 'Empty or not loaded', details: 'Page content appears empty' });
      return findings;
    }

    console.log(`   Page loaded, content length: ${bodyText.length}`);

    // Dashboard specific checks
    if (name === 'Dashboard') {
      const hasCards = await page.locator('[class*="card"], .grid, [class*="stat"]').count();
      if (hasCards === 0) {
        findings.push({ page: name, category: 'incomplete', element: 'stats cards', issue: 'No dashboard cards found', details: 'Expected to see stats/recent activity cards' });
      }

      const hasNav = await page.locator('nav, .sidebar').count();
      if (hasNav === 0) {
        findings.push({ page: name, category: 'broken', element: 'navigation', issue: 'No navigation found', details: 'Sidebar or nav should be present' });
      }
    }

    // Assets page checks
    if (name === 'Assets') {
      const hasTable = await page.locator('table, [class*="table"]').count();
      const hasList = await page.locator('[class*="list"], [class*="asset"]').count();

      if (hasTable === 0 && hasList === 0) {
        findings.push({ page: name, category: 'incomplete', element: 'asset list', issue: 'No asset display found', details: 'Expected table or list of assets' });
      }

      const hasCreateBtn = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New"), [class*="create"]').count();
      if (hasCreateBtn === 0) {
        findings.push({ page: name, category: 'missing', element: 'create button', issue: 'No create/add button', details: 'User should be able to create assets' });
      }
    }

    // Projects page checks
    if (name === 'Projects') {
      const hasProjectCards = await page.locator('[class*="project"], .card, [class*="item"]').count();
      if (hasProjectCards < 3) {
        findings.push({ page: name, category: 'incomplete', element: 'project cards', issue: 'Few or no project cards', details: `Found ${hasProjectCards} project items` });
      }
    }

    // Contracts page checks
    if (name === 'Contracts') {
      const hasForm = await page.locator('form').count();
      if (hasForm > 0) {
        const inputs = await page.locator('form input, form textarea').count();
        if (inputs > 0) {
          await page.locator('form input').first().fill('Test Contract');

          const submitBtn = page.locator('form button[type="submit"]');
          if (await submitBtn.count() > 0) {
            await submitBtn.first().click();
            await page.waitForTimeout(1000);

            const newUrl = page.url();
            if (newUrl.includes('contracts')) {
              findings.push({ page: name, category: 'incomplete', element: 'create form', issue: 'Form submission does nothing', details: 'Submit clicked but no action taken' });
            }
          }
        }
      }
    }

    // Settings page checks
    if (name === 'Settings') {
      const tabs = await page.locator('[class*="tab"], [role="tab"]').count();
      if (tabs === 0) {
        findings.push({ page: name, category: 'incomplete', element: 'tabs', issue: 'No settings tabs found', details: 'Expected tabs for different settings categories' });
      }

      const inputs = await page.locator('input, select, textarea').count();
      if (inputs > 0) {
        const saveBtn = await page.locator('button:has-text("Save"), button:has-text("Update")').count();
        if (saveBtn === 0) {
          findings.push({ page: name, category: 'missing', element: 'save button', issue: 'No save/update button', details: 'Form has inputs but no save button' });
        }
      }
    }

    // Check for loading states that never resolve
    const loading = await page.locator('.loading, [data-loading]').count();
    if (loading > 0) {
      await page.waitForTimeout(2000);
      const stillLoading = await page.locator('.loading, [data-loading]').count();
      if (stillLoading > 0) {
        findings.push({ page: name, category: 'broken', element: 'loading state', issue: 'Stuck in loading state', details: 'Loading indicator present after 2+ seconds' });
      }
    }

    // Check for error toasts
    const errors = await page.locator('[class*="error"], .toast-error, [role="alert"]').count();
    if (errors > 0) {
      findings.push({ page: name, category: 'broken', element: 'error display', issue: 'Page shows error', details: 'Error message visible on page' });
    }

    // If we got here with no issues, mark as working
    if (findings.length === 0) {
      findings.push({ page: name, category: 'working', element: 'page', details: 'Page loads without errors' });
    }

  } catch (e) {
    findings.push({ page: name, category: 'broken', element: 'page load', issue: 'Failed to load', details: String(e) });
  }

  return findings;
}

async function main() {
  console.log('🔍 Running UX Audit...\n');
  console.log(`BASE_URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const allFindings: UXFinding[] = [];

  for (const p of PAGES) {
    console.log(`📄 ${p.name}...`);
    const page = await browser.newPage();
    const findings = await checkPage(page, p.name, p.checks);
    allFindings.push(...findings);
    await page.close();
  }

  await browser.close();

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('🔍 UX AUDIT RESULTS');
  console.log('='.repeat(60));

  const broken = allFindings.filter(f => f.category === 'broken');
  const missing = allFindings.filter(f => f.category === 'missing');
  const incomplete = allFindings.filter(f => f.category === 'incomplete');
  const working = allFindings.filter(f => f.category === 'working');

  console.log(`\n✅ Working: ${working.length}`);
  console.log(`⚠️  Incomplete: ${incomplete.length}`);
  console.log(`❌ Missing: ${missing.length}`);
  console.log(`🚫 Broken: ${broken.length}`);

  if (broken.length > 0) {
    console.log('\n🚫 BROKEN:');
    broken.forEach(f => console.log(`   ${f.page}: ${f.element} - ${f.issue}`));
  }

  if (missing.length > 0) {
    console.log('\n❌ MISSING:');
    missing.forEach(f => console.log(`   ${f.page}: ${f.element} - ${f.issue}`));
  }

  if (incomplete.length > 0) {
    console.log('\n⚠️  INCOMPLETE:');
    incomplete.forEach(f => console.log(`   ${f.page}: ${f.element} - ${f.issue}`));
  }

  // Generate markdown report
  const md = `# ValOracle UX Audit Report

**Date:** ${new Date().toISOString().split('T')[0]}

## Summary

| Status | Count |
|--------|-------|
| ✅ Working | ${working.length} |
| ⚠️  Incomplete | ${incomplete.length} |
| ❌ Missing | ${missing.length} |
| 🚫 Broken | ${broken.length} |

## Detailed Findings

${allFindings.map(f => {
  const icon = f.category === 'working' ? '✅' : f.category === 'incomplete' ? '⚠️' : f.category === 'missing' ? '❌' : '🚫';
  return `### ${icon} ${f.page}: ${f.element}

- **Category:** ${f.category}
- **Details:** ${f.details}
${f.issue ? `- **Issue:** ${f.issue}` : ''}
`;
}).join('\n')}

## Recommendations

${missing.length > 0 ? '- Add missing UI elements (create buttons, save buttons, etc.)' : ''}
${incomplete.length > 0 ? '- Complete incomplete features (form submissions, data displays)' : ''}
${broken.length > 0 ? '- Fix broken elements (loading states, error handling)' : ''}
- Consider adding loading states for async operations
- Add form validation feedback
`;

  const fs = await import('fs');
  fs.writeFileSync('./tests/e2e/UX-AUDIT-REPORT.md', md);
  console.log('\n📁 Report saved to: tests/e2e/UX-AUDIT-REPORT.md');
}

main().catch(console.error);
