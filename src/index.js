import Tree from './Core/Tree';
// [Browser, Class, Events, Options, Cookie, Drag, Element]
const cmt = {
    ids: {},
    id: function(id) {
        return cmt.ids[id];
    },
    Tree: Tree
};

export default cmt;