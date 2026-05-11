const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  usuarioCriar: "/usuarios/criar/aluno",
  usuariosBuscarTodos: "/usuarios/buscarTodos",

  enderecoCriar: "/endereco/criar",

  aulasBuscarTodas: "/aulas/buscarTodas",
  aulasBuscarUma: "/aulas/buscarUma",
  aulasCriar: "/aulas/criar",

  categoriasBuscarTodas: "/categorias/buscarTodas",
  categoriasBuscarUma: "/categorias/buscarUma",
  categoriasCriar: "/categorias/criar",

  equipamentosBuscarTodos: "/equipamentos/buscarTodos",
  equipamentosBuscarUm: "/equipamentos/buscarUm",
  equipamentosCriar: "/equipamentos/criar",

  instrutorBuscarTodos: "/instrutor/buscarTodos",
  instrutorBuscarUm: "/instrutor/buscarUm",
  instrutorCriar: "/instrutor/criar",

  manutencaoBuscarTodas: "/manutencao/buscarTodas",
  manutencaoBuscarUma: "/manutencao/buscarUma",
  manutencaoCriar: "/manutencao/criar",

  planosBuscarTodos: "/planos/buscarTodos",
  planosCriar: "/planos/criar",

  login: "/login"
};

async function tratarResposta(resposta) {
  const texto = await resposta.text();

  let dados = texto;

  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch (erro) {
    dados = texto;
  }

  if (!resposta.ok) {
    if (typeof dados === "string") {
      throw new Error(dados || "Erro na requisição.");
    }

    throw new Error(dados?.message || dados?.mensagem || "Erro na requisição.");
  }

  return dados;
}

function montarHeaders(comToken) {
  const headers = {
    "Content-Type": "application/json"
  };

  const token = localStorage.getItem("token");

  if (comToken && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiGet(endpoint) {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}`);
  return tratarResposta(resposta);
}

export async function apiGetComToken(endpoint) {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: montarHeaders(true)
  });

  return tratarResposta(resposta);
}

export async function apiPost(endpoint, body) {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: montarHeaders(false),
    body: JSON.stringify(body)
  });

  return tratarResposta(resposta);
}

export async function apiPostComToken(endpoint, body) {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: montarHeaders(true),
    body: JSON.stringify(body)
  });

  return tratarResposta(resposta);
}

export async function buscarUsuarios() {
  return apiGetComToken(ENDPOINTS.usuariosBuscarTodos);
}

export async function buscarEquipamentos() {
  return apiGetComToken(ENDPOINTS.equipamentosBuscarTodos);
}

export async function buscarAulas() {
  return apiGetComToken(ENDPOINTS.aulasBuscarTodas);
}

export async function buscarPlanos() {
  return apiGetComToken(ENDPOINTS.planosBuscarTodos);
}

export async function buscarInstrutores() {
  return apiGetComToken(ENDPOINTS.instrutorBuscarTodos);
}

export async function cadastrarUsuario(usuario) {
  return apiPost(ENDPOINTS.usuarioCriar, usuario);
}

export async function criarEndereco(endereco) {
  return apiPost(ENDPOINTS.enderecoCriar, endereco);
}

export async function buscarCepViaCep(cep) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP inválido. Digite 8 números.");
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!resposta.ok) {
    throw new Error("Erro ao consultar o CEP.");
  }

  const dados = await resposta.json();

  if (dados.erro) {
    throw new Error("CEP não encontrado.");
  }

  return dados;
}