import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Router, ROUTES_NAMES } from "@/routes";

onAuthStateChanged(auth, (user) => {
  Router.setCurrentUser(user);
  if (!user) {
    Router.navigate(ROUTES_NAMES.LOGIN);
  } else {
    Router.navigate(ROUTES_NAMES.HOME);
  }
});
