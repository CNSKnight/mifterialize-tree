var state = {
    ids: {},
    id: function(id) {
        return state.ids[id];
    },
};

module.exports = state;