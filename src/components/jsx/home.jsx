import "../styles/home.css";

function Home({ abrirLogin, abrirCadastro }) {
  function irParaRecursos() {
    const secao = document.getElementById("recursos");
    secao?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>

        <nav className="navbar">
          <h2>Academia Pro</h2>

          <div className="nav-links">
            <button onClick={irParaRecursos}>Recursos</button>

            <button onClick={abrirCadastro}>Cadastro</button>

            <button onClick={abrirLogin} className="nav-login">
              Login
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <p className="hero-tag">Sistema de gestão para academias</p>

          <h1>
            Academia com mais força, organização e performance.
          </h1>

          <p className="hero-text">
            Gerencie alunos, instrutores, aulas, planos e equipamentos em uma
            plataforma moderna e integrada.
          </p>

          <div className="hero-buttons">
            <button onClick={abrirLogin} className="btn-primary">
              Fazer login
            </button>

            <button onClick={abrirCadastro} className="btn-secondary">
              Criar conta
            </button>

            <button onClick={irParaRecursos} className="btn-secondary">
              Ver recursos
            </button>
          </div>
        </div>
      </section>

      <section id="recursos" className="resources-section">
        <div className="section-title">
          <p>Recursos do sistema</p>
          <h2>Uma gestão mais completa para sua academia</h2>
        </div>

        <div className="resources-grid">
          <div className="resource-card">
            <div className="icon">👥</div>
            <h3>Alunos</h3>
            <p>Fácil criação de conta</p>
          </div>

          <div className="resource-card">
            <div className="icon">🏋️</div>
            <h3>Aulas</h3>
            <p>Organização de aulas, horários, categorias e instrutores.</p>
          </div>

          <div className="resource-card">
            <div className="icon">💳</div>
            <h3>Planos</h3>
            <p>Diversos planos para você e seus amigos.</p>
          </div>

          <div className="resource-card">
            <div className="icon">🛠️</div>
            <h3>Equipamentos</h3>
            <p>Equipamentos da mais alta qualidade para diversos tipos de treinos.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;