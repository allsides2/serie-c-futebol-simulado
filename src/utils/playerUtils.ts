
import { Player, Position } from '@/pages/LineupBuilder';

export const groupPlayersByPosition = (players: Player[]) => {
  const grouped: Record<Position, Player[]> = {
    'GOL': [],
    'ZAG': [],
    'LAD': [],
    'LAE': [],
    'VOL': [],
    'MEI': [],
    'ATA': []
  };

  players.forEach(player => {
    grouped[player.position].push(player);
  });

  return grouped;
};

export const getPositionName = (position: Position): string => {
  switch (position) {
    case 'GOL': return 'Goleiro';
    case 'ZAG': return 'Zagueiro';
    case 'LAD': return 'Lateral Direito';
    case 'LAE': return 'Lateral Esquerdo';
    case 'VOL': return 'Volante';
    case 'MEI': return 'Meia';
    case 'ATA': return 'Atacante';
    default: return position;
  }
};
