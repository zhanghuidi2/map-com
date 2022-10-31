import mapVueCom from './com/map.vue';


mapVueCom.install = (app) => {
  app.component(mapVueCom.name, mapVueCom);
}


export const mapVue = mapVueCom;

