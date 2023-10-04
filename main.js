import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Router, ROUTES_NAMES } from '@/routes';
import { getTransactions } from './src/API';

getTransactions().then((res) => console.log(res));

onAuthStateChanged(auth, (user) => {
  if (!user) {
    Router.navigate(ROUTES_NAMES.LOGIN);
  } else {
    Router.setCurrentUser(user);
    Router.navigate(ROUTES_NAMES.HOME);
  }
});
