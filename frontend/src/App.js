import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Blogs from "./pages/Blogs";
import { Toaster } from "./components/ui/toaster";

const Home = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Contact />
  </>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
  }, [loading]);

  return (
    <div className="App">
      <BrowserRouter>
        <Preloader onDone={() => setLoading(false)} />
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
