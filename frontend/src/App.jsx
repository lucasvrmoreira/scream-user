import { useState } from 'react';
import Conferencia from './pages/Conferencia';
import Login from './pages/Login';
import Admin from './pages/Admin'; 

function App() {
  const [usuario, setUsuario] = useState('');
  const [tela, setTela] = useState('conferencia'); 

  const handleLogin = (nome) => {
    setUsuario(nome);
    setTela('conferencia'); 
  };

  return (
    <div>
      {!usuario ? (
        
        <Login onLogin={handleLogin} />
      ) : (
        <>
         
          {tela === 'conferencia' && (
            <>
              <Conferencia 
                usuario={usuario} 
                onLogout={() => setUsuario('')} 
              />
              
              {/* BOTÃO SECRETO DE AUDITORIA (Só aparece para DEV-01, TI-01 ou QA01) */}
              {['DEV-01', 'TI-01', 'QA01'].includes(usuario) && (
                <button 
                  onClick={() => setTela('admin')}
                  className="fixed bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl transition-all opacity-80 hover:opacity-100 z-50 flex items-center gap-2"
                >
                  <span>⚙️</span> AUDITORIA
                </button>
              )}
            </>
          )}

          {/* MOSTRA A TELA DE ADMIN */}
          {tela === 'admin' && (
            <Admin onVoltar={() => setTela('conferencia')} />
          )}
        </>
      )}
    </div>
  );
}

export default App;