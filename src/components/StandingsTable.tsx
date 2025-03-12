
import { useFootball } from '@/context/FootballContext';

const StandingsTable = () => {
  const { standings, teams } = useFootball();
  
  const getTeamName = (teamId: number) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Time Desconhecido';
  };
  
  // Função para determinar a cor da linha com base na posição
  const getRowClass = (position: number | undefined) => {
    if (position === undefined) return '';
    
    if (position <= 8) {
      return 'bg-green-50 border-l-4 border-brasil-green';
    } else if (position >= 17) {
      return 'bg-red-50 border-l-4 border-red-500';
    }
    return '';
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] bg-white">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left">
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Time</th>
            <th className="p-3 font-semibold text-center">P</th>
            <th className="p-3 font-semibold text-center">J</th>
            <th className="p-3 font-semibold text-center">V</th>
            <th className="p-3 font-semibold text-center">E</th>
            <th className="p-3 font-semibold text-center">D</th>
            <th className="p-3 font-semibold text-center">GP</th>
            <th className="p-3 font-semibold text-center">GC</th>
            <th className="p-3 font-semibold text-center">SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr 
              key={team.teamId} 
              className={`border-b border-gray-100 hover:bg-gray-50 ${getRowClass(team.position)}`}
            >
              <td className="p-3 font-semibold">{team.position}</td>
              <td className="p-3">{getTeamName(team.teamId)}</td>
              <td className="p-3 text-center font-bold">{team.points}</td>
              <td className="p-3 text-center">{team.matchesPlayed}</td>
              <td className="p-3 text-center">{team.wins}</td>
              <td className="p-3 text-center">{team.draws}</td>
              <td className="p-3 text-center">{team.losses}</td>
              <td className="p-3 text-center">{team.goalsFor}</td>
              <td className="p-3 text-center">{team.goalsAgainst}</td>
              <td className="p-3 text-center">
                {team.goalsFor - team.goalsAgainst > 0 && '+'}
                {team.goalsFor - team.goalsAgainst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-brasil-green mr-2"></div>
          <span>Classificados para o mata-mata (G8)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Rebaixados (Z4)</span>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
