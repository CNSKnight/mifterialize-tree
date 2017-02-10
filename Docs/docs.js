/**
 * here's the es6 version
 */

// this is not happening with the babel-only browser-es-module-loader experimental repo, so we'll load as a global
// import Showdown from 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.3/showdown.min.js';

const Docs = {
    showdown: new window.showdown.Converter(),
    anchorsPath: '/Docs/index.html',
    scriptsJson: '/scripts.json',

    start: function() {
        if (location.protocol == 'file:') Docs.local();
        Docs.loadScripts();
    },

    loadScripts: function() {
        Docs.Scripts = {};
        new Request.JSON({
            link: 'cancel',
            url: this.scriptsJson
        }).get().then(function(scripts) {
            Object.each(scripts.json, function(files, dir) {
                Docs.Scripts[dir] = Object.keys(files);
            });
            Docs.process();
        });
    },

    process: function() {
        var menu = $('menu-wrapper'),
            elements = [],
            files;

        // selectors buggy, hack varible current
        var current;
        ////
        Object.each(Docs.Scripts, function(scripts, folder) {
            var head = new Element('h2', { 'text': folder });
            var list = new Element('ul', { 'class': 'folder' });
            var wrapper = $('docs-wrapper');
            list.adopt(scripts.map(function(script) {
                var file = new Element('h3').adopt(new Element('a', {
                    'text': script,
                    'href': '#' + folder + '/' + script,
                    'events': {
                        'click': function() {
                            $('docs-wrapper').empty().set('html', '<h2>Loading...</h2>');
                            files.removeClass('selected');
                            file.addClass('selected');
                            let md = this.get('href').split('#')[1] + '.md'
                            new Request({ link: 'cancel', url: md, onSuccess: Docs.update }).get();
                        }
                    }
                }));
                /////
                if (('#' + folder + '/' + script) == window.location.hash) {
                    current = file.getFirst();
                }
                /////
                return new Element('li').adopt(file);
            }));

            elements.push(head);
            elements.push(list);
        });
        files = menu.adopt(elements).getElements('h3');
        ////
        (current || document.getElement('#menu a[href=' + window.location.hash + ']') || document.getElement('#menu a')).fireEvent('click');
    },

    local: function() {
        Request.implement({
            getXHR: function() {
                return new XMLHttpRequest();
            },
            isSuccess: function() {
                return (!this.status || (this.status >= 200) && (this.status < 300));
            }
        });
    },

    update: function(markdown) {
        var wrapper = $('docs-wrapper'),
            submenu = $('submenu');
        if (!submenu) submenu = new Element('div').set('id', 'submenu');

        var parsed = Docs.parse(markdown);
        wrapper.set('html', parsed.innerHTML);
        document.getElement('#menu-wrapper h3.selected').getParent().grab(submenu.empty());

        var methods = Docs.methods(parsed, submenu);
        Docs.scroll();
    },

    parse: function(markdown) {
        if (!this.showdown) {
            return markdown;
        }
        var html = this.showdown.makeHtml(markdown);
        var temp = new Element('div').set('html', html);
        var anchor = (/\{#(.*)\}/);

        temp.getElements('h1, h2, h3, h4, h5, h6').each(function(h) {
            var matches = h.innerHTML.match(anchor);
            if (matches) h.set('id', matches[1]);
            h.innerHTML = h.innerHTML.replace(anchor, '');
        });

        var heading = temp.getElement('h1');
        if (heading) heading.set('class', 'first');
        return temp;
    },

    methods: function(parse, wrapper) {
        var headers = parse.getElements('h1');
        var anchors = parse.getElements('h2[id]');

        headers.each(function(header, i) {
            var group = new Element('ul').inject(wrapper);
            var head = header.get('text').split(':');
            head = (head.length == 1) ? head[0] : head[1];
            var section = header.id.split(':')[0];

            var lnk = '<a href="' + Docs.anchorsPath + '#' + header.id + '">' + head + '</a>';
            new Element('li').set('html', lnk).inject(group);
            var subgroup = new Element('ul', { 'class': 'subgroup' }).inject(group);

            anchors.each(function(anchor) {
                var sep = anchor.id.match(':');
                var subSection = anchor.id.split(':')[0];
                if (section == subSection || (!i && !sep)) {
                    var method = anchor.get('text').replace(section, '');
                    lnk = '<a href="' + Docs.anchorsPath + '#' + anchor.id + '">' + method + '</a>';
                    new Element('li').set('html', lnk).inject(subgroup);
                }
            });
        });
    },

    scroll: function() {
        if (!Docs.scrolling) Docs.scrolling = new Fx.Scroll('docs', { 'offset': { x: 0, y: -4 } });

        window.$$('#submenu a').each(function(anchor) {
            anchor.addEvent('click', function(e) {
                e.stop();
                var lnk = $(anchor.href.split('#')[1]);
                Docs.scrolling.toElement(lnk);
            });
        });
    }

};

export default Docs;