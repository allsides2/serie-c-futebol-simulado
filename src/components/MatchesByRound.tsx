
import { useState } from 'react';
import { useFootball } from '@/context/FootballContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatchList from './MatchList';

const MatchesByRound = () => {
  const { currentRound } = useFootball();
  const [selectedRound, setSelectedRound] = useState(currentRound);
  const totalRounds = 19;
  
  const nextRound = () => {
    if (selectedRound < totalRounds) {
      setSelectedRound(selectedRound + 1);
    }
  };
  
  const prevRound = () => {
    if (selectedRound > 1) {
      setSelectedRound(selectedRound - 1);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevRound}
          disabled={selectedRound <= 1}
          className="h-10 px-3 bg-figueira-white text-figueira-black border-figueira-black hover:bg-figueira-gray hover:text-figueira-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-bold text-xl">Rodada {selectedRound}</h3>
        <Button
          variant="outline"
          onClick={nextRound}
          disabled={selectedRound >= totalRounds}
          className="h-10 px-3 bg-figueira-white text-figueira-black border-figueira-black hover:bg-figueira-gray hover:text-figueira-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <MatchList round={selectedRound} />
      
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
          <Button
            key={round}
            variant={round === selectedRound ? 'default' : 'outline'}
            className={`h-10 w-10 p-0 ${
              round === selectedRound 
                ? 'bg-figueira-black text-figueira-white' 
                : 'bg-figueira-white text-figueira-black border-figueira-black'
            } ${round === currentRound && round !== selectedRound ? 'border-figueira-gray border-2' : ''}`}
            onClick={() => setSelectedRound(round)}
          >
            {round}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MatchesByRound;
