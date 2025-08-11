import { BrowserRouter } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar/NavBar";
import { Banner } from "./components/Banner/Banner";
import { Skills } from "./components/Skills/Skills";
import { Projects } from "./components/MyProjects/Projects";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Banner />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;