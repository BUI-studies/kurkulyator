import { Login, Home, Categories, Wallets, TransactionsHistory } from '@/pages'

export const ROUTES_NAMES = Object.freeze({
  LOGIN: 'LOGIN',
  HOME: 'HOME',
  CATEGORIES: 'CATEGORIES',
  WALLETS: 'WALLETS',
  TRANSACTIONS_HISTORY: 'TRANSACTIONS_HISTORY',
})

export const ROUTES = Object.freeze({
  [ROUTES_NAMES.HOME]: '/',
  [ROUTES_NAMES.LOGIN]: '/login',
  [ROUTES_NAMES.CATEGORIES]: '/categories',
  [ROUTES_NAMES.WALLETS]: '/wallets',
  [ROUTES_NAMES.TRANSACTIONS_HISTORY]: '/transactionsHistory',
})

export const createPages = () =>
  Object.freeze({
    [ROUTES_NAMES.LOGIN]: new Login(),
    [ROUTES_NAMES.HOME]: new Home(),
    [ROUTES_NAMES.CATEGORIES]: new Categories(),
    [ROUTES_NAMES.WALLETS]: new Wallets(),
    [ROUTES_NAMES.TRANSACTIONS_HISTORY]: new TransactionsHistory(),
  })
