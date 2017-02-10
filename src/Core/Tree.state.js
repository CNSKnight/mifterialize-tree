var state = {
    ids: {},
    id: function(id) {
        return state.ids[id];
    },
};

export default state;