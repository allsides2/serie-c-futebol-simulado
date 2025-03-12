
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, Match, TeamStats, KnockoutMatch, KnockoutMatchPair } from '../types/football';
import { teams, generateGroupMatches, generateKnockoutMatches } from '../data/initialData';
import { toast } from '@/components/ui/sonner';

interface FootballContextType {
  teams: Team[];
  groupMatches: Match[];
  knockoutMatches: KnockoutMatch[];
  knockoutPairs: KnockoutMatchPair[];
  standings: TeamStats[];
  currentRound: number;
  updateMatchResult: (matchId: number, homeGoals: number, awayGoals: number) => void;
  simulateRound: (round: number) => void;
  simulateAllRemainingMatches: () => void;
  resetAllResults: () => void;
  advanceToKnockout: () => void;
  updateKnockoutMatchResult: (matchId: number, homeGoals: number, awayGoals: number) => void;
  getTeamById: (id: number | null) => Team | undefined;
  getCurrentStage: () => 'GROUP' | 'KNOCKOUT';
}

const FootballContext = createContext<FootballContextType | undefined>(undefined);

export const FootballProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupMatches, setGroupMatches] = useState<Match[]>(generateGroupMatches());
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>(generateKnockoutMatches());
  const [knockoutPairs, setKnockoutPairs] = useState<KnockoutMatchPair[]>([]);
  const [standings, setStandings] = useState<TeamStats[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentStage, setCurrentStage] = useState<'GROUP' | 'KNOCKOUT'>('GROUP');

  // Inicializa a tabela com os times zerados
  useEffect(() => {
    const initialStandings: TeamStats[] = teams.map(team => ({
      teamId: team.id,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }));
    setStandings(initialStandings);
  }, []);

  // Atualiza a tabela sempre que as partidas mudarem
  useEffect(() => {
    updateStandings();
  }, [groupMatches]);

  // Atualiza os confrontos de mata-mata quando as partidas mudam
  useEffect(() => {
    updateKnockoutPairs();
  }, [knockoutMatches]);

  // Função para atualizar a tabela de classificação
  const updateStandings = () => {
    // Reinicia as estatísticas
    const updatedStats: TeamStats[] = teams.map(team => ({
      teamId: team.id,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }));

    // Calcula as estatísticas com base nas partidas jogadas
    groupMatches.forEach(match => {
      if (match.played && match.homeGoals !== null && match.awayGoals !== null) {
        // Atualiza estatísticas do time da casa
        const homeTeamStats = updatedStats.find(stats => stats.teamId === match.homeTeamId);
        if (homeTeamStats) {
          homeTeamStats.matchesPlayed++;
          homeTeamStats.goalsFor += match.homeGoals;
          homeTeamStats.goalsAgainst += match.awayGoals;

          if (match.homeGoals > match.awayGoals) {
            // Vitória do time da casa
            homeTeamStats.wins++;
            homeTeamStats.points += 3;
          } else if (match.homeGoals === match.awayGoals) {
            // Empate
            homeTeamStats.draws++;
            homeTeamStats.points += 1;
          } else {
            // Derrota do time da casa
            homeTeamStats.losses++;
          }
        }

        // Atualiza estatísticas do time visitante
        const awayTeamStats = updatedStats.find(stats => stats.teamId === match.awayTeamId);
        if (awayTeamStats) {
          awayTeamStats.matchesPlayed++;
          awayTeamStats.goalsFor += match.awayGoals;
          awayTeamStats.goalsAgainst += match.homeGoals;

          if (match.awayGoals > match.homeGoals) {
            // Vitória do time visitante
            awayTeamStats.wins++;
            awayTeamStats.points += 3;
          } else if (match.homeGoals === match.awayGoals) {
            // Empate
            awayTeamStats.draws++;
            awayTeamStats.points += 1;
          } else {
            // Derrota do time visitante
            awayTeamStats.losses++;
          }
        }
      }
    });

    // Ordena a tabela pelos critérios de desempate
    updatedStats.sort((a, b) => {
      // 1. Pontos
      if (b.points !== a.points) return b.points - a.points;
      
      // 2. Vitórias
      if (b.wins !== a.wins) return b.wins - a.wins;
      
      // 3. Saldo de gols
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      
      // 4. Gols marcados
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      
      // 5. Confronto direto (simplificado, seria necessário implementar com mais detalhe)
      return 0; // Em caso de empate nestes critérios, ordenamos alfabeticamente
    });

    // Atualiza a posição na tabela
    updatedStats.forEach((stats, index) => {
      stats.position = index + 1;
    });

    setStandings(updatedStats);
  };

  // Função para atualizar o resultado de uma partida da fase de grupos
  const updateMatchResult = (matchId: number, homeGoals: number, awayGoals: number) => {
    const updatedMatches = groupMatches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          homeGoals,
          awayGoals,
          played: true
        };
      }
      return match;
    });
    
    setGroupMatches(updatedMatches);
    updateCurrentRound();
  };

  // Função para simular uma rodada
  const simulateRound = (round: number) => {
    const roundMatches = groupMatches.filter(match => match.round === round);
    const updatedMatches = [...groupMatches];
    
    roundMatches.forEach(match => {
      const matchIndex = updatedMatches.findIndex(m => m.id === match.id);
      if (matchIndex !== -1) {
        // Gera um resultado aleatório
        const homeGoals = Math.floor(Math.random() * 4); // 0-3 gols
        const awayGoals = Math.floor(Math.random() * 4); // 0-3 gols
        
        updatedMatches[matchIndex] = {
          ...updatedMatches[matchIndex],
          homeGoals,
          awayGoals,
          played: true
        };
      }
    });
    
    setGroupMatches(updatedMatches);
    updateCurrentRound();
    toast.success(`Rodada ${round} simulada com sucesso!`);
  };

  // Função para simular todas as partidas restantes
  const simulateAllRemainingMatches = () => {
    const updatedMatches = groupMatches.map(match => {
      if (!match.played) {
        const homeGoals = Math.floor(Math.random() * 4); // 0-3 gols
        const awayGoals = Math.floor(Math.random() * 4); // 0-3 gols
        
        return {
          ...match,
          homeGoals,
          awayGoals,
          played: true
        };
      }
      return match;
    });
    
    setGroupMatches(updatedMatches);
    setCurrentRound(19);
    toast.success('Todas as partidas restantes foram simuladas!');
  };

  // Função para resetar todos os resultados
  const resetAllResults = () => {
    const resetMatches = groupMatches.map(match => ({
      ...match,
      homeGoals: null,
      awayGoals: null,
      played: false
    }));
    
    const resetKnockoutMatches = generateKnockoutMatches();
    
    setGroupMatches(resetMatches);
    setKnockoutMatches(resetKnockoutMatches);
    setCurrentRound(1);
    setCurrentStage('GROUP');
    toast.success('Todos os resultados foram resetados!');
  };

  // Função para atualizar a rodada atual
  const updateCurrentRound = () => {
    const maxRound = 19;
    let foundIncompleteRound = false;
    
    for (let round = 1; round <= maxRound; round++) {
      const roundMatches = groupMatches.filter(match => match.round === round);
      const allPlayed = roundMatches.every(match => match.played);
      
      if (!allPlayed) {
        setCurrentRound(round);
        foundIncompleteRound = true;
        break;
      }
    }
    
    if (!foundIncompleteRound) {
      setCurrentRound(maxRound);
    }
  };

  // Função para avançar para a fase de mata-mata
  const advanceToKnockout = () => {
    // Verifica se todas as rodadas foram jogadas
    const allMatchesPlayed = groupMatches.every(match => match.played);
    
    if (!allMatchesPlayed) {
      toast.error('Complete todas as rodadas antes de avançar para o mata-mata!');
      return;
    }
    
    // Pega os 8 melhores times para o mata-mata
    const topEight = standings.slice(0, 8).map(stats => stats.teamId);
    
    if (topEight.length !== 8) {
      toast.error('Erro ao determinar os classificados para o mata-mata!');
      return;
    }
    
    // Configura os confrontos das quartas de final
    // 1º vs 8º, 2º vs 7º, 3º vs 6º, 4º vs 5º
    const quarterFinalMatches = knockoutMatches.filter(match => match.stage === 'QUARTER');
    
    const updatedKnockoutMatches = [...knockoutMatches];
    
    // Primeiro jogo: 1º vs 8º (ida e volta)
    const match1First = quarterFinalMatches.find(m => m.matchNumber === 1 && m.legNumber === 1);
    const match1Second = quarterFinalMatches.find(m => m.matchNumber === 1 && m.legNumber === 2);
    
    if (match1First && match1Second) {
      const matchIndex1First = updatedKnockoutMatches.findIndex(m => m.id === match1First.id);
      const matchIndex1Second = updatedKnockoutMatches.findIndex(m => m.id === match1Second.id);
      
      updatedKnockoutMatches[matchIndex1First] = {
        ...updatedKnockoutMatches[matchIndex1First],
        homeTeamId: topEight[7], // 8º colocado
        awayTeamId: topEight[0], // 1º colocado
      };
      
      updatedKnockoutMatches[matchIndex1Second] = {
        ...updatedKnockoutMatches[matchIndex1Second],
        homeTeamId: topEight[0], // 1º colocado
        awayTeamId: topEight[7], // 8º colocado
      };
    }
    
    // Segundo jogo: 2º vs 7º (ida e volta)
    const match2First = quarterFinalMatches.find(m => m.matchNumber === 2 && m.legNumber === 1);
    const match2Second = quarterFinalMatches.find(m => m.matchNumber === 2 && m.legNumber === 2);
    
    if (match2First && match2Second) {
      const matchIndex2First = updatedKnockoutMatches.findIndex(m => m.id === match2First.id);
      const matchIndex2Second = updatedKnockoutMatches.findIndex(m => m.id === match2Second.id);
      
      updatedKnockoutMatches[matchIndex2First] = {
        ...updatedKnockoutMatches[matchIndex2First],
        homeTeamId: topEight[6], // 7º colocado
        awayTeamId: topEight[1], // 2º colocado
      };
      
      updatedKnockoutMatches[matchIndex2Second] = {
        ...updatedKnockoutMatches[matchIndex2Second],
        homeTeamId: topEight[1], // 2º colocado
        awayTeamId: topEight[6], // 7º colocado
      };
    }
    
    // Terceiro jogo: 3º vs 6º (ida e volta)
    const match3First = quarterFinalMatches.find(m => m.matchNumber === 3 && m.legNumber === 1);
    const match3Second = quarterFinalMatches.find(m => m.matchNumber === 3 && m.legNumber === 2);
    
    if (match3First && match3Second) {
      const matchIndex3First = updatedKnockoutMatches.findIndex(m => m.id === match3First.id);
      const matchIndex3Second = updatedKnockoutMatches.findIndex(m => m.id === match3Second.id);
      
      updatedKnockoutMatches[matchIndex3First] = {
        ...updatedKnockoutMatches[matchIndex3First],
        homeTeamId: topEight[5], // 6º colocado
        awayTeamId: topEight[2], // 3º colocado
      };
      
      updatedKnockoutMatches[matchIndex3Second] = {
        ...updatedKnockoutMatches[matchIndex3Second],
        homeTeamId: topEight[2], // 3º colocado
        awayTeamId: topEight[5], // 6º colocado
      };
    }
    
    // Quarto jogo: 4º vs 5º (ida e volta)
    const match4First = quarterFinalMatches.find(m => m.matchNumber === 4 && m.legNumber === 1);
    const match4Second = quarterFinalMatches.find(m => m.matchNumber === 4 && m.legNumber === 2);
    
    if (match4First && match4Second) {
      const matchIndex4First = updatedKnockoutMatches.findIndex(m => m.id === match4First.id);
      const matchIndex4Second = updatedKnockoutMatches.findIndex(m => m.id === match4Second.id);
      
      updatedKnockoutMatches[matchIndex4First] = {
        ...updatedKnockoutMatches[matchIndex4First],
        homeTeamId: topEight[4], // 5º colocado
        awayTeamId: topEight[3], // 4º colocado
      };
      
      updatedKnockoutMatches[matchIndex4Second] = {
        ...updatedKnockoutMatches[matchIndex4Second],
        homeTeamId: topEight[3], // 4º colocado
        awayTeamId: topEight[4], // 5º colocado
      };
    }
    
    setKnockoutMatches(updatedKnockoutMatches);
    setCurrentStage('KNOCKOUT');
    toast.success('Fase de mata-mata iniciada!');
  };

  // Função para atualizar o resultado de uma partida de mata-mata
  const updateKnockoutMatchResult = (matchId: number, homeGoals: number, awayGoals: number) => {
    const updatedMatches = knockoutMatches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          homeGoals,
          awayGoals,
          played: true
        };
      }
      return match;
    });
    
    setKnockoutMatches(updatedMatches);
    updateKnockoutPairs();
    
    // Verifica se o jogo que acabou de ser atualizado é o segundo jogo de algum confronto
    const updatedMatch = updatedMatches.find(m => m.id === matchId);
    if (updatedMatch && updatedMatch.legNumber === 2) {
      // Se for o segundo jogo, verifica se é possível avançar com o vencedor
      processKnockoutAdvancement(updatedMatches);
    }
  };

  // Processa o avanço dos times no mata-mata após os resultados
  const processKnockoutAdvancement = (matches: KnockoutMatch[]) => {
    // Processa quarterfinals -> semifinals
    const quarterFinals = matches.filter(m => m.stage === 'QUARTER');
    const semiFinals = matches.filter(m => m.stage === 'SEMI');
    
    // Para cada par de quartas (1-4)
    for (let matchNumber = 1; matchNumber <= 4; matchNumber++) {
      const firstLeg = quarterFinals.find(m => m.matchNumber === matchNumber && m.legNumber === 1);
      const secondLeg = quarterFinals.find(m => m.matchNumber === matchNumber && m.legNumber === 2);
      
      if (firstLeg && secondLeg && firstLeg.played && secondLeg.played && 
          firstLeg.homeGoals !== null && firstLeg.awayGoals !== null && 
          secondLeg.homeGoals !== null && secondLeg.awayGoals !== null) {
        
        // Calcula o agregado
        const homeAgg = firstLeg.homeGoals + secondLeg.awayGoals;
        const awayAgg = firstLeg.awayGoals + secondLeg.homeGoals;
        
        let winnerId: number | null = null;
        
        if (homeAgg > awayAgg) {
          winnerId = firstLeg.homeTeamId;
        } else if (awayAgg > homeAgg) {
          winnerId = firstLeg.awayTeamId;
        } else {
          // Empate no agregado - critério de desempate: gols fora
          if (firstLeg.awayGoals > secondLeg.awayGoals) {
            winnerId = firstLeg.awayTeamId;
          } else if (secondLeg.awayGoals > firstLeg.awayGoals) {
            winnerId = firstLeg.homeTeamId;
          } else {
            // Se tudo estiver empatado, vamos considerar que o primeiro time vence (simplificação)
            winnerId = firstLeg.homeTeamId;
          }
        }
        
        // Determina para qual semifinal o vencedor vai
        // Quartas 1 e 2 vão para semi 1, Quartas 3 e 4 vão para semi 2
        const semiMatchNumber = matchNumber <= 2 ? 1 : 2;
        const isFirstTeamInSemi = matchNumber % 2 === 1; // Se for primeiro ou terceiro, é o primeiro time na semi
        
        // Preenche as semifinais
        const updatedMatches = [...matches];
        
        if (winnerId) {
          // Encontra as partidas de semifinal correspondentes
          const semiFinalFirstLeg = semiFinals.find(m => m.matchNumber === semiMatchNumber && m.legNumber === 1);
          const semiFinalSecondLeg = semiFinals.find(m => m.matchNumber === semiMatchNumber && m.legNumber === 2);
          
          if (semiFinalFirstLeg && semiFinalSecondLeg) {
            const semiFirstLegIndex = updatedMatches.findIndex(m => m.id === semiFinalFirstLeg.id);
            const semiSecondLegIndex = updatedMatches.findIndex(m => m.id === semiFinalSecondLeg.id);
            
            if (isFirstTeamInSemi) {
              // Atualiza o time da casa na ida e visitante na volta
              updatedMatches[semiFirstLegIndex] = {
                ...updatedMatches[semiFirstLegIndex],
                homeTeamId: winnerId
              };
              
              updatedMatches[semiSecondLegIndex] = {
                ...updatedMatches[semiSecondLegIndex],
                awayTeamId: winnerId
              };
            } else {
              // Atualiza o time visitante na ida e da casa na volta
              updatedMatches[semiFirstLegIndex] = {
                ...updatedMatches[semiFirstLegIndex],
                awayTeamId: winnerId
              };
              
              updatedMatches[semiSecondLegIndex] = {
                ...updatedMatches[semiSecondLegIndex],
                homeTeamId: winnerId
              };
            }
          }
          
          // Só atualiza se houver mudanças
          const hasChanges = updatedMatches.some((m, idx) => 
            m.homeTeamId !== matches[idx].homeTeamId || 
            m.awayTeamId !== matches[idx].awayTeamId
          );
          
          if (hasChanges) {
            setKnockoutMatches(updatedMatches);
          }
        }
      }
    }
    
    // Processa semifinals -> final
    const semiFinalsComplete = matches.filter(m => 
      m.stage === 'SEMI' && m.played && m.homeGoals !== null && m.awayGoals !== null
    );
    
    if (semiFinalsComplete.length === 4) {
      const finals = matches.filter(m => m.stage === 'FINAL');
      
      // Para cada par de semifinais (1-2)
      for (let matchNumber = 1; matchNumber <= 2; matchNumber++) {
        const firstLeg = matches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 1);
        const secondLeg = matches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 2);
        
        if (firstLeg && secondLeg && firstLeg.played && secondLeg.played && 
            firstLeg.homeGoals !== null && firstLeg.awayGoals !== null && 
            secondLeg.homeGoals !== null && secondLeg.awayGoals !== null) {
          
          // Calcula o agregado
          const homeAgg = firstLeg.homeGoals + secondLeg.awayGoals;
          const awayAgg = firstLeg.awayGoals + secondLeg.homeGoals;
          
          let winnerId: number | null = null;
          
          if (homeAgg > awayAgg) {
            winnerId = firstLeg.homeTeamId;
          } else if (awayAgg > homeAgg) {
            winnerId = firstLeg.awayTeamId;
          } else {
            // Empate no agregado - critério de desempate: gols fora
            if (firstLeg.awayGoals > secondLeg.awayGoals) {
              winnerId = firstLeg.awayTeamId;
            } else if (secondLeg.awayGoals > firstLeg.awayGoals) {
              winnerId = firstLeg.homeTeamId;
            } else {
              // Se tudo estiver empatado, vamos considerar que o primeiro time vence (simplificação)
              winnerId = firstLeg.homeTeamId;
            }
          }
          
          // Determina posição na final
          const isFirstTeamInFinal = matchNumber === 1;
          
          // Preenche a final
          const updatedMatches = [...matches];
          
          if (winnerId) {
            // Encontra as partidas de final
            const finalFirstLeg = finals.find(m => m.legNumber === 1);
            const finalSecondLeg = finals.find(m => m.legNumber === 2);
            
            if (finalFirstLeg && finalSecondLeg) {
              const finalFirstLegIndex = updatedMatches.findIndex(m => m.id === finalFirstLeg.id);
              const finalSecondLegIndex = updatedMatches.findIndex(m => m.id === finalSecondLeg.id);
              
              if (isFirstTeamInFinal) {
                // Atualiza o time da casa na ida e visitante na volta
                updatedMatches[finalFirstLegIndex] = {
                  ...updatedMatches[finalFirstLegIndex],
                  homeTeamId: winnerId
                };
                
                updatedMatches[finalSecondLegIndex] = {
                  ...updatedMatches[finalSecondLegIndex],
                  awayTeamId: winnerId
                };
              } else {
                // Atualiza o time visitante na ida e da casa na volta
                updatedMatches[finalFirstLegIndex] = {
                  ...updatedMatches[finalFirstLegIndex],
                  awayTeamId: winnerId
                };
                
                updatedMatches[finalSecondLegIndex] = {
                  ...updatedMatches[finalSecondLegIndex],
                  homeTeamId: winnerId
                };
              }
            }
            
            // Só atualiza se houver mudanças
            const hasChanges = updatedMatches.some((m, idx) => 
              m.homeTeamId !== matches[idx].homeTeamId || 
              m.awayTeamId !== matches[idx].awayTeamId
            );
            
            if (hasChanges) {
              setKnockoutMatches(updatedMatches);
            }
          }
        }
      }
    }
    
    // Poderia processar o vencedor da final aqui, mas como não há uma próxima fase,
    // apenas atualizamos os pares de mata-mata
    updateKnockoutPairs();
  };

  // Função para atualizar os confrontos de mata-mata
  const updateKnockoutPairs = () => {
    const pairs: KnockoutMatchPair[] = [];
    
    // Quartas de final
    for (let matchNumber = 1; matchNumber <= 4; matchNumber++) {
      const firstLeg = knockoutMatches.find(m => m.stage === 'QUARTER' && m.matchNumber === matchNumber && m.legNumber === 1);
      const secondLeg = knockoutMatches.find(m => m.stage === 'QUARTER' && m.matchNumber === matchNumber && m.legNumber === 2);
      
      if (firstLeg && secondLeg) {
        const homeAggregateGoals = (firstLeg.homeGoals ?? 0) + (secondLeg.awayGoals ?? 0);
        const awayAggregateGoals = (firstLeg.awayGoals ?? 0) + (secondLeg.homeGoals ?? 0);
        
        let winnerId: number | null = null;
        
        if (firstLeg.played && secondLeg.played) {
          if (homeAggregateGoals > awayAggregateGoals) {
            winnerId = firstLeg.homeTeamId;
          } else if (awayAggregateGoals > homeAggregateGoals) {
            winnerId = firstLeg.awayTeamId;
          } else {
            // Empate no agregado - critério de desempate: gols fora
            if ((firstLeg.awayGoals ?? 0) > (secondLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.awayTeamId;
            } else if ((secondLeg.awayGoals ?? 0) > (firstLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.homeTeamId;
            }
            // Se tudo estiver empatado, considere primeiro time como vencedor
            else if (firstLeg.homeTeamId) {
              winnerId = firstLeg.homeTeamId;
            }
          }
        }
        
        pairs.push({
          id: matchNumber,
          stage: 'QUARTER',
          matchNumber,
          firstLeg: { ...firstLeg },
          secondLeg: { ...secondLeg },
          homeTeamId: firstLeg.homeTeamId,
          awayTeamId: firstLeg.awayTeamId,
          homeAggregateGoals,
          awayAggregateGoals,
          winnerId
        });
      }
    }
    
    // Semifinais
    for (let matchNumber = 1; matchNumber <= 2; matchNumber++) {
      const firstLeg = knockoutMatches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 1);
      const secondLeg = knockoutMatches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 2);
      
      if (firstLeg && secondLeg) {
        const homeAggregateGoals = (firstLeg.homeGoals ?? 0) + (secondLeg.awayGoals ?? 0);
        const awayAggregateGoals = (firstLeg.awayGoals ?? 0) + (secondLeg.homeGoals ?? 0);
        
        let winnerId: number | null = null;
        
        if (firstLeg.played && secondLeg.played) {
          if (homeAggregateGoals > awayAggregateGoals) {
            winnerId = firstLeg.homeTeamId;
          } else if (awayAggregateGoals > homeAggregateGoals) {
            winnerId = firstLeg.awayTeamId;
          } else {
            // Empate no agregado - critério de desempate: gols fora
            if ((firstLeg.awayGoals ?? 0) > (secondLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.awayTeamId;
            } else if ((secondLeg.awayGoals ?? 0) > (firstLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.homeTeamId;
            }
            // Se tudo estiver empatado, considere primeiro time como vencedor
            else if (firstLeg.homeTeamId) {
              winnerId = firstLeg.homeTeamId;
            }
          }
        }
        
        pairs.push({
          id: 4 + matchNumber,
          stage: 'SEMI',
          matchNumber,
          firstLeg: { ...firstLeg },
          secondLeg: { ...secondLeg },
          homeTeamId: firstLeg.homeTeamId,
          awayTeamId: firstLeg.awayTeamId,
          homeAggregateGoals,
          awayAggregateGoals,
          winnerId
        });
      }
    }
    
    // Final
    const finalFirstLeg = knockoutMatches.find(m => m.stage === 'FINAL' && m.matchNumber === 1 && m.legNumber === 1);
    const finalSecondLeg = knockoutMatches.find(m => m.stage === 'FINAL' && m.matchNumber === 1 && m.legNumber === 2);
    
    if (finalFirstLeg && finalSecondLeg) {
      const homeAggregateGoals = (finalFirstLeg.homeGoals ?? 0) + (finalSecondLeg.awayGoals ?? 0);
      const awayAggregateGoals = (finalFirstLeg.awayGoals ?? 0) + (finalSecondLeg.homeGoals ?? 0);
      
      let winnerId: number | null = null;
      
      if (finalFirstLeg.played && finalSecondLeg.played) {
        if (homeAggregateGoals > awayAggregateGoals) {
          winnerId = finalFirstLeg.homeTeamId;
        } else if (awayAggregateGoals > homeAggregateGoals) {
          winnerId = finalFirstLeg.awayTeamId;
        } else {
          // Empate no agregado - critério de desempate: gols fora
          if ((finalFirstLeg.awayGoals ?? 0) > (finalSecondLeg.awayGoals ?? 0)) {
            winnerId = finalFirstLeg.awayTeamId;
          } else if ((finalSecondLeg.awayGoals ?? 0) > (finalFirstLeg.awayGoals ?? 0)) {
            winnerId = finalFirstLeg.homeTeamId;
          }
          // Se tudo estiver empatado, considere primeiro time como vencedor
          else if (finalFirstLeg.homeTeamId) {
            winnerId = finalFirstLeg.homeTeamId;
          }
        }
      }
      
      pairs.push({
        id: 7,
        stage: 'FINAL',
        matchNumber: 1,
        firstLeg: { ...finalFirstLeg },
        secondLeg: { ...finalSecondLeg },
        homeTeamId: finalFirstLeg.homeTeamId,
        awayTeamId: finalFirstLeg.awayTeamId,
        homeAggregateGoals,
        awayAggregateGoals,
        winnerId
      });
    }
    
    setKnockoutPairs(pairs);
  };

  // Função para obter um time pelo ID
  const getTeamById = (id: number | null) => {
    if (id === null) return undefined;
    return teams.find(team => team.id === id);
  };

  // Função para obter o estágio atual
  const getCurrentStage = () => {
    return currentStage;
  };

  return (
    <FootballContext.Provider
      value={{
        teams,
        groupMatches,
        knockoutMatches,
        knockoutPairs,
        standings,
        currentRound,
        updateMatchResult,
        simulateRound,
        simulateAllRemainingMatches,
        resetAllResults,
        advanceToKnockout,
        updateKnockoutMatchResult,
        getTeamById,
        getCurrentStage
      }}
    >
      {children}
    </FootballContext.Provider>
  );
};

// Hook para usar o contexto do simulador
export const useFootball = () => {
  const context = useContext(FootballContext);
  if (context === undefined) {
    throw new Error('useFootball deve ser usado dentro de um FootballProvider');
  }
  return context;
};
