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
  preImportGames: [],
  toggleables: ['visible', 'rankable']
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
    return _.differenceBy(state.preImportGames, state.games, 'gameId');
  },
  droppedGames: state => {
    return _.differenceBy(state.games, state.preImportGames, 'gameId');
  },
  toggles: state => id => {
    let g = _.find(state.games, game => {
      return game.gameId == id;
    });
    let obj = {};
    _.forEach(state.toggleables, p => {
      obj[p] = g[p];
    });
    return obj;
  }
};

const actions = {
  getCollection({ commit }, { username }) {
    return new Promise((resolve, reject) => {
      if (!username.length) {
        reject('No username provided.');
      }
      let request = 'http://rankgames.ty-pe.com/bggapi/?username=' + username;
      this.state.requests.push(request);
      axios
        .get(request)
        .then(response => {
          let data = response.data;
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
          return reject(error.message);
        });
    });
  }
};

const mutations = {
  /**
   * Processes data from server, shapes it for this app's use, and insert it
   * into state as preImportGames (does not change state.games)
   * @param  {Object}   state       app state
   * @param  {Object[]} collection  game collection from server
   * @return {void}                 no return value
   */
  importMerge(state) {
    let newSet = _.unionBy(
      this.state.games,
      this.state.preImportGames,
      'gameId'
    );
    state.games = newSet;
  },
  importReplace() {},
  importCancel() {},
  importCollection(state, collection) {
    let toggleables = {};
    // this.state.toggleables: string[] (property names)
    _.forEach(this.state.toggleables, p => {
      toggleables[p] = true;
    });
    let prepdCollection = _.map(collection, game => {
      return {
        ...toggleables,
        ...game
      };
    });
    state.preImportGames = prepdCollection;
    console.log(prepdCollection);
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
    _.find(state.games, game => {
      return game.gameId == payload.id;
    })[payload.property] =
      payload.value;
    /*
    is the following better than the above?
    state.games[
      _.findIndex(state.games, g => {
        return g.gameId == payload.id;
      })
    ][payload.property] =
      payload.value;
    */
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
