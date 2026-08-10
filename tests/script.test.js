const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

// Mock DOM since script.js expects a browser environment
global.document = {
    getElementById: () => ({ addEventListener: () => {} }),
    querySelectorAll: () => ([]),
    addEventListener: () => {}
};

// Evaluate script.js into the global scope
const code = fs.readFileSync('./script.js', 'utf8');
eval(code);

test('getCategoryLabel', async (t) => {
    await t.test('should return correct labels for known categories', () => {
        assert.strictEqual(getCategoryLabel('ide'), 'IDE-Based');
        assert.strictEqual(getCategoryLabel('web'), 'Web-Based');
        assert.strictEqual(getCategoryLabel('fullstack'), 'Full-Stack');
    });

    await t.test('should return the fallback category if unknown', () => {
        assert.strictEqual(getCategoryLabel('mobile'), 'mobile');
        assert.strictEqual(getCategoryLabel('unknown'), 'unknown');
        assert.strictEqual(getCategoryLabel('AI'), 'AI');
    });

    await t.test('should return the original input for falsy values (other than undefined keys in objects)', () => {
        assert.strictEqual(getCategoryLabel(''), '');
        assert.strictEqual(getCategoryLabel(null), null);
        assert.strictEqual(getCategoryLabel(undefined), undefined);
    });
});
