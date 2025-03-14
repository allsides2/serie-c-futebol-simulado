
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player, Position, LineupSlot } from '@/pages/LineupBuilder';
import { Badge } from "@/components/ui/badge";

interface PlayerSelectionProps {
  players: Player[];
  lineup: LineupSlot[];
  onSelectPlayer: (slotIndex: number, player: Player) => void;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({ 
  players,
  lineup,
  onSelectPlayer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  
  const getPositionName = (position: Position): string => {
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
  
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.number.toString().includes(searchTerm);
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    
    return matchesSearch && matchesPosition;
  });
  
  const isPlayerSelected = (playerId: number): boolean => {
    return lineup.some(slot => slot.player && slot.player.id === playerId);
  };
  
  const getSlotForPosition = (position: Position): number | null => {
    const slotIndex = lineup.findIndex(slot => 
      slot.position === position && slot.player === null
    );
    return slotIndex !== -1 ? slotIndex : null;
  };
  
  const handleSelectPlayer = (player: Player) => {
    // If player is already selected, find their position and unselect
    const existingSlotIndex = lineup.findIndex(
      slot => slot.player && slot.player.id === player.id
    );
    
    if (existingSlotIndex !== -1) {
      onSelectPlayer(existingSlotIndex, null as any);
      return;
    }
    
    // Try to assign to matching open position
    const matchingSlotIndex = getSlotForPosition(player.position);
    if (matchingSlotIndex !== null) {
      onSelectPlayer(matchingSlotIndex, player);
      return;
    }
    
    // If no matching position, find first open slot of any position
    const anyOpenSlotIndex = lineup.findIndex(slot => slot.player === null);
    if (anyOpenSlotIndex !== -1) {
      onSelectPlayer(anyOpenSlotIndex, player);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Jogadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar jogador por nome ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select 
            value={positionFilter} 
            onValueChange={setPositionFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por posição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as posições</SelectItem>
              <SelectItem value="GOL">Goleiros</SelectItem>
              <SelectItem value="ZAG">Zagueiros</SelectItem>
              <SelectItem value="LAD">Laterais Direitos</SelectItem>
              <SelectItem value="LAE">Laterais Esquerdos</SelectItem>
              <SelectItem value="VOL">Volantes</SelectItem>
              <SelectItem value="MEI">Meias</SelectItem>
              <SelectItem value="ATA">Atacantes</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-4 max-h-[400px] overflow-y-auto pr-2">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum jogador encontrado
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredPlayers.map(player => (
                  <li
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                      isPlayerSelected(player.id)
                        ? 'border-figueira-black bg-figueira-black/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectPlayer(player)}
                  >
                    <div className="flex items-center">
                      <div className="bg-figueira-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                        {player.number}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-gray-500">{getPositionName(player.position)}</div>
                      </div>
                    </div>
                    
                    {isPlayerSelected(player.id) && (
                      <Badge variant="outline" className="ml-2 bg-figueira-black text-white">
                        Selecionado
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerSelection;
