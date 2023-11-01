import { Popup } from "@/components";
// todo: should we add customable message here?
export async function throwable(callback, options) {
  const { position = "top-right", type = "error" } = options || {};
  try {
    return await callback();
  } catch (error) {
    console.log(error);
    const popupError = new Popup(
      position,
      type,
      error.message || "Some error occured"
    );
    popupError.render();
  }
}
