const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');

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

test('applyFilters', async (t) => {
    let window, document;

    t.beforeEach(() => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <input id='searchInput'/>
                <button class='filter-btn' data-filter='all'>All</button>
                <button class='filter-btn' data-filter='web'>Web</button>
                <button class='filter-btn' data-filter='ide'>IDE</button>
                <button class='filter-btn' data-filter='fullstack'>Fullstack</button>
                <div id='servicesContainer'></div>
            </body>
            </html>
        `, { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);

        // Initialize to setup searchableText and initial render
        window.init();
    });

    await t.test('should show all services initially', () => {
        const container = document.getElementById('servicesContainer');
        const cards = container.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 18);
    });

    await t.test('should filter by category', () => {
        document.querySelector('[data-filter="web"]').click();

        const container = document.getElementById('servicesContainer');
        const cards = container.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 4);
        cards.forEach(card => {
            assert.strictEqual(card.dataset.category, 'web');
        });
    });

    await t.test('should filter by search term', () => {
        document.querySelector('[data-filter="all"]').click();
        window.applyFilters('github');

        const container = document.getElementById('servicesContainer');
        const cards = container.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 3);
        cards.forEach(card => {
            assert.ok(card.innerHTML.toLowerCase().includes('github') || card.innerHTML.toLowerCase().includes('copilot') || card.dataset.category === 'fullstack' || card.querySelector('.service-name').textContent === 'Smol Developer');
        });
    });

    await t.test('should filter by both category and search term', () => {
        document.querySelector('[data-filter="fullstack"]').click();
        window.applyFilters('github');

        const container = document.getElementById('servicesContainer');
        const cards = container.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 1);
        cards.forEach(card => {
            assert.strictEqual(card.dataset.category, 'fullstack');
            assert.ok(card.innerHTML.toLowerCase().includes('github'));
        });
    });

    await t.test('should show no results message when nothing matches', () => {
        document.querySelector('[data-filter="all"]').click();
        window.applyFilters('nonexistentsearchtermthatwillnevermatch');

        const container = document.getElementById('servicesContainer');
        const cards = container.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 0);
        assert.ok(container.innerHTML.includes('No services found matching your criteria.'));
    });
});
