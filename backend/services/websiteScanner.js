const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('axe-puppeteer');

const websiteScanner = {
  scan: async (url) => {
    try {
      // Launch a headless browser instance
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // Navigate to the specified URL
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Inject axe-core into the page
      await page.setBypassCSP(true);
      const results = await new AxePuppeteer(page).analyze();

      // Close the browser instance
      await browser.close();

      // Extract and format accessibility findings
      const accessibilityReport = {
        url: url,
        findings: results.violations.map(violation => ({
          element: violation.nodes.map(node => node.target.join(', ')).join('; '),
          issue: violation.description,
          solution: violation.help,
          severity: violation.tags.includes('wcag2a') ? 'Low' : (violation.tags.includes('wcag2aa') ? 'Medium' : 'High')
        })),
        lawsAndConsequences: mapFindingsToLawsAndConsequences(results.violations)
      };

      return accessibilityReport;
    } catch (error) {
      console.error('Error scanning website:', error);
      throw error; // Forward the error to be handled by the caller
    }
  },
};

function mapFindingsToLawsAndConsequences(violations) {
  // Define mappings of violations to relevant laws and consequences
  const violationMappings = {
    'Missing alt attribute for image': {
      law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 1.1.1 Non-text Content',
      consequence: 'Failure to provide alternative text for images may result in barriers for users with visual impairments, violating accessibility standards and potentially leading to legal liabilities under the ADA and other regulations.'
    },
    'Form field without label': {
      law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 1.3.1 Info and Relationships',
      consequence: 'Failure to provide accessible form labels may prevent users with disabilities from understanding and interacting with form fields, violating WCAG accessibility standards and potentially leading to legal liabilities.'
    },
    // WCAG 2.1 Success Criterion 2.4.3 - Focus Order
  'Elements with tabindex are not in sequential order': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 2.4.3 Focus Order',
    consequence: 'Improper focus order may disrupt navigation for keyboard users, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  // WCAG 2.1 Success Criterion 2.4.7 - Focus Visible
  'Interactive elements do not have a visible focus state': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 2.4.7 Focus Visible',
    consequence: 'Lack of visible focus indication may make it difficult for users to identify and interact with interactive elements using a keyboard, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  // WCAG 2.1 Success Criterion 1.4.3 - Contrast (Minimum)
  'Insufficient color contrast for text elements': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 1.4.3 Contrast (Minimum)',
    consequence: 'Low color contrast between text and background may make content difficult to read for users with low vision or color blindness, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  // WCAG 2.1 Success Criterion 1.4.4 - Resize Text
  'Text cannot be resized without assistive technology': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 1.4.4 Resize Text',
    consequence: 'Inability to resize text may prevent users with visual impairments from adjusting text size according to their preferences, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  // WCAG 2.1 Success Criterion 2.1.1 - Keyboard
  'Certain functionality not accessible via keyboard': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 2.1.1 Keyboard',
    consequence: 'Lack of keyboard accessibility may prevent users with mobility impairments from accessing certain functionalities, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  // WCAG 2.1 Success Criterion 2.2.2 - Pause, Stop, Hide
  'Content automatically refreshes or redirects without user consent': {
    law: 'Web Content Accessibility Guidelines (WCAG) 2.1 - Success Criterion 2.2.2 Pause, Stop, Hide',
    consequence: 'Automatic content refresh or redirection without user control may disrupt user interaction and navigation, violating WCAG accessibility standards and potentially leading to legal liabilities.'
  },
  };

  // Map violations to relevant laws and consequences based on defined mappings
  return violations.map(violation => {
    if (violation.description in violationMappings) {
      return violationMappings[violation.description];
    } else {
      // If no specific mapping is defined, provide a generic statement
      return {
        law: 'No specific law identified',
        consequence: 'The violation may impact accessibility and compliance, potentially leading to legal risks and user exclusion. Consult accessibility guidelines for best practices in addressing such issues.'
      };
    }
  });
}



module.exports = websiteScanner;

