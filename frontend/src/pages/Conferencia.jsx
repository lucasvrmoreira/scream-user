import { useState, useRef, useEffect } from "react";
import axios from "axios";


export default function Conferencia({ usuario, onLogout }) {
  const [loteInput, setLoteInput] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    focarInput();
  }, []);

  const focarInput = () => {
    inputRef.current?.focus();
  };

  const limparTela = () => {
    setLoteInput("");
    setDados(null);
    setErro("");
    focarInput();
  };

  const realizarBusca = async () => {
    if (!loteInput) return;

    setLoading(true);
    setErro("");
    setDados(null);

    try {
      
      const response = await axios.get(
       
        `http://localhost:5000/api/consultar/${encodeURIComponent(loteInput)}`,
        {
          params: { usuario: usuario },
        },
      );
      setDados(response.data);
      setLoteInput(""); 
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErro("ACESSO NEGADO: Usuário Inválido!");
      } else if (error.response && error.response.status === 404) {
        setErro("LOTE NÃO ENCONTRADO");
      } else {
        setErro("ERRO AO CONECTAR COM O SERVIDOR");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      realizarBusca();
    }
  };

  const isLiberado = (status) => {
    return status?.toUpperCase() === "LIBERADO";
  };

  const getCor = (status) => {
    if (isLiberado(status))
      return "bg-green-100 border-green-500 text-green-900";
    const s = status?.toUpperCase();
    if (s === "QUARENTENA")
      return "bg-yellow-100 border-yellow-500 text-yellow-900";
    return "bg-red-100 border-red-500 text-red-900";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4 relative">
      {/*BOTÃO DE SAIR NO CANTO */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md border border-slate-200">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Operador
          </span>
          <span className="text-blue-900 font-bold">{usuario}</span>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors"
          title="Sair"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0113.5 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-slate-700 mb-8 drop-shadow-sm">
        Conferência de Status dos Materiais
      </h1>

      <div className="flex w-full max-w-lg gap-2 mb-8">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM12 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-1.5 4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm6.339 3.811a7.5 7.5 0 01-10.678 0 7.5 7.5 0 010-10.678.75.75 0 000-1.5 9 9 0 000 13.5zM18.5 18.5l3 3"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <input
            id="input-lote"
            ref={inputRef}
            value={loteInput}
            onChange={(e) => setLoteInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Bipe ou digite..."
            className="w-full p-5 pl-12 pr-12 text-xl text-left text-slate-700 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 placeholder:text-slate-400 outline-none"
            autoFocus
          />

          {(loteInput || dados || erro) && (
            <button
              onClick={limparTela}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              title="Limpar Tela"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={realizarBusca}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <span className="animate-spin">⌛</span>
          ) : (
            <span>BUSCAR</span>
          )}
        </button>
      </div>

      {loading && (
        <div className="text-blue-600 font-bold text-xl animate-pulse mb-8">
          Processando...
        </div>
      )}

      {erro && (
        <div className="bg-red-500/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-xl text-2xl font-bold animate-bounce mb-8 border-2 border-red-700">
          ❌ {erro}
        </div>
      )}

      {dados && !loading && (
        <div
          className={`w-full max-w-2xl p-8 border-l-8 rounded-3xl shadow-2xl transition-all duration-500 ${getCor(dados.status)}`}
        >
          <div className="flex justify-between items-center border-b border-black/10 pb-4 mb-4">
            <div>
              <p className="text-sm font-bold uppercase opacity-70 tracking-wider">
                Status Atual
              </p>
              <h2 className="text-5xl font-black drop-shadow-sm">
                {dados.status}
              </h2>
            </div>

            <div className="text-7xl filter drop-shadow-md transition-transform hover:scale-110 duration-300">
              {isLiberado(dados.status) ? "✅" : "⛔"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/60 p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">
                Código do Item
              </p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {dados.codigo}
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">
                Lote
              </p>
              <p className="text-2xl font-mono font-bold text-slate-800">
                {dados.lote}
              </p>
            </div>

            <div className="col-span-2 bg-white/60 p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">
                Descrição do Produto
              </p>
              <p className="text-2xl font-medium text-slate-800 leading-tight">
                {dados.descricao}
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">
                Validade
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {dados.validade}
              </p>
            </div>

            {!isLiberado(dados.status) && (
              <div className="mt-6 pt-4 border-t border-black/10 flex flex-col items-center animate-pulse">
                <div className="flex items-center gap-2 text-red-900 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-extrabold uppercase tracking-widest">
                    Ação Necessária
                  </span>
                </div>

                <p className="text-center font-bold text-lg text-red-900">
                  MATERIAL BLOQUEADO
                  <br />
                  <span className="font-normal text-base text-red-800">
                    Entre imediatamente em contato com a{" "}
                    <strong className="underline">Garantia da Qualidade</strong>
                    .
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
