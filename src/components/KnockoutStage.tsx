
import { useState } from 'react';
import { useFootball } from '@/context/FootballContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import KnockoutBracket from './KnockoutBracket';
import KnockoutMatches from './KnockoutMatches';

const KnockoutStage = () => {
  const { resetAllResults } = useFootball();
  const [view, setView] = useState<'bracket' | 'matches'>('bracket');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex space-x-2">
          <Button 
            variant={view === 'bracket' ? 'default' : 'outline'} 
            onClick={() => setView('bracket')}
          >
            Chaveamento
          </Button>
          <Button 
            variant={view === 'matches' ? 'default' : 'outline'} 
            onClick={() => setView('matches')}
          >
            Jogos
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={resetAllResults}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resetar Campeonato</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        {view === 'bracket' && <KnockoutBracket />}
        {view === 'matches' && <KnockoutMatches />}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-brasil-yellow h-5 w-5" />
          <p className="font-semibold">Os 4 semifinalistas garantem acesso à Série B 2026!</p>
        </div>
      </div>
    </div>
  );
};

export default KnockoutStage;
