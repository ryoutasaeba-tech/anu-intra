// Anu intranet: 画面に依存しない小さな部品（試験できるように index.html から分けた）
(function (root) {
    'use strict';

    // 画面に文字を入れる前に、HTML として働く記号を無害にする
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // http / https だけ許す。javascript: などは null（使えない）にする
    function safeUrl(raw) {
        try {
            const u = new URL(String(raw).trim());
            return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : null;
        } catch (e) {
            return null;
        }
    }

    // 保存データを読み、壊れていたら使えるものだけ残す。全部だめなら defaults を返す。
    function parseLinks(text, defaults) {
        if (text === null || text === undefined) return defaults;
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return defaults;
        }
        if (!Array.isArray(data)) return defaults;
        return data
            .filter(l => l && typeof l.name === 'string' && typeof l.url === 'string' && Number.isFinite(Number(l.id)))
            .map(l => ({ id: Number(l.id), name: l.name, url: l.url, icon: typeof l.icon === 'string' ? l.icon : undefined }));
    }

    const api = { escapeHtml, safeUrl, parseLinks };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.AnuLinks = api;
})(typeof window !== 'undefined' ? window : globalThis);
