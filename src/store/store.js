import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

const state = {
  settings: {
    merge: false
  },
  requests: [],
  games: [],
  preImportGames: []
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
  },
  preImportGames: state => {
    return state.preImportGames;
  },
  newGames: state => {
    return _.difference(state.preImportGames, state.games);
  },
  droppedGames: state => {
    return _.difference(state.games, state.preImportGames);
  }
};

const actions = {
  getCollection({ commit }, { username }) {
    return new Promise((resolve, reject) => {
      if (!username.length) {
        reject({ error: { message: 'No username provided.' } });
      }
      let request = 'http://rankgames.ty-pe.com/bggapi/?username=' + username;
      this.state.requests.push(request);
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
    let prepdCollection = _.map(collection, game => {
      return {
        name: game.name,
        properties: {
          toggleable: {
            visible: true,
            rankable: true
          },
          bgg: { ...game }
        }
      };
    });
    state.preImportGames = prepdCollection;
  },
  /**
   * Mutates the value of a game's toggleable property
   * (game.properties.toggleable...)
   * @param  {Object} state   [description]
   * @param  {Object} payload Has properties index (game's index in
   *                          state.games array), property (name of the
   *                          toggleable property to mutate) and value (new
   *                          value for mutated property)
   * @return {Void}           No return statement.
   */
  toggle(state, payload) {
    state.games[payload.index].properties.toggleable[payload.property] =
      payload.value;
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
