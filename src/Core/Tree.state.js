var state = {
    ids: {},
    id: function(id) {
        return state.ids[id];
    },
    inFocus: null,
    nodes: []
};

export default state;