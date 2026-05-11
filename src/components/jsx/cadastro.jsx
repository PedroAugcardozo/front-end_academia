import { useEffect, useState } from "react";
import {
  buscarPlanos,
  cadastrarUsuario,
  criarEndereco,
  buscarCepViaCep
} from "../../services/api";
import "../styles/cadastro.css";

function Cadastro({ voltarHome, voltarLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNasc, setDataNasc] = useState("");

  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [numero, setNumero] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [mensagemCep, setMensagemCep] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoPlanos, setCarregandoPlanos] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    setCarregandoPlanos(true);
    setMensagem("");

    try {
      const dados = await buscarPlanos();
      setPlanos(dados || []);
    } catch (erro) {
      setMensagem(erro.message || "Erro ao buscar planos.");
    }

    setCarregandoPlanos(false);
  }

  function formatarCpf(valor) {
    let cpfFormatado = valor.replace(/\D/g, "").slice(0, 11);

    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return cpfFormatado;
  }

  function formatarCep(valor) {
    const cepFormatado = valor.replace(/\D/g, "").slice(0, 8);

    if (cepFormatado.length > 5) {
      return `${cepFormatado.slice(0, 5)}-${cepFormatado.slice(5)}`;
    }

    return cepFormatado;
  }

  function selecionarPlano(plano) {
    setPlanoSelecionado(plano);
  }

  async function consultarCep() {
    setMensagemCep("");

    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setMensagemCep("Digite um CEP válido com 8 números.");
      return;
    }

    setBuscandoCep(true);

    try {
      const dados = await buscarCepViaCep(cep);

      setCep(dados.cep || cep);
      setRua(dados.logradouro || "");
      setBairro(dados.bairro || "");
      setCidade(dados.localidade || "");
    } catch (erro) {
      setMensagemCep(erro.message || "Erro ao buscar CEP.");
      setRua("");
      setBairro("");
      setCidade("");
    }

    setBuscandoCep(false);
  }

  function limparFormulario() {
    setNome("");
    setEmail("");
    setCpf("");
    setSenha("");
    setSexo("");
    setDataNasc("");

    setPlanoSelecionado(null);

    setCep("");
    setRua("");
    setBairro("");
    setCidade("");
    setNumero("");

    setMensagemCep("");
  }

  async function cadastrar(event) {
    event.preventDefault();

    setMensagem("");

    if (!planoSelecionado) {
      setMensagem("Selecione um plano para continuar.");
      return;
    }

    setCarregando(true);

    try {
      const usuario = {
        nome: nome,
        cpf: cpf.replace(/\D/g, ""),
        email: email,
        senha: senha,
        sexo: sexo,
        dataDeNascimento: dataNasc,
        planoId: planoSelecionado.id
      };

      const usuarioCriado = await cadastrarUsuario(usuario);

      const idUsuarioCriado =
        usuarioCriado?.id ||
        usuarioCriado?.usuario?.id ||
        usuarioCriado?.usuarioModel?.id;

      if (!idUsuarioCriado) {
        throw new Error("Usuário criado, mas o ID não foi retornado.");
      }

      const endereco = {
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        numero: numero,
        usuarioModel: {
          id: idUsuarioCriado
        }
      };

      await criarEndereco(endereco);

      setMensagem("Cadastro realizado com sucesso!");
      setTimeout(() => {
        limparFormulario();
        voltarLogin();
      }, 1000);
    } catch (erro) {
      setMensagem(erro.message || "Erro ao realizar cadastro.");
    }

    setCarregando(false);
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <p>Cadastro</p>
          <h1>Crie sua conta</h1>
          <span>
            Preencha seus dados, escolha um plano e informe seu endereço.
          </span>
        </div>

        <form onSubmit={cadastrar} className="cadastro-form">
          <div className="form-group full">
            <label>Nome completo</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatarCpf(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Data de nascimento</label>
            <input
              type="date"
              value={dataNasc}
              onChange={(e) => setDataNasc(e.target.value)}
              required
            />
          </div>

          <div className="planos-title">
            <h2>Escolha seu plano</h2>
            <p>Selecione um plano para continuar o cadastro.</p>
          </div>

          <div className="planos-area">
            {carregandoPlanos && (
              <div className="planos-loading">
                Carregando planos...
              </div>
            )}

            {!carregandoPlanos && planos.length === 0 && (
              <div className="planos-loading">
                Nenhum plano encontrado.
              </div>
            )}

            {!carregandoPlanos &&
              planos.map((plano) => (
                <button
                  type="button"
                  key={plano.id}
                  className={
                    planoSelecionado?.id === plano.id
                      ? "plano-card selecionado"
                      : "plano-card"
                  }
                  onClick={() => selecionarPlano(plano)}
                >
                  <h3>{plano.nome || "Plano"}</h3>

                  {plano.valor !== undefined && (
                    <strong>
                      R$ {Number(plano.valor).toFixed(2)}
                    </strong>
                  )}

                  {plano.validade !== undefined && (
                    <span>
                      Validade: {plano.validade} dias
                    </span>
                  )}
                </button>
              ))}
          </div>

          <div className="endereco-title">
            <h2>Endereço</h2>
            <p>Digite o CEP para preencher rua, bairro e cidade.</p>
          </div>

          <div className="form-group cep-group">
            <label>CEP</label>

            <div className="cep-row">
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(formatarCep(e.target.value))}
                onBlur={consultarCep}
                required
              />

              <button
                type="button"
                className="cep-button"
                onClick={consultarCep}
                disabled={buscandoCep}
              >
                {buscandoCep ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {mensagemCep && (
              <span className="cep-message">{mensagemCep}</span>
            )}
          </div>

          <div className="form-group">
            <label>Rua</label>
            <input
              type="text"
              placeholder="Rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Bairro</label>
            <input
              type="text"
              placeholder="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Cidade</label>
            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
          </div>

          {mensagem && (
            <div className="cadastro-message">
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            className="cadastro-button"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <button
            type="button"
            className="cadastro-login"
            onClick={voltarLogin}
          >
            Já tenho uma conta
          </button>

          <button
            type="button"
            className="cadastro-login"
            onClick={voltarHome}
          >
            Voltar para a home
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;