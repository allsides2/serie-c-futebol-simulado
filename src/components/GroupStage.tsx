
import { useState } from 'react';
import { useFootball } from '@/context/FootballContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart4, 
  CalendarDays, 
  RefreshCw, 
  PlusCircle, 
  TrendingUp 
} from 'lucide-react';
import StandingsTable from './StandingsTable';
import MatchesByRound from './MatchesByRound';

const GroupStage = () => {
  const { 
    currentRound, 
    simulateRound, 
    simulateAllRemainingMatches, 
    resetAllResults,
    advanceToKnockout 
  } = useFootball();
  
  const [view, setView] = useState<'standings' | 'matches'>('standings');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex space-x-2">
          <Button 
            variant={view === 'standings' ? 'default' : 'outline'} 
            onClick={() => setView('standings')}
            className="flex items-center gap-2"
          >
            <BarChart4 className="h-4 w-4" />
            <span>Classificação</span>
          </Button>
          <Button 
            variant={view === 'matches' ? 'default' : 'outline'} 
            onClick={() => setView('matches')}
            className="flex items-center gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Jogos</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => simulateRound(currentRound)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Simular Rodada {currentRound}</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={simulateAllRemainingMatches}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Simular Tudo</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={resetAllResults}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resetar</span>
          </Button>
          <Button 
            onClick={advanceToKnockout}
            className="bg-brasil-yellow text-black hover:bg-brasil-yellow/80"
          >
            <Trophy className="h-4 w-4 mr-2" />
            <span>Avançar para Mata-Mata</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        {view === 'standings' && <StandingsTable />}
        {view === 'matches' && <MatchesByRound />}
      </div>
    </div>
  );
};

export default GroupStage;

import { Trophy } from 'lucide-react';
