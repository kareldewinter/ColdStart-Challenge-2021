import Vue from 'vue';
import Vuex from 'vuex';
import catalogMod from './modules/catalog';
import ordersMod from './modules/orders';

// export * from './modules/mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    catalog: catalogMod,
    orders: ordersMod,
  },
  state: {
  },
});
