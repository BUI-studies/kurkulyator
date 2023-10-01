export const ROUTES_NAMES = Object.freeze({
  LOGIN: "LOGIN",
  HOME: "HOME",
})

export const ROUTES = Object.freeze({
  [ROUTES_NAMES.HOME]: "/",
  [ROUTES_NAMES.LOGIN]: "/login",
})

export const createPages = () =>
  Object.freeze({
    [ROUTES_NAMES.LOGIN]: new Login(),
    [ROUTES_NAMES.HOME]: new Home(),
  })
