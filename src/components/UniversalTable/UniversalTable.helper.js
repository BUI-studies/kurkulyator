export const mirrorSortingResults = (res) => {
  if (isNaN(res)) throw new TypeError('Sort callback should only return number')

  if (res < 0) {
    return 1
  } else if (res > 0) {
    return -1
  } else {
    return res
  }
}
