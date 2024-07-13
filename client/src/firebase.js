
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBgu5ouaPc_gN7PIS_ym_OKggE6isdr6YY",
  authDomain: "blog-appn.firebaseapp.com",
  projectId: "blog-appn",
  storageBucket: "blog-appn.appspot.com",
  messagingSenderId: "807310271703",
  appId: "1:807310271703:web:a82d2163e351481ede7c92"
};


const app = initializeApp(firebaseConfig);

export default app;