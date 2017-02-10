/**
 * CNSKnight Mif Tree
 */
import Tree from './Core/Tree';
// [Browser, Class, Events, Options, Cookie, Drag, Element]
const cmt = {
    ids: {},
    id: function(id) {
        return cmt.ids[id];
    },
    Tree: Tree
};
window.cmt = window.Mif = cmt;
export default cmt;