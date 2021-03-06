/**
 * here's the es6 version
 */
Request.implement({
    processScripts: function(text) {
        if (this.options.evalResponse && (/(ecma|java)script/).test(this.getHeader('Content-type'))) return Browser.exec(text);
        return text.stripScripts(this.options.evalScripts);
    }

});

const Demos = {
    demosPath: './Demos/',
    demosData: './data/demos.json',
    start: function() {
        if (location.protocol == 'file:') Demos.local();
        Demos.getList();
        var hash = document.location.hash;
        if (hash) {
            var demo = hash.replace('#', '');
            this.demo = demo;
            Demos.load(demo)
        }
    },

    categories: function(list) {
        var menu = document.body.getElement('.demos-bloc .side-nav');
        Object.forEach(list, function(group, idx) {
            var category = new Element('h2', { 'class': 'collection-header', 'text': idx }).inject(menu);
            var collection = new Element('div', { 'class': 'collection' }).inject(category, 'after');

            Object.forEach(group, function(item, idx) {
                new Element('a', {
                    'class': 'collection-item',
                    'href': '#!',
                    'text': item.title,
                    'events': {
                        'click': function(e) {
                            e.preventDefault();
                            document.location.hash = idx;
                            Demos.load(idx);
                        }
                    }
                }).inject(collection);
            });
        });
    },

    load: function(folder) {
        var path = this.demosPath + folder + '/';
        var wrapper = $('demos-wrapper');

        var demo = new Request.HTML({
            url: path + 'index.html',
            onSuccess: function(tree) {
                var parsed = Demos.parse(tree, folder);
                wrapper.getElement('.card-title').set('text', parsed.title);
                wrapper.getElement('.demos-content').empty().adopt(parsed.content);
                var assets = $(document.head).getElements('#demo-css, #demo-js');
                if (assets) assets.dispose();
                new Element('link', { 'id': 'demo-css', 'type': 'text/css', 'rel': 'stylesheet', 'href': path + 'demo.css' })
                    .inject(document.head);
                new Element('script', { 'id': 'demo-js', 'type': 'text/javascript', 'src': path + 'demo.js' })
                    .inject(document.head);
                Demos.setInformer(folder);
            }
        });
        demo.get();
    },

    parse: function(tree, folder) {
        var temp = new Element('div').adopt(tree),
            dir = folder;
        var fixes = temp.getElements('a[href!="#"], img');

        fixes.each(function(fix) {
            var type = (fix.get('src')) ? 'src' : 'href';

            if (Browser.Engine && Browser.Engine.trident && type == 'src') {
                var split = window.location.pathname.split('/').slice(0, -1).join('/') + '/';
                dir = fix.get(type).replace(split, split + folder + '/');
                fix.set(type, dir);
            } else fix.set(type, dir + '/' + fix.get(type));
        });
        var title = temp.getElement('h1');
        var parsed = {
            title: title ? title.get('text') : '-no-title-',
        };
        title && title.destroy();
        parsed.content = temp;
        return parsed;
    },

    getList: function() {
        new Request.JSON({ url: this.demosData })
            .get().then(function(data) {
                Demos.categories(data.json);
            });
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

    setInformer: function(folder) {
        var info = new Element('nav')
            .adopt(new Element('div', { class: 'nav-wrapper' })
                .adopt(new Element('ul', { 'class': 'right' })));
        info.inject($('demos-wrapper').getElement('.demos-content'), 'top');

        var informer = {};
        ['html', 'js', 'css'].each(function(type) {
            informer[type] = new Element('pre', { 'class': 'informer ' + type, styles: { display: 'none' } }).inject(info, 'after');
        });

        new Request({
            url: this.demosPath + folder + '/index.html',
            onComplete: function(text) {
                if (!text) return;
                var body = '';
                text.replace(/<body[^>]*>([\s\S]*?)<\/body>/gi, function() {
                    body += arguments[1] + '\n';
                    return '';
                });
                informer.html.innerHTML = body.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            }
        }).get();
        new Request({
            url: this.demosPath + folder + '/demo.css',
            onComplete: function(text) {
                if (!text) return;
                informer.css.innerHTML = text;
            }
        }).get();

        new Request({
            url: this.demosPath + folder + '/demo.js',
            onComplete: function(text) {
                if (!text) return;
                informer.js.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        }).get();
        ['html', 'js', 'css'].each(function(type) {
            var navItem = new Element('li').adopt(
                new Element('a', { href: '#' + type, text: type })
                .addEvent('click', function(event) {
                    event.preventDefault();
                    for (var item in informer) {
                        if (item !== type) {
                            informer[item].style.display = 'none';
                        } else {
                            if (informer[type].style.display == 'none') {
                                informer[type].style.display = 'block';
                            } else {
                                informer[type].style.display = 'none';
                            }
                        }

                    };
                })
            );

            navItem.inject(info.getElement('ul'));
        });
    }
};

export default Demos;