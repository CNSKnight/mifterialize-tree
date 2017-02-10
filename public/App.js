/**
 * 
 */
import Demos from './Demos/demos.js';
import Docs from './Docs/docs.js';

const navs = { Readme: null, Demos: Demos, Docs: Docs };

document.body.getElement('nav').addEvent('click:relay(a[href])', function(e) {
    e.preventDefault();
    var target = this.get('text');
    var navBloc = document.body.getElement('nav');
    navBloc.getElements('li').removeClass('active');
    Object.each(navs, function(module, nav) {
        if (nav == target) {
            document.id(nav).show();
            navBloc.getElement('[href="/' + nav + '"]').getParent('li').addClass('active');
        } else {
            document.id(nav).hide();
        }
    })
    navs[target] && navs[target].start();
});

new Request({
    url: 'README.md',
    onComplete: function(text) {
        document.id('readme-content').set('html', Docs.showdown.makeHtml(text));
    }
}).get();