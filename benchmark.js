const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('./index.html', 'utf-8');
const script = fs.readFileSync('./script.js', 'utf-8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });
dom.window.eval(script);

// Wait for DOMContentLoaded to have fired
setTimeout(() => {
    const searchInput = dom.window.document.getElementById('searchInput');
    if (!searchInput) {
        console.error("searchInput not found!");
        return;
    }

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        searchInput.value = 'a'.repeat((i % 5) + 1);
        searchInput.dispatchEvent(new dom.window.Event('input'));
    }
    const end = performance.now();

    console.log(`Execution time for 1000 simulated input events: ${(end - start).toFixed(2)} ms`);
}, 100);
