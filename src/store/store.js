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
  view: 'dfl',
  views: {
    dfl: {
      text: 'Default',
      details: 'Showing all rankable games that are marked visible.',
      getter: 'rvGames'
    },
    rbl: {
      text: 'All rankable',
      details: 'All games marked rankable, including invisible ones.',
      getter: 'rankableGames'
    },
    vbl: {
      text: 'Visible only',
      details:
        'Showing rankable and unrankable games that are marked as visible.',
      getter: 'visibleGames'
    },

    vbln: {
      text: 'Invisible only',
      details:
        'Invisible games do not appear in the default view. They may or may ' +
        'not be rankable.',
      getter: 'visibleGames'
    },
    rbln: {
      text: 'Unrankable only',
      details:
        'Unrankable games do not appear in the default view, and are not ' +
        'considered as candidates for your list(s).',
      getter: 'rankableGames'
    },
    all: {
      text: 'Everything',
      details: 'Showing all games.',
      getter: ''
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
  rvGames: (state, getters) => {
    return getters.rankableGames.filter(game => {
      return game.visible == !(state.view.charAt(3) == 'n');
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
  renameList({ commit, state }, { id, newName }) {
    commit('renameList', { id, newName });
    commit('listUpdated', {
      list: state.lists.find(list => {
        return list.id === id;
      })
    });
  },
  /**
   * Sets the rank of game in list to given rank, clearing any prior ranking.
   * @param  {Function} commit Vue context.commit
   * @param  {Object}   state  Vue context.state
   * @param  {Number}   listid id number of list
   * @param  {Number}   game   gameId of game
   * @param  {Number}   rank   rank to give game
   */
  setrankto({ commit, state, getters }, { listid, game, rank }) {
    let list = getters.getList(listid);
    let currentRank = list.list.indexOf(game);
    if (currentRank > 0) commit('unrank', { list, game, rank: currentRank });
    commit('setRank', { list, rank, game });
    commit('listUpdated', { list });
  },
  importGames({ commit }, mode) {
    commit(mode);
  },
  getCollection({ commit }, username) {
    console.log(username);
    return new Promise((resolve, reject) => {
      if (!username.length) {
        reject('No username provided.');
      }
      let request = 'http://rankgames.ty-pe.com/bggapi/?username=' + username;
      commit('logRequest', request);
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
  },
  makeNewList({ commit }, payload) {
    state.lists.sort(function(a, b) {
      return a.id - b.id;
    });
    let nextId = state.lists.length;
    for (let i = 0; i < nextId; i++) {
      if (i < state.lists[i].id) {
        nextId = i;
      }
    }
    let ids = state.games.map(game => game.gameId);
    console.log(ids);
    commit('newList', {
      name: payload.name,
      games: ids,
      created: Date.now(),
      modified: Date.now(),
      id: nextId,
      list: []
    });
  },
  dropGameInList({ commit, state, getters }, { listid, game }) {
    let list = getters.getList(listid);
    let index = list.games.indexOf(game);
    commit('dropGameFromList', { list, index, game });
    commit('listUpdated', { list });
  }
};

const mutations = {
  dropGameFromList(state, { list, index, game }) {
    if (list.games[index] == game) list.games.splice(index, 1);
    else throw Exception('Game is not at given index.');
  },
  listUpdated(state, { list }) {
    list.modifed = Date.now();
  },
  /**
   * Mutate list with listid such that game with game id has given rank
   * @param {Object} state  Vuex state
   * @param {Number} listid ID number of list to mutate
   * @param {Number} rank   Rank to assign to game
   * @param {Number} game   ID number of game
   */
  setRank(state, { list, rank, game }) {
    list.list.splice(rank, 0, game);
  },
  unrank(state, { list, game, rank }) {
    if (list.list[rank] === game) {
      list.list.splice(rank, 1);
    } else {
      throw Exception('Given game does not have given rank.');
    }
  },
  logRequest(state, req) {
    state.requests.push(req);
  },
  renameList(state, { id, newName }) {
    console.log(payload);
    state.lists.find(list => {
      return list.id === id;
    }).name = newName;
  },
  purgeLists(state) {
    state.lists = [];
  },
  deleteList(state, payload) {
    state.lists = state.lists.filter(list => {
      return list.id !== payload.id;
    });
  },
  makeNewList(state, list) {
    state.lists.push(list);
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
