export * from './categories.api.js'
export * from './transactions.api.js'
export * from './wallets.api.js'


export const getByUser = async (collectionRefName) => {
  const collectionByUserQuery = query(collectionRefName, where('owner', '==', Router.getCurrentUser().uid))
  const responseSnapShot = await getDocs(collectionByUserQuery)
  const res = []
  responseSnapShot.forEach((p) => res.push(p.data()))
  return res
}