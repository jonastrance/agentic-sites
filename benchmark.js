const { JSDOM } = require('jsdom');
const fs = require('fs');
const { performance } = require('perf_hooks');

async function runBenchmark() {
    const html = fs.readFileSync('./index.html', 'utf-8');
    const script = fs.readFileSync('./script.js', 'utf-8');

    const modifiedScript = script + `
        window.renderCount = 0;
        const originalRenderServices = renderServices;
        renderServices = function(services) {
            window.renderCount++;
            originalRenderServices(services);
        };
    `;

    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const window = dom.window;
    const document = window.document;

    const scriptEl = document.createElement('script');
    scriptEl.textContent = modifiedScript;
    document.body.appendChild(scriptEl);

    await new Promise(resolve => setTimeout(resolve, 100));

    const searchInput = document.getElementById('searchInput');

    const text = "github copilot workspace";
    const startTime = performance.now();

    window.renderCount = 0;

    for (let i = 0; i < text.length; i++) {
        searchInput.value = text.substring(0, i + 1);
        searchInput.dispatchEvent(new window.Event('input'));
        await new Promise(resolve => setTimeout(resolve, 30));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const endTime = performance.now();
    console.log(`Typing "${text}" with 30ms delay between keystrokes`);
    console.log(`Total Render Count: ${window.renderCount}`);
    console.log(`Total Time taken: ${(endTime - startTime).toFixed(2)}ms`);
}

runBenchmark().catch(console.error);