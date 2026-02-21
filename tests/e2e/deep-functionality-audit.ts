import { chromium, type Browser, type Page } from 'playwright';

interface Finding {
  category: 'critical' | 'major' | 'minor';
  page: string;
  issue: string;
  details: string;
  recommendation: string;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5175';

async function findFormsAndTestThem(page: Page, pageName: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    // Find all forms
    const forms = await page.locator('form').all();

    for (const form of forms) {
      const formId = await form.getAttribute('id');
      const formClass = await form.getAttribute('class');

      // Find inputs in form
      const inputs = await form.locator('input, textarea, select').all();

      for (const input of inputs) {
        const inputType = await input.getAttribute('type') || 'text';
        const inputName = await input.getAttribute('name') || 'unnamed';
        const placeholder = await input.getAttribute('placeholder');
        const isDisabled = await input.isDisabled();

        if (!isDisabled && inputType !== 'hidden' && inputType !== 'submit') {
          // Try filling the input
          try {
            await input.fill('Test value');
          } catch (e) {
            findings.push({
              category: 'major',
              page: pageName,
              issue: `Cannot fill input: ${inputName}`,
              details: `Type: ${inputType}, Placeholder: ${placeholder || 'none'}`,
              recommendation: 'Check if input is properly rendered'
            });
          }
        }
      }

      // Find submit button
      const submitBtn = form.locator('button[type="submit"], input[type="submit"]');
      const btnCount = await submitBtn.count();

      if (btnCount > 0) {
        const btnText = await submitBtn.first().textContent();
        const btnClass = await submitBtn.first().getAttribute('class');

        // Try clicking submit
        try {
          await submitBtn.first().click();
          await page.waitForTimeout(500);

          // Check if anything happened (error toast, navigation, etc.)
          const url = page.url();

          if (url === `${BASE_URL}/` || url.includes(pageName.toLowerCase())) {
            findings.push({
              category: 'major',
              page: pageName,
              issue: `Form submit does nothing`,
              details: `Button text: ${btnText || 'unnamed'}`,
              recommendation: 'Connect form to API or show feedback'
            });
          }
        } catch (e) {
          findings.push({
            category: 'critical',
            page: pageName,
            issue: `Form submission error`,
            details: String(e),
            recommendation: 'Fix form submission handler'
          });
        }
      }
    }
  } catch (e) {
    findings.push({
      category: 'minor',
      page: pageName,
      issue: 'Error scanning forms',
      details: String(e),
      recommendation: 'Review form handling'
    });
  }

  return findings;
}

async function findButtonsAndTestThem(page: Page, pageName: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    // Find all buttons (excluding nav buttons which we test separately)
    const buttons = await page.locator('button:not([class*="nav"]):not([class*="sidebar"])').all();

    let clickableWithoutAction = 0;

    for (const button of buttons.slice(0, 10)) {
      const btnText = await button.textContent();
      const btnClass = await button.getAttribute('class') || '';
      const isDisabled = await button.isDisabled();

      if (!isDisabled && btnText && btnText.trim().length > 0) {
        const beforeUrl = page.url();

        try {
          await button.click({ timeout: 2000 });
          await page.waitForTimeout(500);
          const afterUrl = page.url();

          if (beforeUrl === afterUrl) {
            // Check if button has any visual feedback
            clickableWithoutAction++;
          }
        } catch (e) {
          // Button might not be clickable
        }
      }
    }

    if (clickableWithoutAction > 3) {
      findings.push({
        category: 'minor',
        page: pageName,
        issue: `${clickableWithoutAction} buttons don't trigger any action`,
        details: 'Multiple buttons appear to be non-functional',
        recommendation: 'Implement button handlers or remove placeholder buttons'
      });
    }
  } catch (e) {
    // Ignore
  }

  return findings;
}

async function checkDeadLinks(page: Page, pageName: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const deadLinks = await page.locator('a[href="#"], a[href="javascript:void(0)"], a[href="javascript:;"]').all();

    if (deadLinks.length > 5) {
      findings.push({
        category: 'major',
        page: pageName,
        issue: `${deadLinks.length} dead/no-op links found`,
        details: 'Links with href="#" or javascript:void(0)',
        recommendation: 'Implement proper routing or remove placeholder links'
      });
    }
  } catch (e) {
    // Ignore
  }

  return findings;
}

async function checkModalDialogs(page: Page, pageName: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    // Check for modal triggers
    const modalTriggers = await page.locator('[data-modal], [data-dialog], [class*="modal"], [class*="dialog"]').count();

    if (modalTriggers > 0) {
      // Try opening modals
      const triggers = page.locator('[data-modal-trigger], [data-dialog-trigger], [class*="modal-trigger"]');
      const triggerCount = await triggers.count();

      for (let i = 0; i < Math.min(triggerCount, 3); i++) {
        try {
          await triggers.nth(i).click();
          await page.waitForTimeout(500);

          // Check if modal opened
          const modalVisible = await page.locator('[role="dialog"], [class*="modal"][class*="open"], .modal-show').isVisible().catch(() => false);

          if (!modalVisible) {
            findings.push({
              category: 'major',
              page: pageName,
              issue: 'Modal trigger does nothing',
              details: `Trigger #${i + 1} clicked but no modal appeared`,
              recommendation: 'Implement modal opening logic'
            });
          }

          // Close modal if open
          const closeBtn = page.locator('[class*="modal"] button[close], [class*="dialog"] button[close], .modal-close');
          if (await closeBtn.count() > 0) {
            await closeBtn.first().click();
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  } catch (e) {
    // Ignore
  }

  return findings;
}

async function auditPage(page: Page, url: string, pageName: string): Promise<Finding[]> {
  const allFindings: Finding[] = [];

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Run all tests
    allFindings.push(...await findFormsAndTestThem(page, pageName));
    allFindings.push(...await findButtonsAndTestThem(page, pageName));
    allFindings.push(...await checkDeadLinks(page, pageName));
    allFindings.push(...await checkModalDialogs(page, pageName));

  } catch (e) {
    allFindings.push({
      category: 'critical',
      page: pageName,
      issue: 'Page failed to load',
      details: String(e),
      recommendation: 'Check routing and component'
    });
  }

  return allFindings;
}

async function main() {
  console.log('🔍 Starting Deep Functionality Audit\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const allFindings: Finding[] = [];

  const pages = [
    { name: 'Dashboard', path: '/' },
    { name: 'Assets', path: '/assets' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contracts', path: '/contracts' },
    { name: 'Settings', path: '/settings' },
    { name: 'Billing', path: '/billing' },
    { name: 'Library', path: '/library' },
  ];

  for (const pageConfig of pages) {
    console.log(`📄 Testing: ${pageConfig.name}...`);
    const page = await browser.newPage();
    const findings = await auditPage(page, `${BASE_URL}${pageConfig.path}`, pageConfig.name);
    allFindings.push(...findings);
    await page.close();
  }

  await browser.close();

  // Print findings
  console.log('\n' + '='.repeat(60));
  console.log('🔍 FUNCTIONALITY AUDIT RESULTS');
  console.log('='.repeat(60));

  const critical = allFindings.filter(f => f.category === 'critical');
  const major = allFindings.filter(f => f.category === 'major');
  const minor = allFindings.filter(f => f.category === 'minor');

  console.log(`\n❌ Critical: ${critical.length}`);
  console.log(`⚠️  Major: ${major.length}`);
  console.log(`💡 Minor: ${minor.length}`);

  if (critical.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:');
    critical.forEach(f => {
      console.log(`   [${f.page}] ${f.issue}`);
      console.log(`      ${f.details}`);
      console.log(`      → ${f.recommendation}\n`);
    });
  }

  if (major.length > 0) {
    console.log('\n⚠️  MAJOR ISSUES:');
    major.forEach(f => {
      console.log(`   [${f.page}] ${f.issue}`);
      console.log(`      → ${f.recommendation}\n`);
    });
  }

  if (minor.length > 0) {
    console.log('\n💡 MINOR ISSUES:');
    minor.forEach(f => {
      console.log(`   [${f.page}] ${f.issue}`);
    });
  }

  // Save findings
  const fs = await import('fs');
  fs.writeFileSync('./tests/e2e/functionality-findings.json', JSON.stringify(allFindings, null, 2));
  console.log('\n📁 Findings saved to: tests/e2e/functionality-findings.json');
}

main().catch(console.error);
