import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import FormationSelector from "@/components/FormationSelector";
import PlayerSelection from "@/components/PlayerSelection";
import PredictionSubmission from "@/components/PredictionSubmission";
import Leaderboard from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw, Share2, MoveHorizontal, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createLineupSlotsForFormation } from '@/utils/playerUtils';

// Temporary player data until we have a database
const playerOptions: Player[] = [
  { id: 1, name: "João Ricardo", position: "GOL", number: 1 },
  { id: 2, name: "Diogo Mateus", position: "LAD", number: 2 },
  { id: 3, name: "Genílson", position: "ZAG", number: 3 },
  { id: 4, name: "Maurício", position: "ZAG", number: 4 },
  { id: 5, name: "Zé Mário", position: "LAE", number: 6 },
  { id: 6, name: "Serginho", position: "VOL", number: 8 },
  { id: 7, name: "Caíque", position: "VOL", number: 5 },
  { id: 8, name: "Léo Artur", position: "MEI", number: 10 },
  { id: 9, name: "Camilo", position: "MEI", number: 20 },
  { id: 10, name: "Guilherme", position: "ATA", number: 9 },
  { id: 11, name: "Gabriel Silva", position: "ATA", number: 11 },
  { id: 12, name: "Léo Gamalho", position: "ATA", number: 99 },
  { id: 13, name: "Jhonatan", position: "GOL", number: 12 },
  { id: 14, name: "Cauan", position: "ZAG", number: 13 },
  { id: 15, name: "Tiago Honório", position: "VOL", number: 15 },
  { id: 16, name: "Andrew", position: "MEI", number: 16 },
  { id: 17, name: "Crystopher", position: "ATA", number: 17 },
  { id: 18, name: "Bruno Marques", position: "ATA", number: 19 }
];

export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '3-4-3' | '4-2-3-1';
export type Position = 'GOL' | 'ZAG' | 'LAD' | 'LAE' | 'VOL' | 'MEI' | 'ATA';
export type Player = {
  id: number;
  name: string;
  position: Position;
  number: number;
};

export type LineupSlot = {
  position: Position;
  player: Player | null;
  x: number;
  y: number;
};

const LineupBuilder = () => {
  const { toast } = useToast();
  const [formation, setFormation] = useState<Formation | string>('4-3-3');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userName, setUserName] = useState('');

  // Initialize lineup based on formation
  useEffect(() => {
    const newLineup = createLineupSlotsForFormation(formation);
    setLineup(newLineup);
  }, [formation]);

  const handlePlayerAssignment = (slotIndex: number, player: Player | null) => {
    const newLineup = [...lineup];
    
    // Remove player from other positions if already assigned
    if (player) {
      const existingIndex = newLineup.findIndex(slot => 
        slot.player && slot.player.id === player.id
      );
      
      if (existingIndex !== -1 && existingIndex !== slotIndex) {
        newLineup[existingIndex].player = null;
      }
    }
    
    newLineup[slotIndex].player = player;
    setLineup(newLineup);
  };

  const handleDragStart = (e: React.DragEvent, slotIndex: number) => {
    if (!lineup[slotIndex].player) return;
    
    e.dataTransfer.setData('slotIndex', slotIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlotIndex(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlotIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlotIndex: number) => {
    e.preventDefault();
    setDragOverSlotIndex(null);
    
    // Handle player dropped from player list
    const playerData = e.dataTransfer.getData('player');
    if (playerData) {
      try {
        const player = JSON.parse(playerData) as Player;
        handlePlayerAssignment(targetSlotIndex, player);
        return;
      } catch (err) {
        console.error('Failed to parse player data:', err);
      }
    }
    
    // Handle player dropped from another slot
    const sourceSlotIndex = e.dataTransfer.getData('slotIndex');
    if (sourceSlotIndex) {
      const sourceIndex = parseInt(sourceSlotIndex, 10);
      const newLineup = [...lineup];
      
      // Swap players between slots
      const temp = newLineup[sourceIndex].player;
      newLineup[sourceIndex].player = newLineup[targetSlotIndex].player;
      newLineup[targetSlotIndex].player = temp;
      
      setLineup(newLineup);
    }
  };

  const handleResetLineup = () => {
    const resetLineup = lineup.map(slot => ({...slot, player: null}));
    setLineup(resetLineup);
    toast({
      title: "Escalação reiniciada",
      description: "Todos os jogadores foram removidos da escalação."
    });
  };

  const handleSaveLineup = () => {
    // In the future, this will save to a database
    toast({
      title: "Escalação salva!",
      description: "Sua escalação foi salva com sucesso."
    });
  };

  const handleShareLineup = () => {
    // Future functionality: generate a shareable link/image
    toast({
      title: "Compartilhar escalação",
      description: "Funcionalidade em desenvolvimento."
    });
  };

  const handlePredictionSubmit = (name: string, lineup: LineupSlot[]) => {
    // In the future, this would save to a database
    console.log('Prediction submitted:', { name, lineup });
    
    // Show leaderboard after submission
    setShowLeaderboard(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-figueira-black mb-3">Escalação da Galera</h1>
        
        {/* User name input moved to the top */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-2 flex items-center">
            <User className="mr-2 h-5 w-5" /> 
            Identificação do Torcedor
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Digite seu nome..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            <div className="w-full md:w-1/2 text-sm text-amber-800">
              Acerte a escalação do técnico para o próximo jogo e apareça no ranking!
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Monte a escalação do Figueirense que você acha que o técnico vai usar no próximo jogo! 
          Escolha o esquema tático, posicione os jogadores e envie seu palpite.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Formation selection and controls */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Esquema Tático</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormationSelector 
                    currentFormation={formation} 
                    onFormationChange={(newFormation) => setFormation(newFormation)} 
                  />
                  
                  <div className="flex flex-col space-y-3 mt-6">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center text-sm text-amber-700 mb-4">
                      <MoveHorizontal className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Arraste os jogadores para mudar suas posições no campo!</span>
                    </div>
                  
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleResetLineup}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reiniciar Escalação
                    </Button>
                    
                    <Button 
                      className="w-full bg-figueira-black hover:bg-figueira-black/90" 
                      onClick={handleSaveLineup}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Escalação
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleShareLineup}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <PredictionSubmission 
                lineup={lineup}
                onSubmit={(_, lineupSubmit) => handlePredictionSubmit(userName, lineupSubmit)}
              />
            </div>
          </div>
          
          {/* Middle column - Field visualization */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Campo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-b from-green-500 to-green-600 w-full h-[500px] rounded-lg overflow-hidden border-4 border-white shadow-md">
                  {/* Field markings - prettier design */}
                  <div className="absolute w-full h-full border-2 border-white/70"></div>
                  
                  {/* Center circle */}
                  <div className="absolute rounded-full w-[20%] h-[20%] border-2 border-white/70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute rounded-full w-4 h-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/70"></div>
                  
                  {/* Center line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-white/70"></div>
                  
                  {/* Penalty areas */}
                  <div className="absolute w-[60%] h-[25%] left-[20%] bottom-0 border-2 border-white/70"></div>
                  <div className="absolute w-[20%] h-[10%] left-[40%] bottom-0 border-2 border-white/70"></div>
                  <div className="absolute w-[60%] h-[25%] left-[20%] top-0 border-2 border-white/70"></div>
                  <div className="absolute w-[20%] h-[10%] left-[40%] top-0 border-2 border-white/70"></div>
                  
                  {/* Goal areas */}
                  <div className="absolute w-[40%] h-[10%] left-[30%] bottom-0 border-2 border-white/70"></div>
                  <div className="absolute w-[40%] h-[10%] left-[30%] top-0 border-2 border-white/70"></div>
                  
                  {/* Corner arcs */}
                  <div className="absolute w-6 h-6 top-0 left-0 border-r-2 border-white/70 rounded-br-full"></div>
                  <div className="absolute w-6 h-6 top-0 right-0 border-l-2 border-white/70 rounded-bl-full"></div>
                  <div className="absolute w-6 h-6 bottom-0 left-0 border-r-2 border-white/70 rounded-tr-full"></div>
                  <div className="absolute w-6 h-6 bottom-0 right-0 border-l-2 border-white/70 rounded-tl-full"></div>
                  
                  {/* Grass pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-white/20"
                        style={{ top: `${i * 10}%` }}
                      ></div>
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={`v-${i}`} 
                        className="absolute h-full border-l border-white/20"
                        style={{ left: `${i * 10}%` }}
                      ></div>
                    ))}
                  </div>

                  {/* Player positions */}
                  {lineup.map((slot, index) => (
                    <div 
                      key={index}
                      className={`absolute flex flex-col items-center -ml-10 -mt-10 w-20 h-20 transition-all ${
                        dragOverSlotIndex === index ? 'scale-110' : ''
                      }`}
                      style={{ 
                        left: `${slot.x}%`, 
                        top: `${slot.y}%` 
                      }}
                      draggable={!!slot.player}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div 
                        className={`flex items-center justify-center w-14 h-14 rounded-full ${
                          slot.player 
                            ? 'bg-figueira-black text-white cursor-grab shadow-lg active:cursor-grabbing hover:scale-105 transition-all duration-150' 
                            : 'bg-white/60 backdrop-blur-sm text-black/70 border-2 border-dashed border-black/30 cursor-pointer hover:bg-white/80 transition-colors'
                        } shadow-md`}
                        onClick={() => {
                          if (slot.player) {
                            handlePlayerAssignment(index, null);
                          }
                        }}
                      >
                        {slot.player ? (
                          <span className="font-bold text-lg">{slot.player.number}</span>
                        ) : (
                          <span className="text-xs font-medium">{slot.position}</span>
                        )}
                      </div>
                      {slot.player && (
                        <div className="mt-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md truncate max-w-full shadow">
                          {slot.player.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Player selection or Leaderboard */}
          <div className="lg:col-span-4">
            {showLeaderboard ? (
              <div className="space-y-4">
                <Leaderboard />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowLeaderboard(false)}
                >
                  Voltar para Seleção de Jogadores
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <PlayerSelection 
                  players={playerOptions} 
                  lineup={lineup}
                  onSelectPlayer={handlePlayerAssignment}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowLeaderboard(true)}
                >
                  Ver Ranking
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LineupBuilder;
