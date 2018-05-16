import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import _ from "lodash";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const state = {
  useImgComparisons: true,
  backgroundLoad: false,
  perPage: 24,
  activeFilters: ['isExpansion'],
  lists: [],
  libraries: [],
  filters: {
    rating: {
      test: 0,
      text: "games I haven\'t rated",
      simple: true
    },
    owned: {
      test: true,
      text: "games I don't own",
      simple: true
    },
    isExpansion: {
      test: false,
      text: "expansions",
      simple: true
    },
    numPlays: {
      test: 1,
      text: "games I haven't played",
      simple: true
    },
    pcf: {
      test: null,
      text: "players",
      simple: false
    },
    ur: {
      test: null,
      text: "user rating",
      simple: false
    }
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
    visible: "vbln",
    rankable: "rbln"
  },
  introduced: false,
  view: "dfl",
  views: {
    dfl: {
      text: "Default",
      details: "Showing all rankable games that are marked visible.",
      getter: "rvGames"
    },
    rbl: {
      text: "All rankable",
      details: "All games marked rankable, including invisible ones.",
      getter: "rankableGames"
    },
    vbl: {
      text: "Visible only",
      details: "Showing rankable and unrankable games that are marked as visible.",
      getter: "visibleGames"
    },

    vbln: {
      text: "Invisible only",
      details: "Invisible games do not appear in the default view. They may or may not be rankab" +
        "le.",
      getter: "visibleGames"
    },
    rbln: {
      text: "Unrankable only",
      details: "Unrankable games do not appear in the default view, and are not considered as ca" +
        "ndidates for your list(s).",
      getter: "rankableGames"
    },
    all: {
      text: "Everything",
      details: "Showing all games.",
      getter: ""
    }
  }
};

const getters = {
  preImportGames: state => {
    return state.preImportGames;
  },
  wasIntroduced: state => {
    return state.introduced;
  },
  export: state => {
    return JSON.stringify({
      games: state.games,
      lists: state.lists,
      exported: Date.now(),
      user: state.games[0].user
    })
  },
  dump: state => {
    return JSON.stringify(state);
  },
  getLists: state => {
    return state.lists;
  },

  getList: state => id => {
    return state
      .lists
      .find(list => {
        return id == list.id;
      });
  },
  activePCF: state => {
    return state
      .activeFilters
      .some(f => {
        return f.indexOf("pcf") >= 0;
      });
  },
  getUseImgComparisons: state => {
    return state.useImgComparisons;
  },
  getBackgroundLoad: state => {
    return state.backgroundLoad;
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
    if (getters.currentView == "all")
      return state.games;
    return getters[state.views[getters.currentView].getter];
  },
  allGames: state => {
    return state.games;
  },
  filteredGames: state => {
    return state
      .games
      .filter(game => {
        let show = true;
        state
          .activeFilters
          .forEach(filter => {

            if (filter.substr(0, 3) === "pcf") {
              // player count filter
              let pcfArgs = filter.split("-");
              if (pcfArgs.length < 3) {
                // player count includes 
                show = game.minPlayers <= pcfArgs[1] && game.maxPlayers >= pcfArgs[1];
              } else {
                // player count ranges
                show = game.minPlayers <= pcfArgs[1] && game.maxPlayers >= pcfArgs[2];
              }
            } else {
              if (
                game[filter] !== state.filters[filter].test &&
                (
                  typeof state.filters[filter].test != "number" ||
                  game[filter] < state.filters[filter].test
                )
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
    return getters
      .filteredGames
      .filter(game => {
        return game.visible == !(state.view.charAt(3) == "n");
      });
  },
  rankableGames: (state, getters) => {
    return getters
      .filteredGames
      .filter(game => {
        return game.rankable == !(state.view.charAt(3) == "n");
      });
  },
  rvGames: (state, getters) => {
    return getters
      .rankableGames
      .filter(game => {
        return game.visible == !(state.view.charAt(3) == "n");
      });
  },
  newGames: state => {
    return _.differenceBy(state.preImportGames, state.games, "gameId");
  },
  droppedGames: state => {
    return _.differenceBy(state.games, state.preImportGames, "gameId");
  },
  toggles: state => {
    return Object.keys(state.toggleables);
  },
  getProp: state => (id, prop) => {
    let g = state
      .games
      .find(game => {
        return game.gameId == id;
      });
    return g[prop];
  },
  getGame: state => id => {
    return state
      .games
      .find(game => {
        return game.gameId == id;
      });
  }
};

const actions = {
  toggleProp({
    commit
  }, payload) {
    commit("toggle", payload);
  },
  setProp({
    commit,
    getters
  }, {
    id,
    property
  }) {
    if (typeof id == 'undefined' || id < 1)
      throw new RangeError('Invalid game ID')

    if (typeof property == 'undefined')
      throw new RangeError('Invalid property name')

    commit("setNewProp", {
      game: getters.getGame(id),
      property
    });
  },
  loadSavedData({
    commit
  }, data) {
    commit("preprocessCollection", data.games);
  },
  setIntroduced({
    commit
  }) {
    commit("setIntroducedMutation");
  },
  setUseImgComparisons({
    commit
  }, value) {
    commit("setUseImgComparisonsMutation", value);
  },
  setBackgroundLoad({
    commit
  }, value) {
    commit("setBackgroundLoadMutation", value);
  },
  setPerPage({
    commit
  }, value) {
    commit("setPerPageMutation", value);
  },
  renameList({
    commit,
    getters,
    dispatch
  }, {
    listid,
    newName
  }) {
    commit("renameList", {
      list: getters.getList(listid),
      newName
    });
    dispatch("listUpdated", {
      listid
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
  setrankto({
    commit,
    dispatch,
    getters
  }, {
    listid,
    game,
    rank
  }) {
    let list = getters.getList(listid);
    let currentRank = list
      .list
      .indexOf(game);
    if (currentRank >= 0)
      commit("unrank", {
        list,
        game,
        rank: currentRank
      });
    if (rank >= 0) {
      commit("setRank", {
        list,
        rank,
        game
      });
    }
    dispatch("listUpdated", {
      listid
    });
  },
  /**
   *
   * @param {function} commit Vue context.commit
   * @param string username
   * @return promise  Resolves array of game objects
   */
  getCollection({
    commit
  }, username) {
    return new Promise((resolve, reject) => {
      if (!username.length) {
        reject("No username provided.");
      }
      let request = "http://rankgames.ty-pe.com/bggapi/?username=" + encodeURI(username);
      commit("logRequest", request);
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
          data["user"] = username;
          commit("preprocessCollection", data);
          return resolve(response);
        })
        .catch(error => {
          return reject(error.message);
        });
    });
  },
  importGames({
    commit
  }, {
    mode
  }) {
    commit(mode);

  },
  makeNewList({
    state,
    getters,
    commit
  }, {
    name
  }) {
    state
      .lists
      .sort((a, b) => {
        return a.id - b.id;
      });
    let nextId = state.lists.length;
    for (let i = 0; i < nextId; i++) {
      if (i < state.lists[i].id) {
        nextId = i;
      }
    }
    let ids = getters
      .rankableGames
      .map(game => game.gameId);
    commit("newList", {
      name: name,
      games: ids.map(a => [
        Math.random(),
        a
      ]).sort((a, b) => a[0] - b[0]).map(a => a[1]),
      created: Date.now(),
      modified: Date.now(),
      id: nextId,
      list: []
    });
  },
  /**
   *
   *
   * @param {Object} { commit, dispatch, state, getters } Vuex state methods
   * @param {Object} { listid, game }
   */
  dropGameInList({
    commit,
    dispatch,
    getters
  }, {
    listid,
    game
  }) {
    let list = getters.getList(listid);
    let index = list
      .games
      .indexOf(game);
    commit("dropGameFromList", {
      list,
      index,
      game
    });
    dispatch("listUpdated", {
      listid
    });
  },
  /**
   * Removes duplicates and updates date modified
   * @param  {Function} commit  Vuex commit
   * @param  {Object}   state   Vuex store state
   * @param  {Object}   getters Vuex store getters
   * @param  {Number}   listid  id of list that is being updated
   */
  listUpdated({
    commit,
    getters
  }, {
    listid
  }) {
    let list = getters.getList(listid);
    // commit('dedupe', { list });
    commit("modified", {
      list
    });
  }
};

const mutations = {
  setNewProp(state, {
    game,
    property
  }) {
    console.log('game', game)
    console.log('prop', property)
    Vue.set(game, property, true);
  },
  setIntroducedMutation(state) {
    state.introduced = !state.introduced;
  },
  /**
   * Removes duplicate games from ranked and unranked set in list
   *
   * @param {any} state
   * @param {any} { list }
   */
  dedupe(state, {
    list
  }) {
    list.list = _.uniq(list.list);
    list.games = _.uniq(list.games);
  },
  /**
   * dropGameFromList removes the indicate game (game) from the given rank
   * (index) of the ranked set for the indicated list (id)
   *
   * @param {any} state
   * @param {any} { list, index, game }
   */
  dropGameFromList(state, {
    list,
    index,
    game
  }) {
    if (list.games[index] == game)
      list.games.splice(index, 1);
    else
      throw ReferenceError("Game is not at given index.");
  },
  modified(state, {
    list
  }) {
    list.modifed = Date.now();
  },
  /**
   * Mutate list with listid such that game with game id has given rank
   * @param {Object} state  Vuex state
   * @param {Number} listid ID number of list to mutate
   * @param {Number} rank   Rank to assign to game
   * @param {Number} game   ID number of game
   */
  setRank(state, {
    list,
    rank,
    game
  }) {
    list
      .list
      .splice(rank, 0, game);
  },
  unrank(state, {
    list,
    game,
    rank
  }) {
    if (list.list[rank] === game) {
      list
        .list
        .splice(rank, 1);
    } else {
      throw ReferenceError("Given game does not have given rank.");
    }
  },
  logRequest(state, req) {
    state
      .requests
      .push(req);
  },
  renameList(state, {
    list,
    newName
  }) {
    list.name = newName;
  },
  purgeLists(state) {
    state.lists = [];
  },
  deleteList(state, payload) {
    state.lists = state
      .lists
      .filter(list => {
        return list.id !== payload.id;
      });
  },
  newList(state, list) {
    state
      .lists
      .push(list);
  },
  clearPCF(state) {
    // PCF = "player count filter"
    let index = state
      .activeFilters
      .findIndex(f => {
        return f.indexOf("pcf") >= 0;
      });
    if (index >= 0) {
      state
        .activeFilters
        .splice(index, 1);
      return index;
    }
  },
  setBackgroundLoadMutation(state, t) {
    state.backgroundLoad = t;
  },
  setUseImgComparisonsMutation(state, t) {
    state.useImgComparisons = t;
  },
  setPerPageMutation(state, n) {
    state.perPage = n;
  },
  setFilter(state, f) {
    let index = state
      .activeFilters
      .indexOf(f);
    if (index >= 0) {
      state
        .activeFilters
        .splice(index, 1);
      return index;
    }
    state
      .activeFilters
      .push(f);
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
    let newSet = _.unionBy(state.games, state.preImportGames, "gameId");
    let conflicts = _.intersectionBy(state.preImportGames, state.games, "gameId");
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
  loadFromFile(state, payload) {
    console.log('loadFromFile')
    console.log(payload)
    state.games = payload.games;
    state.lists = payload.lists;
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
    let user = collection.user || 'my save file';
    collection = _.uniqBy(collection, "gameId");
    let prepdCollection = _.map(collection, game => {
      let g = {
        ...() => {
          let exists = false;
          for (const toggle in state.toggleables) {
            if (typeof game[toggle] == "boolean") {
              exists = true
            }
          }
          return exists ? null : state.toggleables;
        },
        ...game,
        user: user
      };
      g["ratings"] = {};
      g["ratings"][g.user] = g.rating;
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
    state
      .games
      .find(game => {
        return game.gameId == payload.id;
      })[payload.property] = payload.value;
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState({
    paths: [
      "introduced",
      "perPage",
      "activeFilters",
      "requests",
      "games",
      "view",
      "lists",
      "useImgComparisons"
    ]
  })]
});