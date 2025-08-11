import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../../assets/img/header-img.svg";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { HashLink } from "react-router-hash-link";
import styles from "./Banner.module.css";

export const Banner = () => {
  // ---- typewriter state ----
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);

  const toRotate = ["Java Developer", "CyberSecurity", "Web Developer", "Web Designer", "UI/UX Designer"];
  const period = 2000;

  // ---- typewriter usando setTimeout (estável) ----
  useEffect(() => {
    const timer = setTimeout(() => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];

      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) setDelta((prev) => Math.max(50, prev / 2));

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((ln) => ln + 1);
        setDelta(500);
      }
    }, delta);

    return () => clearTimeout(timer);
  }, [text, delta, isDeleting, loopNum, toRotate, period]);

  // ---- offset da navbar fixa (ajuste conforme altura real) ----
  const NAV_OFFSET = 80;

  return (
    <section className={styles.banner} id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <span className={styles.tagline}>Welcome to my Portfolio</span>

                  <h1 className={styles.title}>
                    {`Hi! I'm Lincoln, a`}
                    <span className={styles.txtRotate} data-period="1000">
                      <span className={styles.wrap}>{text}</span>
                    </span>
                  </h1>

                  <p className={styles.description}>
                    This is where you will see some of my projects :)
                  </p>

                  <HashLink
                    smooth
                    to="#connect"
                    className={styles.cta}
                    scroll={(el) => {
                      const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }}
                  >
                    Let’s Connect <ArrowRightCircle className={styles.ctaIcon} size={25} />
                  </HashLink>
                </div>
              )}
            </TrackVisibility>
          </Col>

          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img className={styles.headerImg} src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
