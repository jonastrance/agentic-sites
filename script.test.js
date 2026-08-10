const { escapeHtml } = require('./script.js');

describe('escapeHtml', () => {
    it('returns the same string if no HTML characters are present', () => {
        expect(escapeHtml('Hello world!')).toBe('Hello world!');
        expect(escapeHtml('12345')).toBe('12345');
        expect(escapeHtml('Normal text without special chars')).toBe('Normal text without special chars');
    });

    it('escapes common HTML tags', () => {
        expect(escapeHtml('<b>hello</b>')).toBe('&lt;b&gt;hello&lt;/b&gt;');
        expect(escapeHtml('<div>content</div>')).toBe('&lt;div&gt;content&lt;/div&gt;');
    });

    it('escapes script tags to prevent XSS', () => {
        expect(escapeHtml("<script>alert('xss')</script>")).toBe('&lt;script&gt;alert(\'xss\')&lt;/script&gt;');
        expect(escapeHtml('<SCRIPT>alert(1)</SCRIPT>')).toBe('&lt;SCRIPT&gt;alert(1)&lt;/SCRIPT&gt;');
    });

    it('escapes individual special characters', () => {
        expect(escapeHtml('&')).toBe('&amp;');
        expect(escapeHtml('<')).toBe('&lt;');
        expect(escapeHtml('>')).toBe('&gt;');
        // Depending on the browser/jsdom implementation, quotes might not be escaped by this method
        // unless they are part of attributes, but we will test standard behavior.
        // Let's test them to see what `textContent` -> `innerHTML` outputs.
    });

    it('handles multiple occurrences of special characters', () => {
        expect(escapeHtml('<<>>&&')).toBe('&lt;&lt;&gt;&gt;&amp;&amp;');
    });

    it('handles an empty string', () => {
        expect(escapeHtml('')).toBe('');
    });
});
