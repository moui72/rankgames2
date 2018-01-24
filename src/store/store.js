import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  perPage: 24,
  activeFilters: [],
  lists: [],
  libraries: [],
  filters: {
    owned: {
      test: true,
      text: "games I don't own",
      simple: true
    },
    isExpansion: { test: false, text: 'expansions', simple: true },
    numPlays: { test: 1, text: "games I haven't played", simple: true },
    pcf: { test: null, text: 'players', simple: false },
    ur: { test: null, text: 'user rating', simple: false }
  },
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
  getLists: state => {
    return state.lists;
  },
  getList: state => id => {
    return state.lists.find(list => {
      return id == list.id;
    });
  },
  activePCF: state => {
    return state.activeFilters.some(f => {
      return f.indexOf('pcf') >= 0;
    });
  },
  getPerPage: state => {
    return state.perPage;
  },
  getActiveFilters: state => {
    return state.activeFilters;
  },
  getFilter: state => filterName => {
    return state.filters[filterName];
  },
  getFilters: state => {
    return state.filters;
  },
  currentView: state => {
    return state.view;
  },
  games: (state, getters) => {
    if (getters.currentView == 'all') return state.games;
    return getters[state.views[getters.currentView].getter];
  },
  filteredGames: (state, getters) => {
    return state.games.filter(game => {
      let show = true;
      state.activeFilters.forEach(filter => {
        if (filter.substr(0, 3) === 'pcf') {
          // player count filter
          let pcfArgs = filter.split('-');
          if (pcfArgs.length < 3) {
            // includes mode
            show =
              game.minPlayers <= pcfArgs[1] && game.maxPlayers >= pcfArgs[1];
          } else {
            show =
              game.minPlayers <= pcfArgs[1] && game.maxPlayers >= pcfArgs[2];
          }
        } else {
          if (
            game[filter] !== state.filters[filter].test &&
            (typeof state.filters[filter].test != 'number' ||
              game[filter] < state.filters[filter].test)
          ) {
            show = false;
          }
        }
      });
      return show;
    });
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
  visibleGames: (state, getters) => {
    return getters.filteredGames.filter(game => {
      return game.visible == !(state.view.charAt(3) == 'n');
    });
  },
  rankableGames: (state, getters) => {
    return getters.filteredGames.filter(game => {
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
          data['user'] = username;
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
  renameList(state, payload) {
    console.log(payload);
    state.lists.find(list => {
      return list.id === payload.id;
    }).name =
      payload.newName;
  },
  purgeLists(state) {
    state.lists = [];
  },
  deleteList(state, payload) {
    state.lists = state.lists.filter(list => {
      return list.id !== payload.id;
    });
  },
  makeNewList(state, payload) {
    const listIDs = state.lists.map(list => {
      return list.id;
    });
    let nextId = listIDs.length;
    for (let i = 0; i < nextId; i++) {
      if (i < listIDs[i]) {
        nextId = i;
      }
    }
    let ids = state.games.map(game => game.gameId);
    console.log(ids);
    state.lists.push({
      name: payload.name,
      games: ids,
      created: Date.now(),
      modified: Date.now(),
      id: nextId,
      list: []
    });
    state.lists.sort(function(a, b) {
      return a.id - b.id;
    });
  },
  clearPCF(state) {
    // PCF = "player count filter"
    let index = state.activeFilters.findIndex(f => {
      console.log(f.indexOf('pcf'));
      return f.indexOf('pcf') >= 0;
    });
    if (index >= 0) {
      state.activeFilters.splice(index, 1);
      return index;
    }
  },
  setPerPage(state, n) {
    state.perPage = n;
  },
  setFilter(state, f) {
    let index = state.activeFilters.indexOf(f);
    if (index >= 0) {
      state.activeFilters.splice(index, 1);
      return index;
    }
    state.activeFilters.push(f);
    return index;
  },
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
    let conflicts = _.intersectionBy(
      state.preImportGames,
      state.games,
      'gameId'
    );
    conflicts.forEach(cgame => {
      newSet.find(ngame => {
        _.assign(ngame.ratings, cgame.ratings);
      });
    });
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
    console.log(collection.user);
    let user = collection.user;
    collection = _.uniqBy(collection, 'gameId');
    let prepdCollection = _.map(collection, game => {
      let g = {
        ...state.toggleables,
        ...game,
        user: user
      };
      g['ratings'] = {};
      g['ratings'][g.user] = g.rating;
      return g;
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
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
      paths: ['perPage', 'activeFilters', 'requests', 'games', 'view', 'lists']
    })
  ]
});
