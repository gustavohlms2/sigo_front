const REPOSITORIO = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-gestao.herokuapp.com/api/repositorio/" : "http://localhost:5050/api/repositorio/" );
const NORMA = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-gestao.herokuapp.com/api/norma/"  : "http://localhost:5050/api/norma/" );
const ASSESSOR = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-acessoria.herokuapp.com/api/acessor/" : "http://localhost:5050/api/acessor/" );
const CONTRATO = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-acessoria.herokuapp.com/api/contrato/" : "http://localhost:5050/api/contrato/" );
const OPERADOR = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-processo.herokuapp.com/api/operador/" : "http://localhost:5050/api/operador/" );
const PROCESSO = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-processo.herokuapp.com/api/processo/" : "http://localhost:5050/api/processo/" );
const TIPO_PROCESSO = ( process.env.NODE_ENV === 'production' ? "https://sigo-back-processo.herokuapp.com/api/tipo_processo/" : "http://localhost:5050/api/tipo_processo/" );

const urlAPI = {
  REPOSITORIO: REPOSITORIO,
  NORMA: NORMA,
  ASSESSOR: ASSESSOR,
  CONTRATO: CONTRATO,
  OPERADOR: OPERADOR,
  PROCESSO: PROCESSO,
  TIPO_PROCESSO: TIPO_PROCESSO,
}

export default urlAPI;