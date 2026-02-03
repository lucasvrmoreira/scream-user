import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin({ onVoltar }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    carregarLogs();
  }, []);

  const carregarLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/historico');
      setLogs(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico");
    }
  };

  // Função para decidir a cor da "etiqueta" na tabela
  const getCorStatus = (status) => {
    const s = status?.toUpperCase();
    if (s === 'LIBERADO') return 'bg-green-100 text-green-700 border border-green-200';
    if (s === 'BLOQUEADO') return 'bg-red-100 text-red-700 border border-red-200';
    if (s === 'QUARENTENA') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if (s === 'NAO_ENCONTRADO') return 'bg-slate-200 text-slate-600';
    return 'bg-blue-100 text-blue-700'; // Outros status
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            📊 Trilha de Auditoria
          </h1>
          <button 
            onClick={onVoltar}
            className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
          >
            VOLTAR
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4">Data/Hora</th>
                <th className="p-4">Operador</th>
                <th className="p-4">Lote Consultado</th>
                <th className="p-4 text-center">Status Retornado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 font-mono text-sm">{log.data}</td>
                  <td className="p-4 font-bold text-slate-700">{log.usuario}</td>
                  <td className="p-4 font-mono text-blue-600">{log.lote}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCorStatus(log.resultado)}`}>
                      {log.resultado}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                 <tr><td colSpan="4" className="p-8 text-center text-slate-400">Nenhum registro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}