import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import "animate.css";
import TrackVisibility from "react-on-screen";
import Fuse from "fuse.js";
import { LuSearch, LuX, LuTag, LuCode, LuServer, LuLayers, LuShield, LuFlaskConical, LuSparkles } from "react-icons/lu";
import styles from "./Projects.module.css";
import colorSharp2 from "../../assets/img/color-sharp2.png";

/** Project images import */

import pokemon from "../../assets/img/pokemon.png";
import naruto from "../../assets/img/naruto.png";
import food from "../../assets/img/food.png";
import premier from "../../assets/img/premier.png";
import people from "../../assets/img/people.png";

/** >>> 1) DADOS E OPTIONS FORA DO COMPONENTE (referência estável) */
const PROJECTS = [

  { //#1
    title: "PokeCards", 
    description: "Fullstack app & Datascraping", 
    imgUrl: pokemon, 
    category: "Fullstack", 
    tags: ["spring boot", "api", "rest", "java", "postgresql", "crud", "data scraping", "pokemon", "full stack", "vite"], 
    repoUrl: "https://github.com/lincolnsantiago07/PokeCards" 
  },
  { //#2
    title: "Naruto CRUD", 
    description: "CRUD & API Rest", 
    imgUrl: naruto, 
    category: "Back-end", 
    tags: ["spring boot", "api", "rest", "java", "postgresql", "crud", "naruto"], 
    repoUrl: "https://github.com/lincolnsantiago07/CadastroDeNinjas"  
  },
  { //#3
    title: "Food CRUD", 
    description: "CRUD & API Rest", 
    imgUrl: food, 
    category: "Back-end", 
    tags: ["spring boot", "api", "rest", "java", "postgresql", "crud", "food", "mvc"], 
    repoUrl: "https://github.com/lincolnsantiago07/Cadastro-comida-spring-boot"  
  },
  { //#5
    title: "People CRUD", 
    description: "CRUD & API Rest", 
    imgUrl: people, 
    category: "Back-end", 
    tags: ["spring boot", "api", "rest", "java", "postgresql", "crud", "people"], 
    repoUrl: "https://github.com/lincolnsantiago07/cadastro-usuario-spring-boot" 
  },
  { //#6
    title: "Premier League", 
    description: "Fullstack app & Datascraping", 
    imgUrl: premier, 
    category: "Fullstack", 
    tags: ["spring boot", "api", "rest", "java", "postgresql", "crud", "data scraping", "premier", "full stack"],
    repoUrl: "https://github.com/lincolnsantiago07/Premier-League-Website" 
  },
];

const CATEGORIES = ["All", "Front-end", "Back-end", "Fullstack", "Cybersecurity", "Studies"];
const CAT_ICON = { "All": LuSparkles, "Front-end": LuCode, "Back-end": LuServer, "Fullstack": LuLayers, "Cybersecurity": LuShield, "Studies": LuFlaskConical };

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.55 },
    { name: "category", weight: 0.2 },
    { name: "description", weight: 0.15 },
    { name: "tags", weight: 0.1 },
  ]
};

export const Projects = () => {
  // ---------- state ----------
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [activeSug, setActiveSug] = useState(-1);
  const inputRef = useRef(null);

  /** >>> 2) FUSE ESTÁVEL (uma vez só) */
  const fuse = useMemo(() => new Fuse(PROJECTS, FUSE_OPTIONS), []);
  const catFuse = useMemo(
    () => new Fuse(CATEGORIES.filter(c => c !== "All"), { threshold: 0.32, ignoreLocation: true }),
    []
  );

  /** >>> 3) Funções memorizadas */
  const matchCategoryByText = useCallback((text) => {
    const hit = catFuse.search(text)[0];
    return hit?.item ?? null;
  }, [catFuse]);

  // ---------- sugestões ----------
  useEffect(() => {
    if (!term.trim()) {
      setSuggestions([]);
      setActiveSug(-1);
      return;
    }
    const projSugs = fuse.search(term).slice(0, 6).map(r => ({
      type: "project",
      label: r.item.title,
      payload: r.item.title,
    }));
    const cat = matchCategoryByText(term);
    const catSug = cat ? [{ type: "category", label: `Category: ${cat}`, payload: cat }] : [];
    setSuggestions([...catSug, ...projSugs]);
    setActiveSug(-1);
  }, [term, fuse, matchCategoryByText]); // fuse é estável agora

  // ---------- lista filtrada ----------
  const filtered = useMemo(() => {
    const byText = term.trim()
      ? fuse.search(term).map(r => r.item)
      : PROJECTS;

    const byCat = selectedCategory === "All"
      ? byText
      : byText.filter(p => p.category === selectedCategory);

    if (term.trim() && byCat.length === 0) {
      const cat = matchCategoryByText(term);
      if (cat) return PROJECTS.filter(p => p.category === cat);
    }
    return byCat;
  }, [term, selectedCategory, fuse, matchCategoryByText]);

  // ---------- handlers ----------
  const handleSelectSuggestion = (sug) => {
    if (sug.type === "category") setSelectedCategory(sug.payload);
    else setTerm(sug.payload);
    setShowSug(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = matchCategoryByText(term);
    if (cat) setSelectedCategory(cat);
    setShowSug(false);
  };

  const clearAll = () => {
    setTerm("");
    setSelectedCategory("All");
    setSuggestions([]);
    setActiveSug(-1);
    inputRef.current?.focus();
  };

  // atalhos: "/" foca, "Esc" fecha sugestões
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setShowSug(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onInputKeyDown = (e) => {
    if (!showSug || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSug(i => Math.min(i + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSug(i => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && activeSug >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSug]);
    }
  };

  return (
    <section className={styles.section} id="projects">
      <Container>
        <Row>
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 className={styles.title}>Projects</h2>
                  <p className={styles.description}>
                    Explore my work by category or use the search function :)
                  </p>

                  {/* 🔎 Busca + chips */}
                  <div className={styles.searchBarWrap}>
                    <Form onSubmit={handleSubmit} className={styles.searchForm} autoComplete="off">
                      <InputGroup className={styles.searchGroup}>
                        <InputGroup.Text className={styles.searchIcon} aria-label="search">
                          <LuSearch />
                        </InputGroup.Text>
                        <Form.Control
                          ref={inputRef}
                          value={term}
                          onChange={(e) => { setTerm(e.target.value); setShowSug(true); }}
                          onFocus={() => term && setShowSug(true)}
                          onKeyDown={onInputKeyDown}
                          placeholder="Search by name, tag, or category"
                          className={styles.searchInput}
                        />
                        {!term && <span className={styles.kbdHint}><kbd>/</kbd></span>}
                        {(term || selectedCategory !== "All") && (
                          <button type="button" className={styles.clearBtn} onClick={clearAll} aria-label="Limpar filtros">
                            <LuX />
                          </button>
                        )}
                      </InputGroup>

                      {showSug && suggestions.length > 0 && (
                        <div className={styles.suggestions}>
                          {suggestions.map((s, i) => {
                            const Left = s.type === "category" ? LuTag : LuSearch;
                            return (
                              <button
                                type="button"
                                key={`${s.type}-${s.payload}-${i}`}
                                className={`${styles.suggestionItem} ${i === activeSug ? styles.suggestionActive : ""}`}
                                onMouseEnter={() => setActiveSug(i)}
                                onClick={() => handleSelectSuggestion(s)}
                              >
                                <Left className={styles.suggestionIcon} />
                                <span>{s.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </Form>

                    <div className={styles.categoryChips}>
                      {CATEGORIES.map((c) => {
                        const Icon = CAT_ICON[c];
                        return (
                          <button
                            key={c}
                            onClick={() => setSelectedCategory(c)}
                            className={`${styles.chip} ${selectedCategory === c ? styles.chipActive : ""}`}
                          >
                            <Icon className={styles.chipIcon} />
                            {c}
                          </button>
                        );
                      })}
                    </div>

                    <div className={styles.resultBar}>
                      <span className={styles.resultCount}>
                        {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                      </span>
                      {(term || selectedCategory !== "All") && (
                        <button className={styles.resetInline} onClick={clearAll}>
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid de projetos */}
                  <div className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Row className={styles.gridRow}>
                      {filtered.map((project, index) => (
                        <ProjectCard key={index} {...project} />
                      ))}
                      {filtered.length === 0 && (
                        <p className={styles.emptyState}>Nothing found. Try another term or category.</p>
                      )}
                    </Row>
                  </div>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>

      <img className={styles.bgRight} src={colorSharp2} alt="" />
    </section>
  );
};
