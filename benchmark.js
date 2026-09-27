const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf8');

// We need to extract just the escapeHtml function and the global escapeMap
let escapeMapCode = `
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "\\'": '&#39;'
};
`;

// Current escapeHtml implementation
function escapeHtmlCurrent(text) {
    if (text === null || text === undefined) return '';
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, match => escapeMap[match]);
}

const escapeMapGlobal = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtmlOptimized(text) {
    if (text === null || text === undefined) return '';
    return String(text).replace(/[&<>"']/g, match => escapeMapGlobal[match]);
}

const testStrings = [
    '<script>alert("xss")</script>',
    'Normal text without any special characters.',
    'A bit & of < mixed > characters " and \'',
    null,
    undefined,
    12345
];

function runBenchmark(fn, name) {
    const iterations = 1000000;
    const start = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        for (const str of testStrings) {
            fn(str);
        }
    }

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1000000;
    console.log(`${name}: ${durationMs.toFixed(2)} ms for ${iterations} iterations`);
    return durationMs;
}

console.log("Warming up...");
runBenchmark(escapeHtmlCurrent, 'Warmup Current');
runBenchmark(escapeHtmlOptimized, 'Warmup Optimized');

console.log("\nBenchmarking...");
const currentMs = runBenchmark(escapeHtmlCurrent, 'Current Implementation');
const optimizedMs = runBenchmark(escapeHtmlOptimized, 'Optimized Implementation');

const improvement = ((currentMs - optimizedMs) / currentMs * 100).toFixed(2);
const speedup = (currentMs / optimizedMs).toFixed(2);

console.log(`\nImprovement: ${improvement}% faster`);
console.log(`Speedup: ${speedup}x`);
