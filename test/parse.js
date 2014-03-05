var assert = require('assert');
var fs = require('fs');
var PO = require('..');

describe('Parse', function () {
    it('Parses the big po file', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/big.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 69);
        
        var item = po.items[0];
        assert.equal(item.msgid, "Title");
        assert.equal(item.msgstr, "Titre");
    });

    it('Handles multi-line strings', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/multi-line.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);
        
        var item = po.items[0];
        assert.equal(item.msgid, "The following placeholder tokens can be used in both paths and titles. When used in a path or title, they will be replaced with the appropriate values.");
        assert.equal(item.msgstr, "Les ébauches de jetons suivantes peuvent être utilisées à la fois dans les chemins et dans les titres. Lorsqu'elles sont utilisées dans un chemin ou un titre, elles seront remplacées par les valeurs appropriées.");
    });

    it('Handles translator comments', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);
        
        var item = po.items[0];
        assert.equal(item.msgid, "Title, as plain text");
        assert.equal(item.msgstr, "Attribut title, en tant que texte brut");
        assert.deepEqual(item.comments, ["Translator comment"]);
    });

    it('Handles extracted comments', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);

        var item = po.items[0];
        assert.equal(item.msgid, "Title, as plain text");
        assert.equal(item.msgstr, "Attribut title, en tant que texte brut");
        assert.deepEqual(item.extractedComments, ["Extracted comment"]);
    });

    it('Handles string references', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/reference.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 2);
        
        var item = po.items[0];
        assert.equal(item.msgid, "Title, as plain text");
        assert.equal(item.msgstr, "Attribut title, en tant que texte brut");
        assert.deepEqual(item.comments, ["Comment"]);
        assert.deepEqual(item.references, [".tmp/crm/controllers/map.js"]);
        
        item = po.items[1];
        assert.equal(item.msgid, "X");
        assert.equal(item.msgstr, "Y");
        assert.deepEqual(item.references, ["a", "b"]);
    });

    it('Parses flags', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);

        var item = po.items[0];
        assert.equal(item.msgid, "Sources");
        assert.equal(item.msgstr, "Source");
        assert.notEqual(item.flags, null);
        assert.equal(item.flags.fuzzy, true);
    });

    it('Parses item context', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/big.po', 'utf8'));

        var ambiguousItems = po.items.filter(function (item) {
            return item.msgid === 'Empty folder';
        });

        assert.equal(ambiguousItems[0].msgctxt, 'folder display');
        assert.equal(ambiguousItems[1].msgctxt, 'folder action');
    });

    describe('C-Strings', function () {
        it('should parse the c-strings.po file', function () {
            var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/c-strings.po', 'utf8'));

            assert.notEqual(po, null);
        });

        it('should extract strings containing " and \\ characters', function () {
            var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/c-strings.po', 'utf8'));

            var items = po.items.filter(function (item) {
                return (/^The name field must not contain/).test(item.msgid);
            });
            assert.equal(items[0].msgid, 'The name field must not contain characters like " or \\');
        });
    });
});
