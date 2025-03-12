
import { useFootball } from '@/context/FootballContext';

const KnockoutBracket = () => {
  const { 
    getTeamById, 
    knockoutPairs
  } = useFootball();
  
  // Separar os confrontos por fase
  const quarterFinals = knockoutPairs.filter(pair => pair.stage === 'QUARTER');
  const semiFinals = knockoutPairs.filter(pair => pair.stage === 'SEMI');
  const final = knockoutPairs.find(pair => pair.stage === 'FINAL');
  
  // Função para renderizar time na chave
  const renderTeam = (teamId: number | null, isWinner: boolean = false) => {
    const team = getTeamById(teamId);
    
    return (
      <div className={`p-2 ${isWinner ? 'font-bold bg-brasil-green text-white' : 'bg-gray-100'}`}>
        {team ? team.name : '—'}
      </div>
    );
  };
  
  // Função para renderizar um confronto de mata-mata
  const renderMatchPair = (pair: any) => {
    const firstLegResult = pair.firstLeg.played 
      ? `${pair.firstLeg.homeGoals ?? 0} × ${pair.firstLeg.awayGoals ?? 0}` 
      : '? × ?';
    
    const secondLegResult = pair.secondLeg.played 
      ? `${pair.secondLeg.homeGoals ?? 0} × ${pair.secondLeg.awayGoals ?? 0}` 
      : '? × ?';
      
    const aggregateResult = `(${pair.homeAggregateGoals} × ${pair.awayAggregateGoals})`;
    
    return (
      <div className="border rounded-md overflow-hidden mb-2">
        <div className="flex justify-between border-b">
          {renderTeam(pair.homeTeamId, pair.winnerId === pair.homeTeamId)}
          <div className="text-xs p-2 flex items-center">
            <span>{firstLegResult}</span>
          </div>
        </div>
        <div className="flex justify-between">
          {renderTeam(pair.awayTeamId, pair.winnerId === pair.awayTeamId)}
          <div className="text-xs p-2 flex items-center">
            <span>{secondLegResult}</span>
          </div>
        </div>
        <div className="text-xs bg-gray-200 p-1 text-center">
          {pair.firstLeg.played && pair.secondLeg.played ? aggregateResult : 'Agregado: ? × ?'}
        </div>
      </div>
    );
  };
  
  // Função para renderizar o campeão
  const renderChampion = () => {
    if (!final || !final.winnerId) return null;
    
    const champion = getTeamById(final.winnerId);
    if (!champion) return null;
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-40 h-12 bg-brasil-yellow rounded-md flex items-center justify-center text-black font-bold">
          {champion.name}
        </div>
        <div className="text-sm font-semibold mt-1">CAMPEÃO</div>
      </div>
    );
  };
  
  // Renderiza os semifinalistas para promovidos
  const renderPromoted = () => {
    const promotedTeams = [];
    
    // Os 2 finalistas são promovidos
    if (final?.homeTeamId) promotedTeams.push(final.homeTeamId);
    if (final?.awayTeamId) promotedTeams.push(final.awayTeamId);
    
    // Os outros 2 semifinalistas são promovidos (perdedores da semifinal)
    semiFinals.forEach(semi => {
      if (semi.winnerId === null) return;
      
      // Adiciona o time que perdeu (que não é o vencedor)
      if (semi.homeTeamId !== semi.winnerId && semi.homeTeamId !== null) {
        promotedTeams.push(semi.homeTeamId);
      }
      if (semi.awayTeamId !== semi.winnerId && semi.awayTeamId !== null) {
        promotedTeams.push(semi.awayTeamId);
      }
    });
    
    if (promotedTeams.length === 0) return null;
    
    return (
      <div className="text-center mt-4">
        <h3 className="font-bold text-lg mb-2">Promovidos à Série B</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {promotedTeams.map(teamId => {
            const team = getTeamById(teamId);
            return team ? (
              <div 
                key={teamId} 
                className="bg-brasil-green text-white px-3 py-1 rounded"
              >
                {team.name}
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="flex justify-between">
          {/* Quartas de Final */}
          <div className="w-1/4 pr-2">
            <h3 className="font-bold text-center mb-4">Quartas de Final</h3>
            <div className="space-y-6">
              {quarterFinals.map(pair => (
                <div key={pair.id}>
                  {renderMatchPair(pair)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Semifinais */}
          <div className="w-1/4 px-2 flex flex-col">
            <h3 className="font-bold text-center mb-4">Semifinais</h3>
            <div className="space-y-20 mt-8">
              {semiFinals.map(pair => (
                <div key={pair.id}>
                  {renderMatchPair(pair)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Final */}
          <div className="w-1/4 px-2 flex flex-col">
            <h3 className="font-bold text-center mb-4">Final</h3>
            <div className="mt-44">
              {final && renderMatchPair(final)}
            </div>
          </div>
          
          {/* Campeão */}
          <div className="w-1/4 pl-2 flex flex-col items-center justify-center">
            <h3 className="font-bold text-center mb-4">Campeão</h3>
            <div className="mt-44">
              {renderChampion()}
            </div>
          </div>
        </div>
        
        {/* Promovidos */}
        {renderPromoted()}
      </div>
    </div>
  );
};

export default KnockoutBracket;
