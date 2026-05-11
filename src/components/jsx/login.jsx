import { useState } from "react";
import "../styles/login.css";

function Login({ voltarHome, entrarSistema }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function fazerLogin(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Informe o e-mail e a senha.");
      return;
    }
    try {
      setCarregando(true);

      const resposta = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

      if (!resposta.ok) {
        throw new Error("E-mail ou senha inválidos.");
      }

      const dados = await resposta.json();

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados));

      entrarSistema(dados);
    } catch (error) {
      setErro(error.message || "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <button onClick={voltarHome} className="btn-voltar">
          ← Voltar
        </button>

        <div className="login-brand">
          <p>Academia Pro</p>
          <h1>Entre para gerenciar sua academia.</h1>
          <span>
            Acesse o painel para controlar alunos, aulas, planos e equipamentos.
          </span>
        </div>
      </div>

      <div className="login-right">
        <form onSubmit={fazerLogin} className="login-card">
          <div className="login-card-header">
            <p>Bem-vindo de volta</p>
            <h2>Login</h2>
          </div>

          {erro && <div className="erro-login">{erro}</div>}

          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p className="login-info">
            O login está integrado com:
            <br />
            <strong>http://localhost:8080/auth/login</strong>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;