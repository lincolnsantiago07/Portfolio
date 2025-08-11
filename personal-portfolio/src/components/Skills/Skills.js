import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../../assets/img/color-sharp.png";
import styles from "./Skills.module.css";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useId } from "react"; // para ids únicos de gradient

// Componente do gauge em SVG (substitui as imagens)
const Gauge = ({ percent = 95, size = 170, stroke = 16, label = "" }) => {
  const gradientId = useId();
  const r = (size - stroke) / 2;              // raio
  const c = 2 * Math.PI * r;                  // circunferência
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c - (clamped / 100) * c;     // strokeDashoffset
  const center = size / 2;

  return (
    <div className={styles.gaugeWrap}>
      <svg
        width={size}
        height={size}
        className={styles.gauge}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* gradiente igual ao dos SVGs originais */}
          <linearGradient id={`grad-${gradientId}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%"  stopColor="#AA367C" />
            <stop offset="100%" stopColor="#4A2FBD" />
          </linearGradient>
        </defs>

        {/* trilho de fundo */}
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />

        {/* anel de progresso */}
        <circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={`url(#grad-${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          // começa no topo
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* texto central */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.percent}
        >
          {clamped}%
        </text>
      </svg>

      {label && <h5 className={styles.itemLabel}>{label}</h5>}
    </div>
  );
};

export const Skills = () => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop:           { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet:            { breakpoint: { max: 1024, min: 464 },  items: 2 },
    mobile:            { breakpoint: { max: 464,  min: 0 },    items: 1 },
  };

  // Botão customizado
  const Arrow = ({ onClick, dir = "left" }) => (
    <button
      aria-label={dir === "left" ? "Anterior" : "Próximo"}
      className={`${styles.navBtn} ${dir === "left" ? styles.left : styles.right}`}
      onClick={onClick}
      type="button"
    >
      {dir === "left" ? <LuChevronLeft /> : <LuChevronRight />}
    </button>
  );

  const items = [
    { label: "Web Development", percent: 85 },
    { label: "Software Developer",  percent: 60 },
    { label: "Data Analyst",  percent: 90 },
    { label: "Data Automation",  percent: 85 },
    { label: "DevOps",     percent: 50 },
    { label: "Cybersecurity",   percent: 15 },
  ];

  return (
    <section className={styles.section} id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={styles.box}>
              <h2 className={styles.title}>Skills</h2>
              <p className={styles.description}>
                I am constantly improving my programming skills.<br />
                You can see some of them here :)
              </p>

              <div className={styles.slider}>
                <Carousel
                  responsive={responsive}
                  infinite
                  customLeftArrow={<Arrow dir="left" />}
                  customRightArrow={<Arrow dir="right" />}
                  autoPlay
                  autoPlaySpeed={2500}
                  customTransition="transform 700ms ease-in-out"
                  transitionDuration={700}
                  pauseOnHover
                  draggable
                  swipeable
                >
                  {items.map((it, i) => (
                    <div className={styles.item} key={i}>
                      <Gauge percent={it.percent} label={it.label} />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>

      <img className={styles.bgLeft} src={colorSharp} alt="" />
    </section>
  );
};
