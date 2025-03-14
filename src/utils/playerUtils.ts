import { Player, Position, Formation } from '@/pages/LineupBuilder';

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

export const validateCustomFormation = (formation: string): boolean => {
  // Format should be like "4-3-3" or "3-5-2"
  const pattern = /^\d-\d-\d$/;
  if (!pattern.test(formation)) return false;
  
  // Sum of all numbers should be 10 (excluding goalkeeper)
  const numbers = formation.split('-').map(n => parseInt(n, 10));
  return numbers.reduce((sum, num) => sum + num, 0) === 10;
};

export const createLineupSlotsForFormation = (formation: Formation | string): { position: Position; player: Player | null; x: number; y: number; }[] => {
  // Always add goalkeeper at fixed position
  const slots = [
    { position: 'GOL' as Position, player: null, x: 50, y: 90 }
  ];

  if (typeof formation === 'string' && !validateCustomFormation(formation)) {
    // If invalid custom formation, default to 4-3-3
    formation = '4-3-3';
  }

  const [defenders, midfielders, attackers] = String(formation).split('-').map(n => parseInt(n, 10));

  // Add defenders
  for (let i = 0; i < defenders; i++) {
    const x = defenders === 3 
      ? 30 + i * 20 
      : defenders === 4 
        ? (i === 0 ? 10 : i === 1 ? 30 : i === 2 ? 70 : 90)
        : (10 + i * (80 / (defenders - 1)));
        
    slots.push({
      position: i === 0 && defenders > 3 ? 'LAD' as Position :
               i === defenders - 1 && defenders > 3 ? 'LAE' as Position :
               'ZAG' as Position,
      player: null,
      x,
      y: 70
    });
  }

  // Add midfielders
  for (let i = 0; i < midfielders; i++) {
    const x = 10 + i * (80 / (midfielders - 1));
    const y = midfielders <= 3 ? 50 : midfielders <= 5 ? 40 + (i % 2) * 20 : 50;
    
    slots.push({
      position: (i === 0 && midfielders >= 4) ? 'LAD' as Position :
               (i === midfielders - 1 && midfielders >= 4) ? 'LAE' as Position :
               (i < midfielders / 2) ? 'VOL' as Position : 'MEI' as Position,
      player: null,
      x,
      y
    });
  }

  // Add attackers
  for (let i = 0; i < attackers; i++) {
    const x = 20 + i * (60 / (attackers > 1 ? attackers - 1 : 1));
    const y = attackers === 1 ? 10 : attackers === 2 ? 15 : 20;
    
    slots.push({
      position: 'ATA' as Position,
      player: null,
      x,
      y
    });
  }

  return slots;
};
