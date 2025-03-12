
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
  
  // Check if match involves Figueirense (ID 9)
  const isFigueirenseMatch = (match: Match) => {
    return match.homeTeamId === 9 || match.awayTeamId === 9;
  };
  
  // Get class for team name to highlight Figueirense
  const getTeamNameClass = (teamId: number) => {
    return teamId === 9 ? 'font-bold text-figueira-black' : 'font-semibold';
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
        <Card 
          key={match.id} 
          className={`overflow-hidden ${isFigueirenseMatch(match) ? 'border-2 border-figueira-black ring-2 ring-figueira-white' : ''}`}
        >
          <CardContent className="p-0">
            <div className={`flex items-center p-4 ${isFigueirenseMatch(match) ? 'bg-gray-50' : ''}`}>
              <div className="w-1/3 text-right pr-2">
                <p className={getTeamNameClass(match.homeTeamId)}>
                  {getTeamName(match.homeTeamId)}
                  {match.homeTeamId === 9 && <span className="ml-2 inline-block px-1 py-0.5 text-xs rounded-sm bg-figueira-black text-figueira-white">FIG</span>}
                </p>
              </div>
              
              <div className="w-1/3 flex justify-center items-center space-x-3">
                <div className="w-12 h-10 flex justify-center items-center">
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={match.homeGoals === null ? '' : match.homeGoals}
                    onChange={(e) => handleScoreChange(match, true, e.target.value)}
                    className={`w-12 h-10 text-center font-bold text-lg ${match.homeTeamId === 9 ? 'border-figueira-black' : ''}`}
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
                    className={`w-12 h-10 text-center font-bold text-lg ${match.awayTeamId === 9 ? 'border-figueira-black' : ''}`}
                  />
                </div>
              </div>
              
              <div className="w-1/3 pl-2">
                <p className={getTeamNameClass(match.awayTeamId)}>
                  {getTeamName(match.awayTeamId)}
                  {match.awayTeamId === 9 && <span className="ml-2 inline-block px-1 py-0.5 text-xs rounded-sm bg-figueira-black text-figueira-white">FIG</span>}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-2 text-sm text-gray-600 ${isFigueirenseMatch(match) ? 'bg-figueira-black text-figueira-white' : 'bg-gray-100'}`}>
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
