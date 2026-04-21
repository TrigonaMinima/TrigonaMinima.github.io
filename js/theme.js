(function () {
    var root = document.documentElement;
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            try { if (localStorage.getItem('theme')) return; } catch (e) {} // user override wins
            var next = e.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
        });
    }
}());
