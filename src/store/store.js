import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  games: [
    {
      name: 'Concordia',
      props: {
        toggleable: {
          visible: true,
          rankable: true
        }
      }
    },
    {
      name: 'Alien Frontiers',
      props: {
        toggleable: {
          visible: true,
          rankable: true
        }
      }
    }
  ]
};

const getters = {
  games: state => {
    return state.games;
  },
  visibleGames: state => {
    return state.games.filter(game => game.props.toggleable.visible);
  },
  rankableGames: state => {
    return state.games.filter(game => game.props.toggleable.rankable);
  }
};

const actions = {
  getCollection({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.http
        .get(request)
        .then(response => {
          // @TODO check for and handle 202 status before commit & resolve
          commit('importCollection', response.body);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  importCollection(state, collection) {
    console.log(data);
  },
  toggle(state, payload) {
    payload.game.props.toggleable[payload.property] = payload.value;
    state.games[payload.index] = payload.game;
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
