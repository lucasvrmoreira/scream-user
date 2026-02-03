import React, { useEffect, useState } from "react";

export function SalaDeEspera({ onServerAwake }) {
  const [mensagem, setMensagem] = useState("Acordando o servidor...");
  const [corMensagem, setCorMensagem] = useState("#666");

  // Pega a URL do Render configurada no .env
  const API_URL = import.meta.env.VITE_API_URL || "";
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // Se for desenvolvimento (localhost), caso queira pular a espera comente esse bloco
    if (isDev) {
      console.log("Modo Dev: Pulando espera...");
      onServerAwake(); 
      return;
    }

    const checarServidor = async () => {
      try {
        console.log("Pingando servidor...");
        // Tenta acessar a rota raiz (Health Check)
        await fetch(`${API_URL}/`); 

        setCorMensagem("green");
        setMensagem("Conectado! Iniciando sistema...");

        // Dá um tempinho para o usuário ver a mensagem verde
        setTimeout(() => {
          onServerAwake();
        }, 1500);

      } catch (error) {
        console.warn("Servidor dormindo... tentando de novo em 2s.");
        setMensagem("Servidor está acordando, aguarde...");
        // Tenta de novo a cada 2 segundos
        setTimeout(checarServidor, 2000);
      }
    };

    checarServidor();
  }, [onServerAwake, API_URL, isDev]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      {/* Animação Lottie */}
      <lottie-player
        src="/cloud.json" // Certifique-se que este arquivo está na pasta 'public'
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay
      ></lottie-player>

      <h2 className="text-2xl font-bold text-slate-700 mt-[-20px]">Conectando...</h2>
      <p className="text-sm font-medium mt-2 transition-colors duration-300" style={{ color: corMensagem }}>
        {mensagem}
      </p>
    </div>
  );
}