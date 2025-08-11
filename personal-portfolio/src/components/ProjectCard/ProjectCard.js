import { Col } from "react-bootstrap";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ title, description, imgUrl, repoUrl }) => {
  return (
    <Col xs={12} sm={6} md={4}>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardLink}
        aria-label={`Open ${title} repository on GitHub`}
      >
        <div className={styles.card}>
          <img className={styles.image} src={imgUrl} alt={title} />
          <div className={styles.text}>
            <h4 className={styles.title}>{title}</h4>
            <span className={styles.subtitle}>{description}</span>
          </div>
        </div>
      </a>
    </Col>
  );
};
