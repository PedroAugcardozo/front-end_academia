import { useEffect, useState } from "react";
import Home from "./components/jsx/home";
import Login from "./components/jsx/login";
import Dashboard from "./components/jsx/dashboard";
import Cadastro from "./components/jsx/cadastro";

import "./App.css";

function App() {
  const [tela, setTela] = useState("home");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      const dados = JSON.parse(usuarioSalvo);
      setUsuario(dados);
      setTela("dashboard");
    }
  }, []);

  function abrirLogin() {
    setTela("login");
  }

  function abrirCadastro() {
    alert("clicou em cadastro");
    setTela("cadastro");
  }

  function voltarHome() {
    setTela("home");
  }

  function entrarSistema(dadosUsuario) {
    setUsuario(dadosUsuario);
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    localStorage.setItem("token", dadosUsuario.token);
    setTela("dashboard");
  }

  function sair() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setTela("home");
  }

  if (tela === "login") {
    return (
      <Login
        voltarHome={voltarHome}
        entrarSistema={entrarSistema}
        abrirCadastro={abrirCadastro}
      />
    );
  }

  if (tela === "cadastro") {
    return (
      <Cadastro
        voltarHome={voltarHome}
        voltarLogin={abrirLogin}
      />
    );
  }

  if (tela === "dashboard" && usuario) {
    return <Dashboard usuario={usuario} sair={sair} />;
  }

  return (
    <Home
      abrirLogin={abrirLogin}
      abrirCadastro={abrirCadastro}
    />
  );
}

export default App;