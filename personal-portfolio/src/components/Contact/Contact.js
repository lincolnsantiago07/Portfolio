import { useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../../assets/img/contact-img.svg";
import "animate.css";
import TrackVisibility from "react-on-screen";
import {
  LuUser, LuMail, LuPhone, LuMessageSquare, LuSend,
  LuCircleCheck, LuCircleAlert
} from "react-icons/lu";
import styles from "./Contact.module.css";

export const Contact = () => {
  const formInitialDetails = useMemo(() => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    hp: "" // honeypot
  }), []);

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState("Send");
  const [status, setStatus] = useState({});
  const isSending = buttonText !== "Send";

  // Em produção: mesma origem ("/contact"). Em dev: localhost:5000
  const API_URL =
    process.env.REACT_APP_API_URL
    ?? (window.location.hostname.endsWith("github.io")
          ? "https://portfolio-jwuj.onrender.com"   // sua API no Render (ajuste o host se mudou)
          : "http://localhost:5000");               // dev local

  const onFormUpdate = (key, value) => {
    setFormDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({});
    setButtonText("Sending...");

    try {
      // Trim e payload enxuto
      const payload = Object.fromEntries(
        Object.entries(formDetails).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
      );

      // Timeout/abort para evitar travar UI
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8", "Accept": "application/json" },
        credentials: "omit", // não enviar cookies por engano
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(t);

      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message || "Erro ao enviar");

      setFormDetails(formInitialDetails);
      setStatus({ success: true, message: "Message sent successfully" });
    } catch (err) {
      setStatus({
        success: false,
        message: err?.name === "AbortError" ? "Tempo esgotado. Tente novamente." : (err?.message || "Something went wrong.")
      });
    } finally {
      setButtonText("Send");
    }
  };

  return (
    <section className={styles.contact} id="connect">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={`${styles.image} ${isVisible ? "animate__animated animate__zoomIn" : ""}`}
                  src={contactImg}
                  alt="Contact"
                />
              )}
            </TrackVisibility>
          </Col>

          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={`${styles.formCard} ${isVisible ? "animate__animated animate__fadeIn" : ""}`}>
                  <h2 className={styles.title}>Get In Touch</h2>

                  <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <LuUser className={styles.icon} />
                        <input
                          className={styles.control}
                          type="text"
                          value={formDetails.firstName}
                          placeholder="First Name"
                          autoComplete="given-name"
                          onChange={(e) => onFormUpdate("firstName", e.target.value)}
                          required
                          maxLength={60}
                          pattern="[A-Za-zÀ-ÿ' -]{1,60}"
                          disabled={isSending}
                        />
                      </div>

                      <div className={styles.field}>
                        <LuUser className={styles.icon} />
                        <input
                          className={styles.control}
                          type="text"
                          value={formDetails.lastName}
                          placeholder="Last Name"
                          autoComplete="family-name"
                          onChange={(e) => onFormUpdate("lastName", e.target.value)}
                          required
                          maxLength={60}
                          pattern="[A-Za-zÀ-ÿ' -]{1,60}"
                          disabled={isSending}
                        />
                      </div>
                    </div>

                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <LuMail className={styles.icon} />
                        <input
                          className={styles.control}
                          type="email"
                          value={formDetails.email}
                          placeholder="Email Address"
                          autoComplete="email"
                          onChange={(e) => onFormUpdate("email", e.target.value)}
                          required
                          maxLength={254}
                          inputMode="email"
                          disabled={isSending}
                        />
                      </div>

                      <div className={styles.field}>
                        <LuPhone className={styles.icon} />
                        <input
                          className={styles.control}
                          type="tel"
                          value={formDetails.phone}
                          placeholder="Phone No."
                          autoComplete="tel"
                          onChange={(e) => onFormUpdate("phone", e.target.value)}
                          maxLength={40}
                          inputMode="tel"
                          disabled={isSending}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <LuMessageSquare className={styles.icon} />
                      <input
                        className={styles.control}
                        type="text"
                        value={formDetails.subject}
                        placeholder="Subject"
                        onChange={(e) => onFormUpdate("subject", e.target.value)}
                        maxLength={140}
                        disabled={isSending}
                      />
                    </div>

                    <div className={styles.field}>
                      <LuMessageSquare className={styles.icon} />
                      <textarea
                        className={`${styles.control} ${styles.textarea}`}
                        rows={6}
                        value={formDetails.message}
                        placeholder="Message"
                        onChange={(e) => onFormUpdate("message", e.target.value)}
                        required
                        maxLength={4000}
                        disabled={isSending}
                      />
                    </div>

                    {/* Honeypot invisível */}
                    <input
                      type="text"
                      name="company"
                      value={formDetails.hp}
                      onChange={(e) => onFormUpdate("hp", e.target.value)}
                      style={{ position: "absolute", left: "-5000px" }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <button className={styles.button} type="submit" disabled={isSending}>
                      {isSending ? (
                        <>
                          <span className={styles.spinner} aria-hidden="true" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <LuSend className={styles.btnIcon} />
                          Send
                        </>
                      )}
                    </button>

                    {status.message && (
                      <div
                        className={`${styles.alert} ${status.success ? styles.alertSuccess : styles.alertError}`}
                        role="status"
                        aria-live="polite"
                      >
                        {status.success ? <LuCircleCheck /> : <LuCircleAlert />}
                        <span>{status.message}</span>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
