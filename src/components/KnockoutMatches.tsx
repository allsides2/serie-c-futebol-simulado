
import { useState } from 'react';
import { useFootball } from '@/context/FootballContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KnockoutMatch } from '@/types/football';

const KnockoutMatches = () => {
  const { knockoutMatches, teams, updateKnockoutMatchResult, getTeamById } = useFootball();
  const [activeStage, setActiveStage] = useState<'QUARTER' | 'SEMI' | 'FINAL'>('QUARTER');
  
  // Filtra as partidas pelo estágio selecionado
  const stageMatches = knockoutMatches.filter(match => match.stage === activeStage);
  
  // Organiza as partidas por número de confronto e número da partida (ida/volta)
  const organizedMatches: { [key: string]: KnockoutMatch[] } = {};
  
  stageMatches.forEach(match => {
    const key = `match-${match.matchNumber}`;
    if (!organizedMatches[key]) {
      organizedMatches[key] = [];
    }
    organizedMatches[key].push(match);
  });
  
  const getTeamName = (teamId: number | null) => {
    if (teamId === null) return '—';
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Time Desconhecido';
  };
  
  const getTeamShortName = (teamId: number | null) => {
    if (teamId === null) return '—';
    const team = teams.find(team => team.id === teamId);
    return team ? team.shortName : '???';
  };
  
  const handleScoreChange = (match: KnockoutMatch, isHome: boolean, value: string) => {
    const goals = value === '' ? null : parseInt(value);
    
    if (goals !== null && (isNaN(goals) || goals < 0 || goals > 99)) {
      return; // Ignora valores inválidos
    }
    
    if (isHome) {
      updateKnockoutMatchResult(match.id, goals ?? 0, match.awayGoals ?? 0);
    } else {
      updateKnockoutMatchResult(match.id, match.homeGoals ?? 0, goals ?? 0);
    }
  };
  
  const stageTitle = {
    'QUARTER': 'Quartas de Final',
    'SEMI': 'Semifinais',
    'FINAL': 'Final'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Button 
          variant={activeStage === 'QUARTER' ? 'default' : 'outline'} 
          onClick={() => setActiveStage('QUARTER')}
        >
          Quartas de Final
        </Button>
        <Button 
          variant={activeStage === 'SEMI' ? 'default' : 'outline'} 
          onClick={() => setActiveStage('SEMI')}
        >
          Semifinais
        </Button>
        <Button 
          variant={activeStage === 'FINAL' ? 'default' : 'outline'} 
          onClick={() => setActiveStage('FINAL')}
        >
          Final
        </Button>
      </div>
      
      <h3 className="font-bold text-xl">{stageTitle[activeStage]}</h3>
      
      {Object.entries(organizedMatches).map(([key, matches]) => {
        // Ordena para garantir que o jogo de ida vem antes
        matches.sort((a, b) => a.legNumber - b.legNumber);
        
        // Extrai os times apenas uma vez
        const homeTeam = getTeamById(matches[0]?.homeTeamId ?? null);
        const awayTeam = getTeamById(matches[0]?.awayTeamId ?? null);
        
        // Calcula o agregado se ambos os jogos foram jogados
        let homeAgg = 0;
        let awayAgg = 0;
        
        if (matches.length === 2 && matches[0].played && matches[1].played &&
            matches[0].homeGoals !== null && matches[0].awayGoals !== null &&
            matches[1].homeGoals !== null && matches[1].awayGoals !== null) {
          homeAgg = matches[0].homeGoals + matches[1].awayGoals;
          awayAgg = matches[0].awayGoals + matches[1].homeGoals;
        }
        
        return (
          <div key={key} className="space-y-4 mb-6">
            <div className="border-b pb-2">
              <h4 className="font-medium">
                {homeTeam?.name ?? '—'} vs {awayTeam?.name ?? '—'}
                {(matches[0].played && matches[1].played) && 
                  <span className="ml-2 text-sm text-gray-500">
                    (Agregado: {homeAgg} × {awayAgg})
                  </span>
                }
              </h4>
            </div>
            
            {matches.map(match => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-100 p-2 text-sm font-medium">
                    Jogo {match.legNumber === 1 ? 'de IDA' : 'de VOLTA'}
                  </div>
                  <div className="flex items-center p-4">
                    <div className="w-1/3 text-right pr-2">
                      <p className="font-semibold">{getTeamName(match.homeTeamId)}</p>
                    </div>
                    
                    <div className="w-1/3 flex justify-center items-center space-x-3">
                      <div className="w-12 h-10 flex justify-center items-center">
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={match.homeGoals === null ? '' : match.homeGoals}
                          onChange={(e) => handleScoreChange(match, true, e.target.value)}
                          className="w-12 h-10 text-center font-bold text-lg"
                          disabled={match.homeTeamId === null || match.awayTeamId === null}
                        />
                      </div>
                      <span className="text-gray-500 font-bold">x</span>
                      <div className="w-12 h-10 flex justify-center items-center">
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={match.awayGoals === null ? '' : match.awayGoals}
                          onChange={(e) => handleScoreChange(match, false, e.target.value)}
                          className="w-12 h-10 text-center font-bold text-lg"
                          disabled={match.homeTeamId === null || match.awayTeamId === null}
                        />
                      </div>
                    </div>
                    
                    <div className="w-1/3 pl-2">
                      <p className="font-semibold">{getTeamName(match.awayTeamId)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-100 p-2 text-sm text-gray-600">
                    <span>{getTeamShortName(match.homeTeamId)}</span>
                    <span>
                      {match.played ? 'Resultado Final' : 'Aguardando Resultado'}
                    </span>
                    <span>{getTeamShortName(match.awayTeamId)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default KnockoutMatches;
