import { useEffect, useCallback, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/lib/sound';

// Helper for creating confetti
const createConfetti = () => {
  const colors = ['#FF7F00', '#4CAF50', '#7030A0', '#F44336', '#2196F3'];
  const confettiCount = 50;
  const container = document.getElementById('celebration-container');
  
  if (!container) return;
  
  // Clear any existing confetti
  const existingConfetti = container.querySelectorAll('.confetti');
  existingConfetti.forEach(c => c.remove());
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(confetti);
  }
  
  // Remove confetti after animation completes
  setTimeout(() => {
    document.querySelectorAll('.confetti').forEach(c => c.remove());
  }, 6000);
};

// Função para formatar o tempo em formato legível
const formatTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Formatação para mostrar sempre dois dígitos de segundos
  if (hours > 0) {
    // Formato hh:mm:ss
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    // Formato mm:ss
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

export default function Celebration() {
  const [location, setLocation] = useLocation();
  const { user, addReward } = useAppContext();
  
  // Extrair o parâmetro de tempo da URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const elapsedTime = searchParams.get('time') || '0';
  
  // Defina os valores de recompensa
  const xpEarned = 30;
  const coinsEarned = 15;
  
  useEffect(() => {
    // Create confetti effect
    createConfetti();
    
    // Tocar som de celebração
    playSound('celebration');
    
    // Atualizar os pontos e moedas do usuário com a função addReward
    addReward(xpEarned, coinsEarned);
  }, [addReward]);
  
  const handleContinue = useCallback(() => {
    setLocation('/');
  }, [setLocation]);
  
  return (
    <div id="celebration-container" className="flex flex-col min-h-screen bg-[#FF7F00] bg-opacity-10 relative">
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-8xl my-6 celebrate-animation">
          🎉
        </div>
        <h2 className="font-poppins font-bold text-2xl mb-4">Parabéns!</h2>
        <p className="text-lg mb-8">Você completou sua sessão de hoje</p>
        
        <div className="card w-full max-w-xs mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="material-icons text-xl text-yellow-500">emoji_events</span>
              <span className="ml-2 font-semibold">XP ganho</span>
            </div>
            <span className="font-bold text-xl">+30</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="material-icons text-xl text-yellow-500">monetization_on</span>
              <span className="ml-2 font-semibold">Moedas ganhas</span>
            </div>
            <span className="font-bold text-xl">+15</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="material-icons text-xl text-yellow-500">local_fire_department</span>
              <span className="ml-2 font-semibold">Streak diário</span>
            </div>
            <span className="font-bold text-xl">{user.streak} dias</span>
          </div>
          
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center">
              <span className="material-icons text-xl text-blue-500">timer</span>
              <span className="ml-2 font-semibold">Tempo total</span>
            </div>
            <span className="font-bold text-xl">{formatTime(parseInt(elapsedTime))}</span>
          </div>
        </div>
        
        <button className="btn-primary w-full max-w-xs py-4 text-lg font-poppins" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}
