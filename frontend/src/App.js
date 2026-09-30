import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Career from "./components/Career";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Blogs from "./pages/Blogs";
import Admin from "./pages/Admin";
import { Toaster } from "./components/ui/toaster";

const Home = () => (
  <>
    <Hero />
    <About />
    <Career />
    <Projects />
    <Contact />
  </>
);

const AppRoutes = ({ setLoading }) => {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return <>
    <Preloader onDone={() => setLoading(false)} />
    <CustomCursor />
    <ScrollProgress />
    {!isAdmin && <Header />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
    <Toaster />
  </>;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
  }, [loading]);

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes setLoading={setLoading} />
      </BrowserRouter>
    </div>
  );
}

export default App;
