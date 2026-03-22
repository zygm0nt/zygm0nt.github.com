document.addEventListener('DOMContentLoaded', function () {
    var skipLangs = new Set(['text', 'plaintext', '']);
    var renameLangs = { 'fallback': 'plain' };

    document.querySelectorAll('.post-content .highlight code[data-lang]').forEach(function (code) {
        var lang = (code.getAttribute('data-lang') || '').toLowerCase();
        lang = renameLangs[lang] || lang;
        if (!skipLangs.has(lang)) {
            var highlight = code.closest('.highlight');
            if (highlight) {
                highlight.setAttribute('data-lang', lang);
            }
        }
    });
});
