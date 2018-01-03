import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  requests: [],
  games: [],
  preImportGames: [],
  toggleables: {
    // propertyName: default value
    visible: true,
    rankable: true
  },
  properties: {
    visible: 'vbln',
    rankable: 'rbln'
  },
  view: 'vbl',
  views: {
    vbl: {
      text: 'Default',
      details: 'Visible games appear in the default view.',
      getter: 'visibleGames'
    },
    rbl: {
      text: 'Rankable only',
      details: 'Rankable games are the candidates for your list(s).',
      getter: 'rankableGames'
    },
    all: {
      text: 'Unrestricted',
      details: 'All games.',
      getter: ''
    },
    vbln: {
      text: 'Invisible only',
      details: 'Invisible games do not appear in the default view.',
      getter: 'visibleGames'
    },
    rbln: {
      text: 'Unrankable only',
      details:
        'Unrankable games still appear in the default view, but are not ' +
        'considered as candidates for your list(s).',
      getter: 'rankableGames'
    }
  }
};

const getters = {
  currentView: state => {
    return state.view;
  },
  games: (state, getters) => {
    if (getters.currentView == 'all') return state.games;
    return getters[state.views[getters.currentView].getter];
  },
  viewObj: (state, getters) => {
    return state.views[getters.currentView];
  },
  propertyObj: state => prop => {
    return state.views[state.properties[prop]];
  },
  viewObjs: state => {
    return state.views;
  },
  visibleGames: state => {
    return state.games.filter(game => {
      return game.visible == !(state.view.charAt(3) == 'n');
    });
  },
  rankableGames: state => {
    return state.games.filter(game => {
      return game.rankable == !(state.view.charAt(3) == 'n');
    });
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
  toggles: state => {
    return Object.keys(state.toggleables);
  },
  getProp: state => (id, prop) => {
    let g = state.games.find(game => {
      return game.gameId == id;
    });
    return g[prop];
  },
  getGame: state => id => {
    return state.games.find(game => {
      return game.gameId == id;
    });
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
          commit('preprocessCollection', data);
          return resolve(response);
        })
        .catch(error => {
          return reject(error.message);
        });
    });
  }
};

const mutations = {
  setView(state, v) {
    state.view = v;
  },
  /**
   * Processes data from server, shapes it for this app's use, and insert it
   * into state as preImportGames (does not change state.games)
   * @param  {Object}   state       app state
   * @param  {Object[]} collection  game collection from server
   * @return {void}                 no return value
   */
  importMerge(state) {
    let newSet = _.unionBy(state.games, state.preImportGames, 'gameId');
    state.games = newSet;
    state.preImportGames = [];
  },
  importReplace(state) {
    state.games = state.preImportGames;
    state.preImportGames = [];
  },
  importCancel(state) {
    state.preImportGames = [];
  },
  /**
   * Maps BGG data to a flat object with this apps toggleable properties
   * inserted, defaulted to true, and adds to state as state as preImportGames
   * for user to choose to merge with or replace state.games, or discard.
   * @param  {Object}   state       app state
   * @param  {Object[]} collection  game collection from server
   * @return {void}                 no return value
   */
  preprocessCollection(state, collection) {
    collection = _.uniqBy(collection, 'gameId');
    let prepdCollection = _.map(collection, game => {
      return {
        ...state.toggleables,
        ...game,
        ignore: false
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
    state.games.find(game => {
      return game.gameId == payload.id;
    })[payload.property] =
      payload.value;
    //   _.find(state.games, game => {
    //     return game.gameId == payload.id;
    //   })[payload.property] =
    //     payload.value;
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()]
});
