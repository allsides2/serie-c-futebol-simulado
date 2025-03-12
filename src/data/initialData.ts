
import { Team, Match, KnockoutMatch } from '../types/football';

export const teams: Team[] = [
  { id: 1, name: "Paysandu", shortName: "PAY", logoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&h=50&fit=crop" },
  { id: 2, name: "Remo", shortName: "REM", logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop" },
  { id: 3, name: "Ferroviário", shortName: "FER", logoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
  { id: 4, name: "Botafogo-PB", shortName: "BOT", logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop" },
  { id: 5, name: "ABC", shortName: "ABC", logoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&h=50&fit=crop" },
  { id: 6, name: "CSA", shortName: "CSA", logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop" },
  { id: 7, name: "Floresta", shortName: "FLO", logoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
  { id: 8, name: "Volta Redonda", shortName: "VOL", logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop" },
  { id: 9, name: "Figueirense", shortName: "FIG", logoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&h=50&fit=crop" },
  { id: 10, name: "Náutico", shortName: "NAU", logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop" },
  { id: 11, name: "Londrina", shortName: "LON", logoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
  { id: 12, name: "São José-RS", shortName: "SJO", logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop" },
  { id: 13, name: "Confiança", shortName: "CON", logoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&h=50&fit=crop" },
  { id: 14, name: "Tombense", shortName: "TOM", logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop" },
  { id: 15, name: "Ypiranga-RS", shortName: "YPI", logoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
  { id: 16, name: "Aparecidense", shortName: "APA", logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop" },
  { id: 17, name: "Sampaio Corrêa", shortName: "SAM", logoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&h=50&fit=crop" },
  { id: 18, name: "Caxias", shortName: "CAX", logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop" },
  { id: 19, name: "Athletic", shortName: "ATH", logoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
  { id: 20, name: "São Bernardo", shortName: "SAO", logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=50&h=50&fit=crop" },
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
