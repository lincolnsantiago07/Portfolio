import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../../assets/img/logo.jpeg";
import navIcon1 from "../../assets/img/nav-icon1.svg";
import navIcon2 from "../../assets/img/nav-icon2.svg";
import { HashLink } from "react-router-hash-link";
import styles from "./NavBar.module.css";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // aplica estado correto no load
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const setVW = () =>
      document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
    setVW();
    window.addEventListener("resize", setVW);
    return () => window.removeEventListener("resize", setVW);
  }, []);

  const onUpdateActiveLink = (value) => setActiveLink(value);

  return (
    <Navbar
      expand="lg"
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
    >
      <Container>
        <Navbar.Brand
          as={HashLink}
          smooth
          to="#home"
          className={styles.brand}
          onClick={() => onUpdateActiveLink("home")}
        >
          <img className={styles.brandImg} src={logo} alt="Logo" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={styles.toggler}
        >
          <span className={styles.togglerIcon} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={HashLink}
              smooth
              to="#home"
              className={`${styles.navLink} ${activeLink === "home" ? styles.navLinkActive : ""}`}
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={HashLink}
              smooth
              to="#skills"
              className={`${styles.navLink} ${activeLink === "skills" ? styles.navLinkActive : ""}`}
              onClick={() => onUpdateActiveLink("skills")}
            >
              Skills
            </Nav.Link>

            <Nav.Link
              as={HashLink}
              smooth
              to="#projects"
              className={`${styles.navLink} ${activeLink === "projects" ? styles.navLinkActive : ""}`}
              onClick={() => onUpdateActiveLink("projects")}
            >
              Projects
            </Nav.Link>
          </Nav>

          <span className={styles.navbarText}>
            <div className={styles.social}>
              <a
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/linkfwee"
              >
                <img className={styles.socialImg} src={navIcon1} alt="LinkedinIcon" />
              </a>
              <a
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/lincolnsantiago07"
              >
                <img className={styles.socialImg} src={navIcon2} alt="GithubIcon" />
              </a>
            </div>

            <HashLink smooth to="#connect">
              <button className={styles.ctaBtn}>
                <span>Let’s Connect</span>
              </button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};