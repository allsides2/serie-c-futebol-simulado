
import { useState } from 'react';
import { useFootball } from '@/context/FootballContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart4, 
  CalendarDays, 
  RefreshCw, 
  PlusCircle, 
  TrendingUp,
  Trophy 
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
            className={`flex items-center gap-2 ${view === 'standings' ? 'bg-figueira-black text-figueira-white' : 'bg-figueira-white text-figueira-black border-figueira-black'}`}
          >
            <BarChart4 className="h-4 w-4" />
            <span>Classificação</span>
          </Button>
          <Button 
            variant={view === 'matches' ? 'default' : 'outline'} 
            onClick={() => setView('matches')}
            className={`flex items-center gap-2 ${view === 'matches' ? 'bg-figueira-black text-figueira-white' : 'bg-figueira-white text-figueira-black border-figueira-black'}`}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Jogos</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => simulateRound(currentRound)}
            className="flex items-center gap-2 bg-figueira-white text-figueira-black border-figueira-black hover:bg-figueira-gray hover:text-figueira-white"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Simular Rodada {currentRound}</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={simulateAllRemainingMatches}
            className="flex items-center gap-2 bg-figueira-white text-figueira-black border-figueira-black hover:bg-figueira-gray hover:text-figueira-white"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Simular Tudo</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={resetAllResults}
            className="flex items-center gap-2 bg-figueira-white text-figueira-black border-figueira-black hover:bg-figueira-gray hover:text-figueira-white"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resetar</span>
          </Button>
          <Button 
            onClick={advanceToKnockout}
            className="bg-figueira-black text-figueira-white hover:bg-figueira-gray"
          >
            <Trophy className="h-4 w-4 mr-2" />
            <span>Avançar para Mata-Mata</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-figueira-white rounded-lg shadow-md p-4">
        {view === 'standings' && <StandingsTable />}
        {view === 'matches' && <MatchesByRound />}
      </div>
    </div>
  );
};

export default GroupStage;
