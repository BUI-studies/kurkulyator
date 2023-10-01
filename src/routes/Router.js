import { Login, Home } from "@/pages";

import { ROUTES_NAMES } from "./Router.helper.js";

let pages = createPages();

let currentRoute = null;
let currentPage = null;

let currentUser = null;
export const getCurrentUser = () => currentUser;
export const setCurrentUser = (u) => (currentUser = u);
//TODO: check if router works
export const navigate = (route) => {
  if (!ROUTES_NAMES.values.includes(route))
    throw new Error(`There is no such route: ${route}!`);

  currentRoute = ROUTES[route]; //keeps in memory the url part responsible for the page
  history.pushState({}, "", `${currentRoute}`);

  currentPage = pages[route];

  currentPage.render();
};

export const clearRoutes = () => {
  pages = createPages();
};
