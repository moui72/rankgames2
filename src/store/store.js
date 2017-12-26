import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  lastRequest: '',
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
  getCollection({ commit }, { username }) {
    return new Promise((resolve, reject) => {
      if (!username.length) {
        reject({ error: { message: 'No username provided.' } });
      }
      let request = 'http://rankgames.ty-pe.com/bggapi/?username=' + username;
      axios
        .get(request)
        .then(response => {
          console.log('response');
          console.log(response);
          let data = response.data;
          // @TODO check for and handle 202 status before commit & resolve
          if (data.status == 202) {
            return reject(data.message);
          }
          if (data.error) {
            return reject(data.error.message);
          }
          commit('importCollection', data);
          return resolve(response);
        })
        .catch(error => {
          console.log(error);
          return reject(error.message);
        });
    });
  }
};

const mutations = {
  importCollection(state, collection) {
    console.log(collection);
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
