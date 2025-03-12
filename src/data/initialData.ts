
import { Team, Match, KnockoutMatch } from '../types/football';

export const teams: Team[] = [
  { id: 1, name: "Paysandu", shortName: "PAY" },
  { id: 2, name: "Remo", shortName: "REM" },
  { id: 3, name: "Ferroviário", shortName: "FER" },
  { id: 4, name: "Botafogo-PB", shortName: "BOT" },
  { id: 5, name: "ABC", shortName: "ABC" },
  { id: 6, name: "CSA", shortName: "CSA" },
  { id: 7, name: "Floresta", shortName: "FLO" },
  { id: 8, name: "Volta Redonda", shortName: "VOL" },
  { id: 9, name: "Figueirense", shortName: "FIG" },
  { id: 10, name: "Náutico", shortName: "NAU" },
  { id: 11, name: "Londrina", shortName: "LON" },
  { id: 12, name: "São José-RS", shortName: "SJO" },
  { id: 13, name: "Confiança", shortName: "CON" },
  { id: 14, name: "Tombense", shortName: "TOM" },
  { id: 15, name: "Ypiranga-RS", shortName: "YPI" },
  { id: 16, name: "Aparecidense", shortName: "APA" },
  { id: 17, name: "Sampaio Corrêa", shortName: "SAM" },
  { id: 18, name: "Caxias", shortName: "CAX" },
  { id: 19, name: "Athletic", shortName: "ATH" },
  { id: 20, name: "São Bernardo", shortName: "SAO" },
];

// Função para gerar as partidas da fase de grupos
export const generateGroupMatches = (): Match[] => {
  const matches: Match[] = [];
  let matchId = 1;
  
  // Para cada rodada (19 rodadas no total)
  for (let round = 1; round <= 19; round++) {
    const roundMatches: Match[] = [];
    
    // Em cada rodada, temos 10 jogos (20 times)
    for (let i = 0; i < 10; i++) {
      // Algoritmo para distribuir os jogos
      // Esta é uma implementação simples, pode precisar de ajustes para um calendário real
      const homeIdx = (round + i) % 20;
      const awayIdx = (round + i + 10) % 20;
      
      roundMatches.push({
        id: matchId++,
        round,
        homeTeamId: teams[homeIdx].id,
        awayTeamId: teams[awayIdx].id,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    }
    
    matches.push(...roundMatches);
  }
  
  return matches;
};

// Função para gerar as partidas de mata-mata (inicialmente vazias)
export const generateKnockoutMatches = (): KnockoutMatch[] => {
  const knockoutMatches: KnockoutMatch[] = [];
  let id = 1;
  
  // Quartas de final (4 confrontos, 8 jogos)
  for (let matchNumber = 1; matchNumber <= 4; matchNumber++) {
    for (let leg = 1; leg <= 2; leg++) {
      knockoutMatches.push({
        id: id++,
        stage: 'QUARTER',
        matchNumber,
        legNumber: leg as 1 | 2,
        homeTeamId: null,
        awayTeamId: null,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    }
  }
  
  // Semifinais (2 confrontos, 4 jogos)
  for (let matchNumber = 1; matchNumber <= 2; matchNumber++) {
    for (let leg = 1; leg <= 2; leg++) {
      knockoutMatches.push({
        id: id++,
        stage: 'SEMI',
        matchNumber,
        legNumber: leg as 1 | 2,
        homeTeamId: null,
        awayTeamId: null,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    }
  }
  
  // Final (1 confronto, 2 jogos)
  for (let leg = 1; leg <= 2; leg++) {
    knockoutMatches.push({
      id: id++,
      stage: 'FINAL',
      matchNumber: 1,
      legNumber: leg as 1 | 2,
      homeTeamId: null,
      awayTeamId: null,
      homeGoals: null,
      awayGoals: null,
      played: false
    });
  }
  
  return knockoutMatches;
};
