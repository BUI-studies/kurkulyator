import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Router, ROUTES_NAMES } from "@/routes";

import "./style.css";

onAuthStateChanged(auth, (user) => {
  console.log(user);
  Router.setCurrentUser(user);
  Router.updateHeader();
  if (!user) {
    Router.navigate(ROUTES_NAMES.LOGIN);
  } else {
    Router.navigate(ROUTES_NAMES.HOME);
  }
});

//-------------------------//
import UniversalTable from "./src/components/UniversalTable/UniversalTable.js";

const table = new UniversalTable(
  [
    { name: "Gogi", age: 54, sex: "male" },
    { name: "Gigi", age: 13, sex: "male" },
    { name: "Gagi", age: 27, sex: "female" },
  ],
  {
    parent: document.body,
    header: ["Name", "Age", "Sex"],
  }
);

table.render();
