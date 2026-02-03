import { useState } from 'react';
import Conferencia from './pages/Conferencia';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { SalaDeEspera } from './components/SalaDeEspera'; // <--- Importe a Sala

function App() {
  const [usuario, setUsuario] = useState('');
  const [tela, setTela] = useState('conferencia');
  
  // ESTADO NOVO: O servidor já acordou?
  // Se for Dev, já começa true. Se for Produção, começa false.
  const [serverPronto, setServerPronto] = useState(import.meta.env.DEV);

  const handleLogin = (nome) => {
    setUsuario(nome);
    setTela('conferencia');
  };

  // 1. Se o servidor AINDA NÃO está pronto, mostra a Sala de Espera
  if (!serverPronto) {
    return <SalaDeEspera onServerAwake={() => setServerPronto(true)} />;
  }

  // 2. Se o servidor acordou, mostra o fluxo normal (Login -> App)
  return (
    <div>
      {!usuario ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {tela === 'conferencia' && (
            <>
              <Conferencia usuario={usuario} onLogout={() => setUsuario('')} />
              
              {/* Botão Admin */}
              {['DEV-01', 'TI-01', 'QA01'].includes(usuario) && (
                 <button 
                   onClick={() => setTela('admin')}
                   className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full font-bold shadow-lg z-50 opacity-80 hover:opacity-100"
                 >
                   ⚙️ ADMIN
                 </button>
              )}
            </>
          )}

          {tela === 'admin' && (
            <Admin onVoltar={() => setTela('conferencia')} />
          )}
        </>
      )}
    </div>
  );
}

export default App;