// Security service for vulnerability scanning
export const checkVulnerabilities = async (sourceCode, scanLevel = 'comprehensive') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const vulnerabilities = [];
  const lines = sourceCode.split('\n');

  // SQL Injection patterns
  const sqlPatterns = [
    { pattern: /query\s*\(\s*['"`].*\$/, severity: 'high', type: 'SQL Injection' },
    { pattern: /execute\s*\(\s*['"`].*\$/, severity: 'high', type: 'SQL Injection' },
    { pattern: /\.query\s*\(\s*['"`].*\+/, severity: 'medium', type: 'SQL Injection' },
  ];

  // XSS patterns
  const xssPatterns = [
    { pattern: /innerHTML\s*=/, severity: 'high', type: 'XSS' },
    { pattern: /outerHTML\s*=/, severity: 'high', type: 'XSS' },
    { pattern: /document\.write\s*\(/, severity: 'high', type: 'XSS' },
    { pattern: /eval\s*\(/, severity: 'critical', type: 'Code Injection' },
  ];

  // Command Injection patterns
  const commandPatterns = [
    { pattern: /exec\s*\(/, severity: 'critical', type: 'Command Injection' },
    { pattern: /spawn\s*\(/, severity: 'high', type: 'Command Injection' },
    { pattern: /child_process/, severity: 'medium', type: 'Command Injection' },
  ];

  // Hardcoded secrets
  const secretPatterns = [
    { pattern: /password\s*=\s*['"`][^'"`]+['"`]/, severity: 'high', type: 'Hardcoded Secret' },
    { pattern: /api_key\s*=\s*['"`][^'"`]+['"`]/, severity: 'high', type: 'Hardcoded Secret' },
    { pattern: /secret\s*=\s*['"`][^'"`]+['"`]/, severity: 'high', type: 'Hardcoded Secret' },
    { pattern: /token\s*=\s*['"`][^'"`]+['"`]/, severity: 'high', type: 'Hardcoded Secret' },
  ];

  // Insecure random usage
  const randomPatterns = [
    { pattern: /Math\.random\s*\(/, severity: 'medium', type: 'Insecure Random' },
    { pattern: /crypto\.randomBytes/, severity: 'low', type: 'Random Usage' },
  ];

  // Deprecated/dangerous functions
  const deprecatedPatterns = [
    { pattern: /document\.write\s*\(/, severity: 'medium', type: 'Deprecated Function' },
    { pattern: /innerHTML\s*=/, severity: 'medium', type: 'Dangerous Assignment' },
    { pattern: /setTimeout\s*\(\s*['"`]/, severity: 'low', type: 'String-based setTimeout' },
  ];

  // Input validation issues
  const validationPatterns = [
    { pattern: /\.innerHTML\s*=/, severity: 'high', type: 'Input Validation' },
    { pattern: /\.outerHTML\s*=/, severity: 'high', type: 'Input Validation' },
  ];

  // File system vulnerabilities
  const filePatterns = [
    { pattern: /fs\.readFileSync\s*\(/, severity: 'medium', type: 'File System' },
    { pattern: /fs\.writeFileSync\s*\(/, severity: 'medium', type: 'File System' },
  ];

  const allPatterns = [
    ...sqlPatterns,
    ...xssPatterns,
    ...commandPatterns,
    ...secretPatterns,
    ...randomPatterns,
    ...deprecatedPatterns,
    ...validationPatterns,
    ...filePatterns,
  ];

  // Scan each line
  lines.forEach((line, lineNumber) => {
    allPatterns.forEach(pattern => {
      if (pattern.pattern.test(line)) {
        vulnerabilities.push({
          title: `${pattern.type} Vulnerability`,
          description: getVulnerabilityDescription(pattern.type),
          severity: pattern.severity,
          line: lineNumber + 1,
          recommendation: getVulnerabilityRecommendation(pattern.type),
          type: pattern.type,
        });
      }
    });
  });

  // Add some mock vulnerabilities for demonstration
  if (scanLevel === 'comprehensive' || scanLevel === 'deep') {
    vulnerabilities.push(
      {
        title: 'Potential Memory Leak',
        description: 'Function creates closures that may hold references to large objects.',
        severity: 'medium',
        line: Math.floor(Math.random() * lines.length) + 1,
        recommendation: 'Review closure usage and ensure proper cleanup of references.',
        type: 'Memory Management',
      },
      {
        title: 'Async/Await Best Practice',
        description: 'Consider using try-catch blocks for better error handling in async functions.',
        severity: 'low',
        line: Math.floor(Math.random() * lines.length) + 1,
        recommendation: 'Wrap async operations in try-catch blocks for proper error handling.',
        type: 'Code Quality',
      }
    );
  }

  return vulnerabilities;
};

const getVulnerabilityDescription = (type) => {
  const descriptions = {
    'SQL Injection': 'Direct concatenation of user input in SQL queries can lead to SQL injection attacks.',
    'XSS': 'Unsanitized user input being rendered in HTML can lead to cross-site scripting attacks.',
    'Command Injection': 'User input being passed to system commands can lead to command injection attacks.',
    'Hardcoded Secret': 'Sensitive information like passwords or API keys should not be hardcoded in source code.',
    'Insecure Random': 'Math.random() is not cryptographically secure. Use crypto.randomBytes() for security-sensitive operations.',
    'Deprecated Function': 'This function is deprecated and may have security implications.',
    'Input Validation': 'User input should be validated and sanitized before use.',
    'File System': 'File system operations should be carefully controlled to prevent unauthorized access.',
    'Memory Management': 'Potential memory leak or inefficient memory usage detected.',
    'Code Quality': 'Code quality issue that may impact maintainability or performance.',
  };

  return descriptions[type] || 'Security vulnerability detected in the code.';
};

const getVulnerabilityRecommendation = (type) => {
  const recommendations = {
    'SQL Injection': 'Use parameterized queries or prepared statements instead of string concatenation.',
    'XSS': 'Sanitize user input and use textContent instead of innerHTML when possible.',
    'Command Injection': 'Avoid passing user input directly to system commands. Use whitelisting and validation.',
    'Hardcoded Secret': 'Use environment variables or secure secret management systems.',
    'Insecure Random': 'Use crypto.randomBytes() or crypto.getRandomValues() for cryptographic operations.',
    'Deprecated Function': 'Replace with modern alternatives that provide better security.',
    'Input Validation': 'Implement proper input validation and sanitization.',
    'File System': 'Validate file paths and implement proper access controls.',
    'Memory Management': 'Review object lifecycle and ensure proper cleanup.',
    'Code Quality': 'Follow best practices and coding standards.',
  };

  return recommendations[type] || 'Review and fix the identified security issue.';
};
