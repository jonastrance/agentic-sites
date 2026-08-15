function escapeHtml(text) {
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

console.log('Testing escapeHtml...');
const testCases = [
    { input: '<script>alert(1)</script>', expected: '&lt;script&gt;alert(1)&lt;/script&gt;' },
    { input: '"><script>alert(1)</script>', expected: '&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;' },
    { input: 'Me & You', expected: 'Me &amp; You' },
    { input: "It's fine", expected: 'It&#39;s fine' },
    { input: null, expected: '' },
    { input: undefined, expected: '' },
    { input: 123, expected: '123' }
];

let allPassed = true;
testCases.forEach((tc, index) => {
    const result = escapeHtml(tc.input);
    if (result !== tc.expected) {
        console.error(`Test case ${index + 1} failed: Expected "${tc.expected}", got "${result}"`);
        allPassed = false;
    } else {
        console.log(`Test case ${index + 1} passed`);
    }
});

if (allPassed) {
    console.log('All tests passed successfully!');
} else {
    process.exit(1);
}
