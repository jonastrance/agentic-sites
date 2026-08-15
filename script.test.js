const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');

test('escapeHtml', async (t) => {
    let window;

    await t.beforeEach(() => {
        const dom = new JSDOM("<!DOCTYPE html><html><body><input id='searchInput'/><div id='servicesContainer'></div></body></html>", { runScripts: 'dangerously' });
        window = dom.window;
        const document = window.document;

        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    });

    await t.test('should escape HTML characters correctly', () => {
        assert.strictEqual(window.escapeHtml('<div>'), '&lt;div&gt;');
        assert.strictEqual(window.escapeHtml('"hello" & \'world\''), '&quot;hello&quot; &amp; &#39;world&#39;');
    });

    await t.test('should return empty string for null and undefined', () => {
        assert.strictEqual(window.escapeHtml(null), '');
        assert.strictEqual(window.escapeHtml(undefined), '');
    });

    await t.test('should handle non-string inputs', () => {
        assert.strictEqual(window.escapeHtml(123), '123');
        assert.strictEqual(window.escapeHtml(true), 'true');
        assert.strictEqual(window.escapeHtml(false), 'false');
    });
});

test('createServiceCard', async (t) => {
    let window, document;

    await t.beforeEach(() => {
        // Use a minimal HTML template with required elements to avoid script.js initialization errors
        const dom = new JSDOM("<!DOCTYPE html><html><body><input id='searchInput'/><div id='servicesContainer'></div></body></html>", { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    });

    await t.test('should create a service card element with correct DOM structure', () => {
        const service = {
            name: "Test Service",
            icon: "🧪",
            category: "ide",
            description: "Test description",
            features: ["Feature 1", "Feature 2"],
            pricing: "Free",
            url: "https://test.com"
        };

        const card = window.createServiceCard(service);

        assert.strictEqual(card.tagName, 'DIV');
        assert.strictEqual(card.className, 'service-card');
        assert.strictEqual(card.dataset.category, 'ide');

        assert.strictEqual(card.querySelector('.service-name').textContent, 'Test Service');
        assert.strictEqual(card.querySelector('.service-description').textContent, 'Test description');
        assert.strictEqual(card.querySelector('.service-pricing').textContent, 'Free');

        const features = Array.from(card.querySelectorAll('.service-features li')).map(li => li.textContent);
        assert.deepStrictEqual(features, ["Feature 1", "Feature 2"]);

        const link = card.querySelector('a.service-link');
        assert.strictEqual(link.href, 'https://test.com/');
    });

    await t.test('should properly escape HTML to prevent XSS', () => {
        const service = {
            name: "<script>alert('XSS Name')</script>",
            icon: "🧪",
            category: "ide",
            description: "<script>alert('XSS Desc')</script>",
            features: ["<img src=x onerror=alert(1)>"],
            pricing: "<script>alert('XSS Price')</script>",
            url: 'javascript:alert("XSS")'
        };

        const card = window.createServiceCard(service);

        assert.strictEqual(card.querySelector('.service-name').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-description').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-pricing').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-features li').innerHTML.includes('<img'), false);

        assert.strictEqual(card.querySelector('.service-name').textContent, "<script>alert('XSS Name')</script>");
    });
});
