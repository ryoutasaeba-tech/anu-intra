// 実行: node --test tests/links-lib.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, safeUrl, parseLinks } = require('../links-lib.js');

const defaults = [{ id: 1, name: 'default', url: 'https://example.com/', icon: 'x' }];

test('escapeHtml: 危ない記号を無害にする', () => {
    assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
    assert.equal(escapeHtml('"a" & \'b\''), '&quot;a&quot; &amp; &#39;b&#39;');
});

test('safeUrl: http/https だけ通す', () => {
    assert.equal(safeUrl(' https://example.com/a b '), 'https://example.com/a%20b');
    assert.equal(safeUrl('http://example.com'), 'http://example.com/');
    assert.equal(safeUrl('javascript:alert(1)'), null);
    assert.equal(safeUrl('data:text/html,<script>1</script>'), null);
    assert.equal(safeUrl('not a url'), null);
    assert.equal(safeUrl(''), null);
});

test('parseLinks: 何も保存されていなければ初期値', () => {
    assert.deepEqual(parseLinks(null, defaults), defaults);
});

test('parseLinks: 壊れた JSON でも落ちず初期値', () => {
    assert.deepEqual(parseLinks('{broken', defaults), defaults);
    assert.deepEqual(parseLinks('{"a":1}', defaults), defaults);
});

test('parseLinks: 空の一覧は空のまま（全部消した人の設定を戻さない）', () => {
    assert.deepEqual(parseLinks('[]', defaults), []);
});

test('parseLinks: 形の悪い項目だけ捨てる', () => {
    const text = JSON.stringify([
        { id: 2, name: 'ok', url: 'https://a.example/' },
        { id: 'x', name: 'badid', url: 'https://b.example/' },
        { id: 3, name: 5, url: 'https://c.example/' },
        null
    ]);
    const out = parseLinks(text, defaults);
    assert.equal(out.length, 1);
    assert.equal(out[0].id, 2);
});
