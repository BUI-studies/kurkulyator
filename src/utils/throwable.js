// some popup with error message

export async function throwable(callback) {
  try {
    return await callback();
  } catch (error) {
    alert(error.message);
  }
}
