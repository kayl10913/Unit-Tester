// Simulated AI service for generating unit tests
export const generateTestsWithAI = async (sourceCode, framework = 'jest', coverage = 'high') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract functions and classes from source code
  const functions = extractFunctions(sourceCode);
  const classes = extractClasses(sourceCode);

  let tests = '';

  switch (framework) {
    case 'jest':
      tests = generateJestTests(functions, classes, coverage);
      break;
    case 'mocha':
      tests = generateMochaTests(functions, classes, coverage);
      break;
    case 'jasmine':
      tests = generateJasmineTests(functions, classes, coverage);
      break;
    default:
      tests = generateJestTests(functions, classes, coverage);
  }

  return tests;
};

// Simulated AI Q&A scoped to this app
const getSimulatedAnswer = (question) => {
  const q = question.toLowerCase();
  if (/^\s*(hi|hello|hey)\s*$/i.test(question)) {
    return (
      'This assistant only discusses the Unit Testing Generator. Try asking:\n' +
      '- How does the AI Test Generator create Jest tests here?\n' +
      '- How do I run tests in the Test Runner tab?\n' +
      '- How can I change coverage to comprehensive?\n' +
      '- What does the Vulnerability Scanner check?'
    );
  }
  if (q.includes('what is unit testing') || q.includes('why')) {
    return (
      'Within this app, unit testing verifies functions/classes from the Code Editor.\n' +
      'Benefits in this system:\n' +
      '- Fast feedback and easier debugging\n' +
      '- Prevents regressions and enables refactoring\n' +
      '- Documents intended behavior\n' +
      'The AI Test Generator analyzes your code and outputs Jest/Mocha/Jasmine tests you can run in the Test Runner.'
    );
  }
  if (q.includes('jest') || q.includes('mocha') || q.includes('jasmine')) {
    return (
      'Frameworks supported in this app:\n' +
      '- Jest: batteries-included (runner, assertions, mocking).\n' +
      '- Mocha: flexible runner (pair with Chai/Sinon).\n' +
      '- Jasmine: all-in-one similar to Jest.\n' +
      'Use the Test Generator dropdown to choose the framework; results render below.'
    );
  }
  if (q.includes('best practice') || q.includes('maintain')) {
    return (
      'Best practices for using this generator:\n' +
      '- Name tests by behavior; use Arrange-Act-Assert.\n' +
      '- Isolate external effects with mocks/stubs.\n' +
      '- Cover edge cases and failure paths.\n' +
      '- Keep tests fast and independent.\n' +
      'Tip: Set coverage to "comprehensive" for extra suites.'
    );
  }
  if (q.includes('coverage')) {
    return (
      'Coverage in this app:\n' +
      '- Use the coverage dropdown in Test Generator (basic → comprehensive).\n' +
      '- The Test Runner shows totals and a simple coverage indicator (simulated).\n' +
      '- Focus on critical paths of the code you paste into the Code Editor.'
    );
  }
  return (
    'I can only answer questions about the Unit Testing Generator. Try:\n' +
    '- How does generateTestsWithAI work?\n' +
    '- What do the Test Statistics mean?\n' +
    '- How do I scan my code for vulnerabilities here?'
  );
};

const getAIProvider = () => {
  try {
    const local = typeof window !== 'undefined' ? window.localStorage.getItem('ai_provider') : '';
    if (local) return local.toLowerCase();
    let env;
    try { env = import.meta.env; } catch {}
    const hasGemini = !!(env && env.VITE_GEMINI_API_KEY);
    const hasOpenAI = !!(env && env.VITE_OPENAI_API_KEY);
    if (hasGemini && !hasOpenAI) return 'gemini';
    return 'openai';
  } catch {
    return 'openai';
  }
};

const getAPIKey = () => {
  try {
    const local = typeof window !== 'undefined' ? window.localStorage.getItem('ai_api_key') : '';
    let env;
    try { env = import.meta.env; } catch {}
    const envKey = env ? (env.VITE_OPENAI_API_KEY || env.VITE_GEMINI_API_KEY) : '';
    return local || envKey || '';
  } catch {
    return '';
  }
};

const getModel = (provider) => {
  try {
    const local = typeof window !== 'undefined' ? window.localStorage.getItem('ai_model') : '';
    if (local) return local;
    let env;
    try { env = import.meta.env; } catch {}
    if (env) {
      if (provider === 'gemini') return env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
      return env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
    }
    return provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-3.5-turbo';
  } catch {
    return provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-3.5-turbo';
  }
};

const normalizeModel = (provider, model) => {
  if (provider === 'gemini') {
    let m = model || 'gemini-2.0-flash';
    if (/^gemin-/.test(m)) m = m.replace(/^gemin-/, 'gemini-');
    return m;
  }
  return model;
};

const askWithOpenAI = async (question, apiKey, model) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are the in-app assistant for the Unit Testing Generator. Answer ONLY about this app (Code Editor, AI Test Generator, Vulnerability Scanner, Test Runner) and its code. If out of scope, politely refuse and suggest an in-scope question. Be concise and practical with bullet points when helpful.',
        },
        { role: 'user', content: question },
      ],
    }),
  });
  if (!response.ok) {
    try { console.error('OpenAI error', response.status, await response.text()); } catch {}
    return getSimulatedAnswer(question);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  return content || getSimulatedAnswer(question);
};

const askWithGemini = async (question, apiKey, model) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent`;
  const prompt = 'You are the in-app assistant for the Unit Testing Generator. Answer ONLY about this app (Code Editor, AI Test Generator, Vulnerability Scanner, Test Runner) and its code. If out of scope, politely refuse and suggest an in-scope question. Be concise and practical with bullet points when helpful.\n\nUser question: ' + question;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: { temperature: 0.3 },
    }),
  });
  if (!response.ok) {
    try { console.error('Gemini error', response.status, await response.text()); } catch {}
    return getSimulatedAnswer(question);
  }
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n').trim();
  return text || getSimulatedAnswer(question);
};

export const askAIAboutUnitTesting = async (question) => {
  const apiKey = getAPIKey();
  const provider = getAIProvider();
  const model = normalizeModel(provider, getModel(provider));

  if (apiKey) {
    try {
      if (provider === 'gemini' || (typeof apiKey === 'string' && apiKey.startsWith('AIza'))) {
        return await askWithGemini(question, apiKey, model);
      }
      return await askWithOpenAI(question, apiKey, model);
    } catch {
      // fall through to simulated
    }
  }

  await new Promise(resolve => setTimeout(resolve, 800));
  return getSimulatedAnswer(question);
};

const extractFunctions = (code) => {
  const functionRegex = /function\s+(\w+)\s*\([^)]*\)/g;
  const arrowFunctionRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g;
  const functions = [];

  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    functions.push(match[1]);
  }
  while ((match = arrowFunctionRegex.exec(code)) !== null) {
    functions.push(match[1]);
  }

  return functions;
};

const extractClasses = (code) => {
  const classRegex = /class\s+(\w+)/g;
  const classes = [];

  let match;
  while ((match = classRegex.exec(code)) !== null) {
    classes.push(match[1]);
  }

  return classes;
};

const generateJestTests = (functions, classes, coverage) => {
  let tests = `// Generated Jest Tests
// Coverage Level: ${coverage}

`;

  // Test functions
  functions.forEach(func => {
    tests += `describe('${func}', () => {
  test('should handle valid input', () => {
    // TODO: Implement test for valid input
    expect(true).toBe(true);
  });

  test('should handle invalid input', () => {
    // TODO: Implement test for invalid input
    expect(true).toBe(true);
  });

  test('should handle edge cases', () => {
    // TODO: Implement test for edge cases
    expect(true).toBe(true);
  });
});

`;
  });

  // Test classes
  classes.forEach(cls => {
    tests += `describe('${cls}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${cls}();
  });

  test('should create instance correctly', () => {
    expect(instance).toBeInstanceOf(${cls});
  });

  test('should have required methods', () => {
    // TODO: Test class methods
    expect(instance).toBeDefined();
  });
});

`;
  });

  if (coverage === 'comprehensive') {
    tests += `// Additional comprehensive tests
describe('Integration Tests', () => {
  test('should work with multiple functions', () => {
    // TODO: Implement integration tests
    expect(true).toBe(true);
  });
});

describe('Performance Tests', () => {
  test('should handle large datasets', () => {
    // TODO: Implement performance tests
    expect(true).toBe(true);
  });
});

`;
  }

  return tests;
};

const generateMochaTests = (functions, classes, coverage) => {
  let tests = `// Generated Mocha Tests
// Coverage Level: ${coverage}

const { expect } = require('chai');

`;

  functions.forEach(func => {
    tests += `describe('${func}', () => {
  it('should handle valid input', () => {
    // TODO: Implement test for valid input
    expect(true).to.be.true;
  });

  it('should handle invalid input', () => {
    // TODO: Implement test for invalid input
    expect(true).to.be.true;
  });
});

`;
  });

  classes.forEach(cls => {
    tests += `describe('${cls}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${cls}();
  });

  it('should create instance correctly', () => {
    expect(instance).to.be.instanceOf(${cls});
  });
});

`;
  });

  return tests;
};

const generateJasmineTests = (functions, classes, coverage) => {
  let tests = `// Generated Jasmine Tests
// Coverage Level: ${coverage}

`;

  functions.forEach(func => {
    tests += `describe('${func}', () => {
  it('should handle valid input', () => {
    // TODO: Implement test for valid input
    expect(true).toBe(true);
  });

  it('should handle invalid input', () => {
    // TODO: Implement test for invalid input
    expect(true).toBe(true);
  });
});

`;
  });

  classes.forEach(cls => {
    tests += `describe('${cls}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${cls}();
  });

  it('should create instance correctly', () => {
    expect(instance).toBeInstanceOf(${cls});
  });
});

`;
  });

  return tests;
};

