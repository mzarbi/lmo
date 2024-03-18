import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import {useDatasourceStore} from "../datasourceStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach(async (to, from, next) => {
  const datasourceStore = useDatasourceStore();
  if (!datasourceStore.datasources.length) { // Check if datasources are already loaded
    await datasourceStore.fetchDatasources(); // Wait for datasources to be fetched
  }
  next();
});

export default function (app) {
  app.use(router)
}
export { router }
