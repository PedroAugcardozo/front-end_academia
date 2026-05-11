import { useEffect, useState } from "react";
import {
  buscarUsuarios,
  buscarEquipamentos,
  buscarAulas,
  buscarPlanos,
  buscarInstrutores
} from "../../services/api";
import "../styles/dashboard.css";

const MENUS = {
  ADMIN: [
    { id: "usuarios", titulo: "Usuários", icone: "👥" },
    { id: "equipamentos", titulo: "Equipamentos", icone: "🏋️" },
    { id: "aulas", titulo: "Aulas", icone: "📅" },
    { id: "planos", titulo: "Planos", icone: "💳" },
    { id: "instrutores", titulo: "Instrutores", icone: "🧑‍🏫" }
  ],

  ALUNO: [
    { id: "aulas", titulo: "Aulas", icone: "📅" },
    { id: "instrutores", titulo: "Instrutores", icone: "🧑‍🏫" },
    { id: "planos", titulo: "Planos", icone: "💳" }
  ],

  INSTRUTOR: [
    { id: "aulas", titulo: "Aulas", icone: "📅" },
    { id: "equipamentos", titulo: "Equipamentos", icone: "🏋️" }
  ]
};

function identificarNivel(nivelAcesso) {
  const nivel = String(nivelAcesso || "").trim().toUpperCase();

  if (nivel.includes("ADMIN")) return "ADMIN";
  if (nivel.includes("INSTRUTOR")) return "INSTRUTOR";
  if (nivel.includes("ALUNO")) return "ALUNO";

  return "DESCONHECIDO";
}

function Dashboard({ usuario, sair }) {
  const nivel = identificarNivel(
    usuario?.nivelAcesso ||
    usuario?.nivel_acesso ||
    usuario?.nivel
  );

  const menus = MENUS[nivel] || [];
  const [secaoAtiva, setSecaoAtiva] = useState("");

  useEffect(() => {
    if (menus.length > 0) {
      setSecaoAtiva(menus[0].id);
    }
  }, [nivel]);

  function renderizarConteudo() {
    if (secaoAtiva === "usuarios") {
      return <TelaUsuarios />;
    }

    if (secaoAtiva === "equipamentos") {
      return <TelaEquipamentos nivel={nivel} />;
    }

    if (secaoAtiva === "aulas") {
      return <TelaAulas nivel={nivel} />;
    }

    if (secaoAtiva === "planos") {
      return <TelaPlanos nivel={nivel} />;
    }

    if (secaoAtiva === "instrutores") {
      return <TelaInstrutores nivel={nivel} />;
    }

    return (
      <div className="empty-state">
        <h2>Nenhuma opção selecionada</h2>
        <p>Escolha uma opção no menu lateral.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="logo-mark">AP</div>

            <div>
              <h2>Academia Pro</h2>
              <p>Sistema de gestão</p>
            </div>
          </div>

          <div className="user-box">
            <span className="user-label">Usuário logado</span>
            <strong>{usuario?.nome || "Usuário"}</strong>
            <p>{nivel}</p>
          </div>

          <nav className="sidebar-menu">
            {menus.map((menu) => (
              <button
                key={menu.id}
                className={
                  secaoAtiva === menu.id
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
                onClick={() => setSecaoAtiva(menu.id)}
              >
                <span>{menu.icone}</span>
                <p>{menu.titulo}</p>
              </button>
            ))}
          </nav>
        </div>

        <button className="logout-button" onClick={sair}>
          Sair do sistema
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="page-tag">Painel principal</span>
            <h1>{tituloPainel(nivel)}</h1>
            <p>{descricaoPainel(nivel)}</p>
          </div>
        </header>

        <section className="dashboard-content">{renderizarConteudo()}</section>
      </main>
    </div>
  );
}

function TelaUsuarios() {
  const { dados: usuarios, carregando, erro } = useBuscarDados(buscarUsuarios);

  const total = usuarios.length;
  const alunos = usuarios.filter((usuario) =>
    identificarNivel(usuario.nivelAcesso || usuario.nivel_acesso).includes("ALUNO")
  ).length;

  const instrutores = usuarios.filter((usuario) =>
    identificarNivel(usuario.nivelAcesso || usuario.nivel_acesso).includes("INSTRUTOR")
  ).length;

  const admins = usuarios.filter((usuario) =>
    identificarNivel(usuario.nivelAcesso || usuario.nivel_acesso).includes("ADMIN")
  ).length;

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Usuários</h2>
          <p>Gerencie alunos, administradores e demais usuários do sistema.</p>
        </div>

        <button className="primary-action">Novo usuário</button>
      </div>

      <div className="stats-grid">
        <InfoCard titulo="Total de usuários" valor={total} texto="Cadastrados" />
        <InfoCard titulo="Alunos" valor={alunos} texto="Usuários alunos" />
        <InfoCard titulo="Instrutores" valor={instrutores} texto="Usuários instrutores" />
        <InfoCard titulo="Admins" valor={admins} texto="Administradores" />
      </div>

      <EstadoBusca
        carregando={carregando}
        erro={erro}
        vazio={!carregando && usuarios.length === 0}
        mensagemVazio="Nenhum usuário encontrado."
      />

      {!carregando && usuarios.length > 0 && (
        <div className="cards-list">
          {usuarios.map((usuario, index) => (
            <ItemCard
              key={usuario.id || index}
              titulo={usuario.nome || "Usuário sem nome"}
              subtitulo={usuario.email || "E-mail não informado"}
              texto={`Nível: ${
                usuario.nivelAcesso ||
                usuario.nivel_acesso ||
                "não informado"
              }`}
              acao="Editar"
            />
          ))}
        </div>
      )}
    </>
  );
}

function TelaEquipamentos({ nivel }) {
  const { dados: equipamentos, carregando, erro } = useBuscarDados(buscarEquipamentos);

  const total = equipamentos.length;

  const disponiveis = equipamentos.filter((equipamento) =>
    textoStatus(equipamento).includes("DISPON")
  ).length;

  const manutencao = equipamentos.filter((equipamento) =>
    textoStatus(equipamento).includes("MANUT")
  ).length;

  const descartados = equipamentos.filter((equipamento) =>
    textoStatus(equipamento).includes("DESCART")
  ).length;

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Equipamentos</h2>
          <p>
            {nivel === "ADMIN"
              ? "Gerencie os equipamentos e seus estados."
              : "Consulte equipamentos disponíveis para suas aulas."}
          </p>
        </div>

        {nivel === "ADMIN" && (
          <button className="primary-action">Novo equipamento</button>
        )}
      </div>

      <div className="stats-grid">
        <InfoCard titulo="Total" valor={total} texto="Equipamentos cadastrados" />
        <InfoCard titulo="Disponíveis" valor={disponiveis} texto="Prontos para uso" />
        <InfoCard titulo="Manutenção" valor={manutencao} texto="Indisponíveis" />
        <InfoCard titulo="Descartados" valor={descartados} texto="Fora de uso" />
      </div>

      <EstadoBusca
        carregando={carregando}
        erro={erro}
        vazio={!carregando && equipamentos.length === 0}
        mensagemVazio="Nenhum equipamento encontrado."
      />

      {!carregando && equipamentos.length > 0 && (
        <div className="cards-list">
          {equipamentos.map((equipamento, index) => (
            <ItemCard
              key={equipamento.id || index}
              titulo={equipamento.nome || "Equipamento sem nome"}
              subtitulo={`Status: ${
                equipamento.status ||
                equipamento.estado ||
                equipamento.situacao ||
                "não informado"
              }`}
              texto={
                equipamento.descricao ||
                equipamento.observacao ||
                "Equipamento cadastrado no sistema."
              }
              acao={nivel === "ADMIN" ? "Editar" : null}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TelaAulas({ nivel }) {
  const { dados: aulas, carregando, erro } = useBuscarDados(buscarAulas);

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Aulas</h2>
          <p>
            {nivel === "ALUNO" &&
              "Veja as aulas disponíveis e faça sua inscrição."}

            {nivel === "INSTRUTOR" &&
              "Crie, edite e acompanhe suas aulas cadastradas."}

            {nivel === "ADMIN" &&
              "Controle todas as aulas cadastradas na academia."}
          </p>
        </div>

        {(nivel === "ADMIN" || nivel === "INSTRUTOR") && (
          <button className="primary-action">Nova aula</button>
        )}
      </div>

      <div className="stats-grid">
        <InfoCard titulo="Total de aulas" valor={aulas.length} texto="Aulas cadastradas" />
        <InfoCard titulo="Disponíveis" valor={aulas.length} texto="Aulas listadas" />
      </div>

      <EstadoBusca
        carregando={carregando}
        erro={erro}
        vazio={!carregando && aulas.length === 0}
        mensagemVazio="Nenhuma aula encontrada."
      />

      {!carregando && aulas.length > 0 && (
        <div className="cards-list">
          {aulas.map((aula, index) => (
            <ItemCard
              key={aula.id || index}
              titulo={nomeAula(aula)}
              subtitulo={subtituloAula(aula)}
              texto={textoAula(aula)}
              acao={acaoAula(nivel)}
            />
          ))}
        </div>
      )}

      <div className="panel-box">
        <h3>Permissões nesta tela</h3>

        {nivel === "ALUNO" && (
          <div className="actions-list">
            <span>Visualizar aulas</span>
            <span>Consultar horários</span>
            <span>Inscrever-se em aulas</span>
          </div>
        )}

        {nivel === "INSTRUTOR" && (
          <div className="actions-list">
            <span>Criar aulas</span>
            <span>Editar aulas</span>
            <span>Ver alunos inscritos</span>
          </div>
        )}

        {nivel === "ADMIN" && (
          <div className="actions-list">
            <span>Criar aulas</span>
            <span>Editar aulas</span>
            <span>Excluir aulas</span>
            <span>Ver inscritos</span>
          </div>
        )}
      </div>
    </>
  );
}

function TelaPlanos({ nivel }) {
  const { dados: planos, carregando, erro } = useBuscarDados(buscarPlanos);

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Planos</h2>
          <p>
            {nivel === "ADMIN"
              ? "Gerencie os planos disponíveis para os alunos."
              : "Consulte os planos disponíveis e informações do seu plano."}
          </p>
        </div>

        {nivel === "ADMIN" && (
          <button className="primary-action">Novo plano</button>
        )}
      </div>

      <div className="stats-grid">
        <InfoCard titulo="Total de planos" valor={planos.length} texto="Planos cadastrados" />
      </div>

      <EstadoBusca
        carregando={carregando}
        erro={erro}
        vazio={!carregando && planos.length === 0}
        mensagemVazio="Nenhum plano encontrado."
      />

      {!carregando && planos.length > 0 && (
        <div className="cards-list">
          {planos.map((plano, index) => (
            <ItemCard
              key={plano.id || index}
              titulo={plano.nome || `Plano ${plano.id || ""}`}
              subtitulo={formatarMoeda(plano.valor)}
              texto={
                plano.validade
                  ? `Validade: ${plano.validade} dias`
                  : "Plano cadastrado no sistema."
              }
              acao={nivel === "ADMIN" ? "Editar" : null}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TelaInstrutores({ nivel }) {
  const { dados: instrutores, carregando, erro } = useBuscarDados(buscarInstrutores);

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Instrutores</h2>
          <p>
            {nivel === "ADMIN"
              ? "Gerencie os instrutores cadastrados."
              : "Veja os instrutores disponíveis na academia."}
          </p>
        </div>

        {nivel === "ADMIN" && (
          <button className="primary-action">Novo instrutor</button>
        )}
      </div>

      <div className="stats-grid">
        <InfoCard titulo="Total de instrutores" valor={instrutores.length} texto="Instrutores cadastrados" />
      </div>

      <EstadoBusca
        carregando={carregando}
        erro={erro}
        vazio={!carregando && instrutores.length === 0}
        mensagemVazio="Nenhum instrutor encontrado."
      />

      {!carregando && instrutores.length > 0 && (
        <div className="cards-list">
          {instrutores.map((instrutor, index) => (
            <ItemCard
              key={instrutor.id || index}
              titulo={instrutor.nome || "Instrutor sem nome"}
              subtitulo={instrutor.email || instrutor.cref || "Dados não informados"}
              texto={
                instrutor.cpf
                  ? `CPF: ${instrutor.cpf}`
                  : "Instrutor cadastrado no sistema."
              }
              acao={nivel === "ADMIN" ? "Editar" : null}
            />
          ))}
        </div>
      )}
    </>
  );
}

function useBuscarDados(funcaoBuscar) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await funcaoBuscar();

        if (componenteAtivo) {
          setDados(normalizarLista(resposta));
        }
      } catch (erro) {
        if (componenteAtivo) {
          setErro(erro.message || "Erro ao buscar dados.");
          setDados([]);
        }
      }

      if (componenteAtivo) {
        setCarregando(false);
      }
    }

    carregar();

    return () => {
      componenteAtivo = false;
    };
  }, [funcaoBuscar]);

  return { dados, carregando, erro };
}

function normalizarLista(resposta) {
  if (Array.isArray(resposta)) {
    return resposta;
  }

  if (Array.isArray(resposta?.dados)) {
    return resposta.dados;
  }

  if (Array.isArray(resposta?.content)) {
    return resposta.content;
  }

  if (Array.isArray(resposta?.lista)) {
    return resposta.lista;
  }

  if (Array.isArray(resposta?.usuarios)) {
    return resposta.usuarios;
  }

  if (Array.isArray(resposta?.equipamentos)) {
    return resposta.equipamentos;
  }

  if (Array.isArray(resposta?.aulas)) {
    return resposta.aulas;
  }

  if (Array.isArray(resposta?.planos)) {
    return resposta.planos;
  }

  if (Array.isArray(resposta?.instrutores)) {
    return resposta.instrutores;
  }

  return [];
}

function tituloPainel(nivel) {
  if (nivel === "ADMIN") return "Área administrativa";
  if (nivel === "INSTRUTOR") return "Área do instrutor";
  if (nivel === "ALUNO") return "Área do aluno";

  return "Acesso não identificado";
}

function descricaoPainel(nivel) {
  if (nivel === "ADMIN") {
    return "Controle usuários, equipamentos, aulas, planos e instrutores.";
  }

  if (nivel === "INSTRUTOR") {
    return "Gerencie suas aulas e consulte os equipamentos disponíveis.";
  }

  if (nivel === "ALUNO") {
    return "Consulte aulas, instrutores e informações do seu plano.";
  }

  return "Não foi possível identificar o nível de acesso do usuário.";
}

function acaoAula(nivel) {
  if (nivel === "ALUNO") return "Inscrever-se";
  if (nivel === "INSTRUTOR") return "Editar aula";
  if (nivel === "ADMIN") return "Gerenciar";

  return null;
}

function textoStatus(equipamento) {
  return String(
    equipamento.status ||
    equipamento.estado ||
    equipamento.situacao ||
    ""
  ).toUpperCase();
}

function nomeAula(aula) {
  return (
    aula.nome ||
    aula.titulo ||
    aula.categoriaModel?.nome ||
    aula.categoria?.nome ||
    "Aula sem nome"
  );
}

function subtituloAula(aula) {
  const instrutor =
    aula.instrutorModel?.nome ||
    aula.instrutor?.nome ||
    aula.nomeInstrutor;

  const data =
    aula.data ||
    aula.dataAula ||
    aula.data_aula;

  const horario =
    aula.horario ||
    aula.hora ||
    aula.horaInicio ||
    aula.hora_inicio;

  if (instrutor && data && horario) {
    return `${instrutor} - ${data} às ${horario}`;
  }

  if (instrutor) {
    return `Instrutor: ${instrutor}`;
  }

  if (data && horario) {
    return `${data} às ${horario}`;
  }

  return "Informações da aula não informadas";
}

function textoAula(aula) {
  if (aula.descricao) {
    return aula.descricao;
  }

  if (aula.categoriaModel?.nome) {
    return `Categoria: ${aula.categoriaModel.nome}`;
  }

  if (aula.categoria?.nome) {
    return `Categoria: ${aula.categoria.nome}`;
  }

  return "Aula cadastrada no sistema.";
}

function formatarMoeda(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "Valor não informado";
  }

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function EstadoBusca({ carregando, erro, vazio, mensagemVazio }) {
  if (carregando) {
    return (
      <div className="panel-box">
        <h3>Carregando dados...</h3>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="panel-box">
        <h3>Erro ao carregar</h3>
        <p>{erro}</p>
      </div>
    );
  }

  if (vazio) {
    return (
      <div className="panel-box">
        <h3>{mensagemVazio}</h3>
      </div>
    );
  }

  return null;
}

function InfoCard({ titulo, valor, texto }) {
  return (
    <div className="info-card">
      <p>{titulo}</p>
      <strong>{valor}</strong>
      <span>{texto}</span>
    </div>
  );
}

function ItemCard({ titulo, subtitulo, texto, acao }) {
  return (
    <div className="item-card">
      <div>
        <h3>{titulo}</h3>
        <p className="item-subtitle">{subtitulo}</p>
        <p className="item-text">{texto}</p>
      </div>

      {acao && <button className="small-action">{acao}</button>}
    </div>
  );
}

export default Dashboard;