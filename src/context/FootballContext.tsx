import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, Match, TeamStats, KnockoutMatch, KnockoutMatchPair } from '../types/football';
import { teams, generateGroupMatches, generateKnockoutMatches } from '../data/initialData';
import { toast } from "@/hooks/use-toast";

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

  useEffect(() => {
    updateStandings();
  }, [groupMatches]);

  useEffect(() => {
    updateKnockoutPairs();
  }, [knockoutMatches]);

  const updateStandings = () => {
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

    groupMatches.forEach(match => {
      if (match.played && match.homeGoals !== null && match.awayGoals !== null) {
        const homeTeamStats = updatedStats.find(stats => stats.teamId === match.homeTeamId);
        if (homeTeamStats) {
          homeTeamStats.matchesPlayed++;
          homeTeamStats.goalsFor += match.homeGoals;
          homeTeamStats.goalsAgainst += match.awayGoals;

          if (match.homeGoals > match.awayGoals) {
            homeTeamStats.wins++;
            homeTeamStats.points += 3;
          } else if (match.homeGoals === match.awayGoals) {
            homeTeamStats.draws++;
            homeTeamStats.points += 1;
          } else {
            homeTeamStats.losses++;
          }
        }

        const awayTeamStats = updatedStats.find(stats => stats.teamId === match.awayTeamId);
        if (awayTeamStats) {
          awayTeamStats.matchesPlayed++;
          awayTeamStats.goalsFor += match.awayGoals;
          awayTeamStats.goalsAgainst += match.homeGoals;

          if (match.awayGoals > match.homeGoals) {
            awayTeamStats.wins++;
            awayTeamStats.points += 3;
          } else if (match.homeGoals === match.awayGoals) {
            awayTeamStats.draws++;
            awayTeamStats.points += 1;
          } else {
            awayTeamStats.losses++;
          }
        }
      }
    });

    updatedStats.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return 0;
    });

    updatedStats.forEach((stats, index) => {
      stats.position = index + 1;
    });

    setStandings(updatedStats);
  };

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

  const simulateRound = (round: number) => {
    const roundMatches = groupMatches.filter(match => match.round === round);
    const updatedMatches = [...groupMatches];
    
    roundMatches.forEach(match => {
      const matchIndex = updatedMatches.findIndex(m => m.id === match.id);
      if (matchIndex !== -1) {
        const homeGoals = Math.floor(Math.random() * 4);
        const awayGoals = Math.floor(Math.random() * 4);
        
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

  const simulateAllRemainingMatches = () => {
    const updatedMatches = groupMatches.map(match => {
      if (!match.played) {
        const homeGoals = Math.floor(Math.random() * 4);
        const awayGoals = Math.floor(Math.random() * 4);
        
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

  const advanceToKnockout = () => {
    const allMatchesPlayed = groupMatches.every(match => match.played);
    
    if (!allMatchesPlayed) {
      toast.error('Complete todas as rodadas antes de avançar para o mata-mata!');
      return;
    }
    
    const topEight = standings.slice(0, 8).map(stats => stats.teamId);
    
    if (topEight.length !== 8) {
      toast.error('Erro ao determinar os classificados para o mata-mata!');
      return;
    }
    
    const quarterFinalMatches = knockoutMatches.filter(match => match.stage === 'QUARTER');
    
    const updatedKnockoutMatches = [...knockoutMatches];
    
    const match1First = quarterFinalMatches.find(m => m.matchNumber === 1 && m.legNumber === 1);
    const match1Second = quarterFinalMatches.find(m => m.matchNumber === 1 && m.legNumber === 2);
    
    if (match1First && match1Second) {
      const matchIndex1First = updatedKnockoutMatches.findIndex(m => m.id === match1First.id);
      const matchIndex1Second = updatedKnockoutMatches.findIndex(m => m.id === match1Second.id);
      
      updatedKnockoutMatches[matchIndex1First] = {
        ...updatedKnockoutMatches[matchIndex1First],
        homeTeamId: topEight[7],
        awayTeamId: topEight[0]
      };
      
      updatedKnockoutMatches[matchIndex1Second] = {
        ...updatedKnockoutMatches[matchIndex1Second],
        homeTeamId: topEight[0],
        awayTeamId: topEight[7]
      };
    }
    
    const match2First = quarterFinalMatches.find(m => m.matchNumber === 2 && m.legNumber === 1);
    const match2Second = quarterFinalMatches.find(m => m.matchNumber === 2 && m.legNumber === 2);
    
    if (match2First && match2Second) {
      const matchIndex2First = updatedKnockoutMatches.findIndex(m => m.id === match2First.id);
      const matchIndex2Second = updatedKnockoutMatches.findIndex(m => m.id === match2Second.id);
      
      updatedKnockoutMatches[matchIndex2First] = {
        ...updatedKnockoutMatches[matchIndex2First],
        homeTeamId: topEight[6],
        awayTeamId: topEight[1]
      };
      
      updatedKnockoutMatches[matchIndex2Second] = {
        ...updatedKnockoutMatches[matchIndex2Second],
        homeTeamId: topEight[1],
        awayTeamId: topEight[6]
      };
    }
    
    const match3First = quarterFinalMatches.find(m => m.matchNumber === 3 && m.legNumber === 1);
    const match3Second = quarterFinalMatches.find(m => m.matchNumber === 3 && m.legNumber === 2);
    
    if (match3First && match3Second) {
      const matchIndex3First = updatedKnockoutMatches.findIndex(m => m.id === match3First.id);
      const matchIndex3Second = updatedKnockoutMatches.findIndex(m => m.id === match3Second.id);
      
      updatedKnockoutMatches[matchIndex3First] = {
        ...updatedKnockoutMatches[matchIndex3First],
        homeTeamId: topEight[5],
        awayTeamId: topEight[2]
      };
      
      updatedKnockoutMatches[matchIndex3Second] = {
        ...updatedKnockoutMatches[matchIndex3Second],
        homeTeamId: topEight[2],
        awayTeamId: topEight[5]
      };
    }
    
    const match4First = quarterFinalMatches.find(m => m.matchNumber === 4 && m.legNumber === 1);
    const match4Second = quarterFinalMatches.find(m => m.matchNumber === 4 && m.legNumber === 2);
    
    if (match4First && match4Second) {
      const matchIndex4First = updatedKnockoutMatches.findIndex(m => m.id === match4First.id);
      const matchIndex4Second = updatedKnockoutMatches.findIndex(m => m.id === match4Second.id);
      
      updatedKnockoutMatches[matchIndex4First] = {
        ...updatedKnockoutMatches[matchIndex4First],
        homeTeamId: topEight[4],
        awayTeamId: topEight[3]
      };
      
      updatedKnockoutMatches[matchIndex4Second] = {
        ...updatedKnockoutMatches[matchIndex4Second],
        homeTeamId: topEight[3],
        awayTeamId: topEight[4]
      };
    }
    
    setKnockoutMatches(updatedKnockoutMatches);
    setCurrentStage('KNOCKOUT');
    toast.success('Fase de mata-mata iniciada!');
  };

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
    
    const updatedMatch = updatedMatches.find(m => m.id === matchId);
    if (updatedMatch && updatedMatch.legNumber === 2) {
      processKnockoutAdvancement(updatedMatches);
    }
  };

  const processKnockoutAdvancement = (matches: KnockoutMatch[]) => {
    const quarterFinals = matches.filter(m => m.stage === 'QUARTER');
    const semiFinals = matches.filter(m => m.stage === 'SEMI');
    
    for (let matchNumber = 1; matchNumber <= 4; matchNumber++) {
      const firstLeg = quarterFinals.find(m => m.matchNumber === matchNumber && m.legNumber === 1);
      const secondLeg = quarterFinals.find(m => m.matchNumber === matchNumber && m.legNumber === 2);
      
      if (firstLeg && secondLeg && firstLeg.played && secondLeg.played && 
          firstLeg.homeGoals !== null && firstLeg.awayGoals !== null && 
          secondLeg.homeGoals !== null && secondLeg.awayGoals !== null) {
        
        const homeAgg = firstLeg.homeGoals + secondLeg.awayGoals;
        const awayAgg = firstLeg.awayGoals + secondLeg.homeGoals;
        
        let winnerId: number | null = null;
        
        if (homeAgg > awayAgg) {
          winnerId = firstLeg.homeTeamId;
        } else if (awayAgg > homeAgg) {
          winnerId = firstLeg.awayTeamId;
        } else {
          if (firstLeg.awayGoals > secondLeg.awayGoals) {
            winnerId = firstLeg.awayTeamId;
          } else if (secondLeg.awayGoals > firstLeg.awayGoals) {
            winnerId = firstLeg.homeTeamId;
          } else {
            winnerId = firstLeg.homeTeamId;
          }
        }
        
        const semiMatchNumber = matchNumber <= 2 ? 1 : 2;
        const isFirstTeamInSemi = matchNumber % 2 === 1;
        
        const updatedMatches = [...matches];
        
        if (winnerId) {
          const semiFinalFirstLeg = semiFinals.find(m => m.matchNumber === semiMatchNumber && m.legNumber === 1);
          const semiFinalSecondLeg = semiFinals.find(m => m.matchNumber === semiMatchNumber && m.legNumber === 2);
          
          if (semiFinalFirstLeg && semiFinalSecondLeg) {
            const semiFirstLegIndex = updatedMatches.findIndex(m => m.id === semiFinalFirstLeg.id);
            const semiSecondLegIndex = updatedMatches.findIndex(m => m.id === semiFinalSecondLeg.id);
            
            if (isFirstTeamInSemi) {
              updatedMatches[semiFirstLegIndex] = {
                ...updatedMatches[semiFirstLegIndex],
                homeTeamId: winnerId
              };
              
              updatedMatches[semiSecondLegIndex] = {
                ...updatedMatches[semiSecondLegIndex],
                awayTeamId: winnerId
              };
            } else {
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
    
    const semiFinalsComplete = matches.filter(m => 
      m.stage === 'SEMI' && m.played && m.homeGoals !== null && m.awayGoals !== null
    );
    
    if (semiFinalsComplete.length === 4) {
      const finals = matches.filter(m => m.stage === 'FINAL');
      
      for (let matchNumber = 1; matchNumber <= 2; matchNumber++) {
        const firstLeg = matches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 1);
        const secondLeg = matches.find(m => m.stage === 'SEMI' && m.matchNumber === matchNumber && m.legNumber === 2);
        
        if (firstLeg && secondLeg && firstLeg.played && secondLeg.played && 
            firstLeg.homeGoals !== null && firstLeg.awayGoals !== null && 
            secondLeg.homeGoals !== null && secondLeg.awayGoals !== null) {
          
          const homeAgg = firstLeg.homeGoals + secondLeg.awayGoals;
          const awayAgg = firstLeg.awayGoals + secondLeg.homeGoals;
          
          let winnerId: number | null = null;
          
          if (homeAgg > awayAgg) {
            winnerId = firstLeg.homeTeamId;
          } else if (awayAgg > homeAgg) {
            winnerId = firstLeg.awayTeamId;
          } else {
            if (firstLeg.awayGoals > secondLeg.awayGoals) {
              winnerId = firstLeg.awayTeamId;
            } else if (secondLeg.awayGoals > firstLeg.awayGoals) {
              winnerId = firstLeg.homeTeamId;
            } else {
              winnerId = firstLeg.homeTeamId;
            }
          }
          
          const isFirstTeamInFinal = matchNumber === 1;
          
          const updatedMatches = [...matches];
          
          if (winnerId) {
            const finalFirstLeg = finals.find(m => m.legNumber === 1);
            const finalSecondLeg = finals.find(m => m.legNumber === 2);
            
            if (finalFirstLeg && finalSecondLeg) {
              const finalFirstLegIndex = updatedMatches.findIndex(m => m.id === finalFirstLeg.id);
              const finalSecondLegIndex = updatedMatches.findIndex(m => m.id === finalSecondLeg.id);
              
              if (isFirstTeamInFinal) {
                updatedMatches[finalFirstLegIndex] = {
                  ...updatedMatches[finalFirstLegIndex],
                  homeTeamId: winnerId
                };
                
                updatedMatches[finalSecondLegIndex] = {
                  ...updatedMatches[finalSecondLegIndex],
                  awayTeamId: winnerId
                };
              } else {
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
    
    updateKnockoutPairs();
  };

  const updateKnockoutPairs = () => {
    const pairs: KnockoutMatchPair[] = [];
    
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
            if ((firstLeg.awayGoals ?? 0) > (secondLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.awayTeamId;
            } else if ((secondLeg.awayGoals ?? 0) > (firstLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.homeTeamId;
            }
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
            if ((firstLeg.awayGoals ?? 0) > (secondLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.awayTeamId;
            } else if ((secondLeg.awayGoals ?? 0) > (firstLeg.awayGoals ?? 0)) {
              winnerId = firstLeg.homeTeamId;
            }
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
          if ((finalFirstLeg.awayGoals ?? 0) > (finalSecondLeg.awayGoals ?? 0)) {
            winnerId = finalFirstLeg.awayTeamId;
          } else if ((finalSecondLeg.awayGoals ?? 0) > (finalFirstLeg.awayGoals ?? 0)) {
            winnerId = finalFirstLeg.homeTeamId;
          }
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

  const getTeamById = (id: number | null) => {
    if (id === null) return undefined;
    return teams.find(team => team.id === id);
  };

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

export const useFootball = () => {
  const context = useContext(FootballContext);
  if (context === undefined) {
    throw new Error('useFootball deve ser usado dentro de um FootballProvider');
  }
  return context;
};
