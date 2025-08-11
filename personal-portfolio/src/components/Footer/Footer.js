import { Container, Row, Col } from "react-bootstrap";
import logo from "../../assets/img/logo.jpeg";
import navIcon1 from "../../assets/img/nav-icon1.svg";
import navIcon2 from "../../assets/img/nav-icon2.svg";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row className="align-items-center">

          <Col xs={12} sm={6}>
            <img className={styles.logo} src={logo} alt="Logo" />
          </Col>

          <Col xs={12} sm={6} className="text-center text-sm-end">
            <div className={styles.social}>
              <a className={styles.socialLink} href="https://www.linkedin.com/in/linkfwee">
                <img className={styles.socialImg} src={navIcon1} alt="Icon" />
              </a>
              <a className={styles.socialLink} href="https://github.com/lincolnsantiago07">
                <img className={styles.socialImg} src={navIcon2} alt="Icon" />
              </a>
            </div>
            <p className={styles.copy}>Copyright 2025. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
