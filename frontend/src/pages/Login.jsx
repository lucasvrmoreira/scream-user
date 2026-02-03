import { useState } from 'react';
import axios from 'axios'; // <--- Importante: Agora usamos axios aqui também

export default function Login({ onLogin }) {
  const [input, setInput] = useState('');
  const [erro, setErro] = useState('');     // Para mostrar mensagem de erro
  const [loading, setLoading] = useState(false); // Para mostrar "Carregando..."

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setErro(''); // Limpa erros antigos

    try {
      // 1. Pergunta pro Python se o usuário existe
      const response = await axios.get('http://localhost:5000/api/login', {
        params: { usuario: input }
      });

      // 2. Se deu certo (Status 200), avisa o App.jsx para liberar
      // Podemos até pegar o nome oficial que veio do banco!
      onLogin(input.toUpperCase()); 

    } catch (error) {
      // 3. Se deu erro, mostra na tela e NÃO deixa entrar
      if (error.response && error.response.status === 404) {
        setErro("❌ Usuário não encontrado!");
      } else if (error.response && error.response.status === 403) {
        setErro("⛔ Acesso Negado: Usuário Inativo!");
      } else {
        setErro("⚠️ Erro de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border-4 border-blue-500/30">
        
        <div className="mb-6 flex justify-center text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Controle de Acesso</h1>
        <p className="text-slate-500 mb-8 font-medium">Identifique-se</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Digite sua matrícula"
            className={`w-full p-4 border-2 rounded-xl mb-4 text-center text-xl uppercase font-bold text-slate-700 outline-none transition-all ${
              erro ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setErro(''); // Limpa o erro quando a pessoa começa a digitar de novo
            }}
            autoFocus
            disabled={loading}
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
               <>
                 <span className="animate-spin text-white">⌛</span>
                 <span>Verificando...</span>
               </>
            ) : (
               "ACESSAR SISTEMA"
            )}
          </button>
        </form>

        {/* Mensagem de Erro Vermelha */}
        {erro && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg font-bold border border-red-200 animate-pulse">
            {erro}
          </div>
        )}

      </div>
    </div>
  );
}