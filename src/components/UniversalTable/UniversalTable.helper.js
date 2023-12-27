export const mirrorSortingResults = (res) => {
  if (res < 0) {
    return 1
  } else if (res > 0) {
    return -1
  } else {
    return res
  }
}
