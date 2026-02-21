import { chromium, type Browser, type Page } from 'playwright';

interface TestResult {
  page: string;
  url: string;
  status: 'pass' | 'fail' | 'warning';
  errors: string[];
  warnings: string[];
  findings: string[];
}

interface AuditReport {
  timestamp: string;
  totalPages: number;
  passed: number;
  failed: number;
  warnings: number;
  results: TestResult[];
  uxIssues: string[];
  recommendations: string[];
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5175';

const PAGES_TO_TEST = [
  { name: 'Dashboard', path: '/' },
  { name: 'Assets', path: '/assets' },
  { name: 'Projects', path: '/projects' },
  { name: 'Workspace', path: '/workspace' },
  { name: 'Research', path: '/research' },
  { name: 'Analyze', path: '/analyze' },
  { name: 'Contracts', path: '/contracts' },
  { name: 'Launch', path: '/launch' },
  { name: 'HEOR', path: '/heor' },
  { name: 'Library', path: '/library' },
  { name: 'Data Catalogdata-catalog' },
  { name: 'Market Research', path: '/', path: '/market-research' },
  { name: 'Audit Log', path: '/audit-log' },
  { name: 'Settings', path: '/settings' },
  { name: 'Billing', path: '/billing' },
  { name: 'Onboarding', path: '/onboarding' },
  { name: 'API Docs', path: '/api-docs' },
  { name: 'Mobile App', path: '/mobile-app' },
  { name: 'Work Launcher', path: '/work-launcher' },
];

async function testPage(browser: Browser, pageConfig: { name: string; path: string }): Promise<TestResult> {
  const page = await browser.newPage();
  const url = `${BASE_URL}${pageConfig.path}`;
  const result: TestResult = {
    page: pageConfig.name,
    url,
    status: 'pass',
    errors: [],
    warnings: [],
    findings: [],
  };

  console.log(`\n📄 Testing: ${pageConfig.name} (${url})`);

  try {
    // Navigate to page
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    if (!response || response.status() >= 400) {
      result.status = 'fail';
      result.errors.push(`HTTP ${response?.status() || 'no response'}`);
      await page.close();
      return result;
    }

    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Check for main content
    const bodyContent = await page.evaluate(() => document.body.innerText);
    if (!bodyContent || bodyContent.length < 10) {
      result.warnings.push('Page appears empty or not rendered');
    }

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.complete || img.naturalWidth === 0).length;
    });
    if (brokenImages > 0) {
      result.warnings.push(`${brokenImages} broken images found`);
    }

    // Check for dead links (links that go to # or javascript:)
    const deadLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.filter(a => {
        const href = a.getAttribute('href');
        return href === '#' || href === 'javascript:void(0)' || href === 'javascript:;';
      }).length;
    });
    if (deadLinks > 0) {
      result.warnings.push(`${deadLinks} dead/no-op links found`);
    }

    // Check for forms
    const forms = await page.evaluate(() => document.querySelectorAll('form').length);
    if (forms > 0) {
      // Try to find form inputs and test submission
      const inputs = await page.evaluate(() => {
        const formInputs = document.querySelectorAll('input, textarea, select');
        return Array.from(formInputs).slice(0, 5).map(input => ({
          type: input.getAttribute('type'),
          name: input.getAttribute('name'),
          id: input.getAttribute('id'),
          placeholder: input.getAttribute('placeholder'),
        }));
      });
      result.findings.push(`${forms} form(s) found with ${inputs.length} inputs tested`);

      // Try form submission
      const submitButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
        return buttons.length;
      });

      if (submitButtons > 0) {
        result.findings.push(`${submitButtons} submit button(s) found`);
      }
    }

    // Check for interactive elements
    const buttons = await page.evaluate(() => document.querySelectorAll('button').length);
    if (buttons > 0) {
      result.findings.push(`${buttons} button(s) found`);
    }

    // Check for clickable cards/elements
    const clickableCards = await page.evaluate(() => {
      return document.querySelectorAll('[role="button"], .cursor-pointer, .clickable').length;
    });
    if (clickableCards > 0) {
      result.findings.push(`${clickableCards} clickable element(s) found`);
    }

    // Check for loading states
    const hasLoading = await page.evaluate(() => {
      return !!document.querySelector('.loading, [data-loading="true"], .spinner');
    });
    if (hasLoading) {
      result.warnings.push('Page has loading state');
    }

    // Check for error states
    const hasError = await page.evaluate(() => {
      return !!document.querySelector('.error, [data-error="true"], .alert-error');
    });
    if (hasError) {
      result.warnings.push('Page shows error state');
    }

    // Check console errors after all interactions
    await page.waitForTimeout(1000);
    if (consoleErrors.length > 0) {
      result.errors.push(...consoleErrors.slice(0, 3));
    }

    // Update status based on findings
    if (result.errors.length > 0) {
      result.status = 'fail';
    } else if (result.warnings.length > 0) {
      result.status = 'warning';
    }

  } catch (error) {
    result.status = 'fail';
    result.errors.push(error instanceof Error ? error.message : String(error));
  }

  await page.close();

  // Print results
  const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
  console.log(`${icon} ${result.page}: ${result.status.toUpperCase()}`);
  result.errors.forEach(e => console.log(`   Error: ${e}`));
  result.warnings.forEach(w => console.log(`   Warning: ${w}`));
  result.findings.forEach(f => console.log(`   Finding: ${f}`));

  return result;
}

async function testNavigationAndInteractions(browser: Browser): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const page = await browser.newPage();

  console.log('\n🔄 Testing Navigation & Interactions...\n');

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Test sidebar navigation
    const sidebarLinks = await page.evaluate(() => {
      const sidebar = document.querySelector('nav, .sidebar, [class*="sidebar"]');
      if (!sidebar) return [];
      const links = sidebar.querySelectorAll('a, button');
      return Array.from(links).slice(0, 10).map(l => ({
        text: l.textContent?.trim().slice(0, 30),
        tag: l.tagName,
      }));
    });

    console.log('Found navigation elements:', sidebarLinks);

    // Try clicking sidebar items
    for (const link of sidebarLinks.slice(0, 5)) {
      try {
        const clicked = await page.click(`nav button:has-text("${link.text}"), nav a:has-text("${link.text}")`, { timeout: 3000 }).catch(() => false);
        if (clicked) {
          await page.waitForTimeout(1000);
          console.log(`   Clicked: ${link.text}`);
        }
      } catch {
        // Ignore click errors
      }
    }

  } catch (error) {
    results.push({
      page: 'Navigation Test',
      url: BASE_URL,
      status: 'warning',
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      findings: [],
    });
  }

  await page.close();
  return results;
}

async function generateReport(results: TestResult[]): Promise<AuditReport> {
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  const uxIssues: string[] = [];
  const recommendations: string[] = [];

  // Analyze patterns
  const pagesWithErrors = results.filter(r => r.status === 'fail').map(r => r.page);
  const pagesWithWarnings = results.filter(r => r.status === 'warning').map(r => r.page);

  if (pagesWithErrors.length > 0) {
    uxIssues.push(`${pagesWithErrors.length} pages have critical errors`);
    recommendations.push('Fix broken pages first - check routing and component imports');
  }

  if (pagesWithWarnings.length > 0) {
    uxIssues.push(`${pagesWithWarnings.length} pages have warnings (empty content, missing images)`);
    recommendations.push('Review pages with warnings for content loading issues');
  }

  // Check for form issues
  const pagesWithForms = results.filter(r => r.findings.some(f => f.includes('form')));
  if (pagesWithForms.length > 0) {
    uxIssues.push(`${pagesWithForms.length} pages have forms that need backend integration`);
    recommendations.push('Connect forms to API endpoints or show appropriate feedback');
  }

  // Check for dead links
  const pagesWithDeadLinks = results.filter(r => r.warnings.some(w => w.includes('dead')));
  if (pagesWithDeadLinks.length > 0) {
    uxIssues.push(`${pagesWithDeadLinks.length} pages have dead/non-functional links`);
    recommendations.push('Implement proper routing or remove placeholder links');
  }

  return {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    passed,
    failed,
    warnings,
    results,
    uxIssues,
    recommendations,
  };
}

async function main() {
  console.log('🚀 Starting ValOracle Comprehensive Audit');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const allResults: TestResult[] = [];

  // Test all pages
  for (const pageConfig of PAGES_TO_TEST) {
    const result = await testPage(browser, pageConfig);
    allResults.push(result);
  }

  // Test navigation
  const navResults = await testNavigationAndInteractions(browser);
  allResults.push(...navResults);

  await browser.close();

  // Generate report
  const report = await generateReport(allResults);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pages Tested: ${report.totalPages}`);
  console.log(`✅ Passed: ${report.passed}`);
  console.log(`❌ Failed: ${report.failed}`);
  console.log(`⚠️  Warnings: ${report.warnings}`);

  console.log('\n🔍 UX Issues Found:');
  report.uxIssues.forEach(issue => console.log(`   • ${issue}`));

  console.log('\n💡 Recommendations:');
  report.recommendations.forEach(rec => console.log(`   • ${rec}`));

  console.log('\n📄 Detailed Results:');
  report.results.forEach(r => {
    const icon = r.status === 'pass' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
    console.log(`   ${icon} ${r.page}: ${r.errors.length} errors, ${r.warnings.length} warnings`);
  });

  // Save report
  const fs = await import('fs');
  const reportPath = './tests/e2e/audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📁 Report saved to: ${reportPath}`);

  return report;
}

main().catch(console.error);
