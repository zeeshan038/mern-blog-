import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const Navbar = lazy(() => import("./components/Navbar"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const Profile = lazy(() => import("./pages/Profile"));
const Blogs = lazy(() => import("./pages/Blogs"));
const About = lazy(() => import("./pages/About"));
const Post = lazy(() => import("./pages/Post"));
const Dashcomments= lazy(() => import("./components/Dashcomments"));
const DashComp= lazy(() => import("./components/DashComp"));
const Search= lazy(() => import("./pages/Search"));

const UpdatePost = lazy(()=> import("./pages/UpdatePost"));
import ProtectedRoute from "./components/ProtectedRoute";
import AdminprivateRoute from "./components/AdminprivateRoute";
import DashUsers from "./pages/DashUsers";






function App() {
  return (
    <>
      <BrowserRouter>

        <Suspense fallback={<h1>Loading...</h1>}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
           <Route path="/post/:postSlug" element={<Post/>}/>
           <Route path="/search" element={<Search/>}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<AdminprivateRoute />}>
            <Route path="/profile" element={<Profile />} />
              <Route path="/post" element={<CreatePost />} />
              <Route path="/user" element={<DashUsers />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
              <Route path="/comments" element={<Dashcomments />} />
              <Route path="/dash" element={<DashComp/>} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
