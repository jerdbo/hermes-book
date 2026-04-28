// Custom mermaid init for mdbook — converts `<code class="language-mermaid">`
// blocks (what mdbook emits for ```mermaid fences) into `<pre class="mermaid">`
// containers, then runs mermaid against them.
//
// We do this in JS (instead of using the mdbook-mermaid preprocessor) because
// the preprocessor has UTF-8 parsing issues with CJK content in fence bodies.
(() => {
    const darkThemes = ['ayu', 'navy', 'coal'];
    const classList = document.getElementsByTagName('html')[0].classList;

    let isDark = false;
    for (const cssClass of classList) {
        if (darkThemes.includes(cssClass)) {
            isDark = true;
            break;
        }
    }

    mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        // `loose` allows arrow labels with quotes / brackets we use heavily.
        securityLevel: 'loose',
    });

    // Convert each ```mermaid code block to a mermaid container.
    const codeBlocks = document.querySelectorAll('code.language-mermaid');
    codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        if (!pre || pre.tagName !== 'PRE') return;

        const mermaidDiv = document.createElement('pre');
        mermaidDiv.classList.add('mermaid');
        mermaidDiv.textContent = codeBlock.textContent;
        pre.parentNode.replaceChild(mermaidDiv, pre);
    });

    // Run mermaid on the converted elements.
    mermaid.run();

    // Theme-switch buttons: reload so dark-vs-light mermaid theme is re-applied
    // (mermaid.initialize is called once at page load).
    for (const theme of ['ayu', 'navy', 'coal', 'light', 'rust']) {
        const btn = document.getElementById(theme);
        if (btn) {
            btn.addEventListener('click', () => {
                setTimeout(() => window.location.reload(), 100);
            });
        }
    }
})();
