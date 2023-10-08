import Page from "@/template"

import { ROUTES_NAMES, ROUTES, createPages } from "./Router.helper.js"

let pages = createPages()

let currentRoute = null
let currentPage = null

let currentUser = null

export const getCurrentUser = () => currentUser
export const setCurrentUser = (u) => (currentUser = u)

const TEMPLATE = new Page()
TEMPLATE.render()

export const navigate = (route) => {
  if (!Object.values(ROUTES_NAMES).includes(route))
    throw new Error(`There is no such route: ${route}!`)

  currentRoute = ROUTES[route] //keeps in memory the url part responsible for the page
  history.pushState({}, "", `${currentRoute}`)

  currentPage = pages[route]

  TEMPLATE.updateChildren(currentPage)
}

export const clearRoutes = () => {
  pages = createPages()
}
