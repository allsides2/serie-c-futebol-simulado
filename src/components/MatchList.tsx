
import React from 'react';
import { useFootball } from '@/context/FootballContext';
import { Match } from '@/types/football';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MatchListProps {
  round: number;
}

const MatchList: React.FC<MatchListProps> = ({ round }) => {
  const { groupMatches, teams, updateMatchResult } = useFootball();
  
  const roundMatches = groupMatches.filter(match => match.round === round);
  
  const getTeamName = (teamId: number) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Time Desconhecido';
  };
  
  const getTeamShortName = (teamId: number) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.shortName : '???';
  };
  
  const handleScoreChange = (match: Match, isHome: boolean, value: string) => {
    const goals = value === '' ? null : parseInt(value);
    
    if (goals !== null && (isNaN(goals) || goals < 0 || goals > 99)) {
      return; // Ignora valores inválidos
    }
    
    if (isHome) {
      updateMatchResult(match.id, goals ?? 0, match.awayGoals ?? 0);
    } else {
      updateMatchResult(match.id, match.homeGoals ?? 0, goals ?? 0);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roundMatches.map(match => (
        <Card key={match.id} className="overflow-hidden">
          <CardContent className="p-0">
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
};

export default MatchList;
