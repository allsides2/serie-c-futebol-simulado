
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import FormationSelector from "@/components/FormationSelector";
import PlayerSelection from "@/components/PlayerSelection";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Temporary player data until we have a database
const playerOptions = [
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
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);

  // Initialize lineup based on formation
  React.useEffect(() => {
    let newLineup: LineupSlot[] = [];
    
    switch(formation) {
      case '4-3-3':
        newLineup = [
          { position: 'GOL', player: null, x: 50, y: 90 },
          { position: 'ZAG', player: null, x: 30, y: 70 },
          { position: 'ZAG', player: null, x: 70, y: 70 },
          { position: 'LAD', player: null, x: 10, y: 70 },
          { position: 'LAE', player: null, x: 90, y: 70 },
          { position: 'VOL', player: null, x: 30, y: 50 },
          { position: 'VOL', player: null, x: 70, y: 50 },
          { position: 'MEI', player: null, x: 50, y: 40 },
          { position: 'ATA', player: null, x: 30, y: 20 },
          { position: 'ATA', player: null, x: 70, y: 20 },
          { position: 'ATA', player: null, x: 50, y: 10 }
        ];
        break;
      case '4-4-2':
        newLineup = [
          { position: 'GOL', player: null, x: 50, y: 90 },
          { position: 'ZAG', player: null, x: 30, y: 70 },
          { position: 'ZAG', player: null, x: 70, y: 70 },
          { position: 'LAD', player: null, x: 10, y: 70 },
          { position: 'LAE', player: null, x: 90, y: 70 },
          { position: 'VOL', player: null, x: 30, y: 50 },
          { position: 'VOL', player: null, x: 70, y: 50 },
          { position: 'MEI', player: null, x: 30, y: 30 },
          { position: 'MEI', player: null, x: 70, y: 30 },
          { position: 'ATA', player: null, x: 30, y: 10 },
          { position: 'ATA', player: null, x: 70, y: 10 }
        ];
        break;
      case '3-5-2':
        newLineup = [
          { position: 'GOL', player: null, x: 50, y: 90 },
          { position: 'ZAG', player: null, x: 30, y: 70 },
          { position: 'ZAG', player: null, x: 50, y: 70 },
          { position: 'ZAG', player: null, x: 70, y: 70 },
          { position: 'LAD', player: null, x: 10, y: 50 },
          { position: 'LAE', player: null, x: 90, y: 50 },
          { position: 'VOL', player: null, x: 50, y: 50 },
          { position: 'MEI', player: null, x: 30, y: 30 },
          { position: 'MEI', player: null, x: 70, y: 30 },
          { position: 'ATA', player: null, x: 30, y: 10 },
          { position: 'ATA', player: null, x: 70, y: 10 }
        ];
        break;
      case '3-4-3':
        newLineup = [
          { position: 'GOL', player: null, x: 50, y: 90 },
          { position: 'ZAG', player: null, x: 30, y: 70 },
          { position: 'ZAG', player: null, x: 50, y: 70 },
          { position: 'ZAG', player: null, x: 70, y: 70 },
          { position: 'LAD', player: null, x: 20, y: 50 },
          { position: 'LAE', player: null, x: 80, y: 50 },
          { position: 'VOL', player: null, x: 40, y: 50 },
          { position: 'VOL', player: null, x: 60, y: 50 },
          { position: 'ATA', player: null, x: 20, y: 20 },
          { position: 'ATA', player: null, x: 50, y: 10 },
          { position: 'ATA', player: null, x: 80, y: 20 }
        ];
        break;
      case '4-2-3-1':
        newLineup = [
          { position: 'GOL', player: null, x: 50, y: 90 },
          { position: 'ZAG', player: null, x: 30, y: 70 },
          { position: 'ZAG', player: null, x: 70, y: 70 },
          { position: 'LAD', player: null, x: 10, y: 70 },
          { position: 'LAE', player: null, x: 90, y: 70 },
          { position: 'VOL', player: null, x: 30, y: 50 },
          { position: 'VOL', player: null, x: 70, y: 50 },
          { position: 'MEI', player: null, x: 30, y: 30 },
          { position: 'MEI', player: null, x: 70, y: 30 },
          { position: 'MEI', player: null, x: 50, y: 20 },
          { position: 'ATA', player: null, x: 50, y: 10 }
        ];
        break;
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-figueira-black mb-6">Escalação da Galera</h1>
        <p className="text-gray-600 mb-8">
          Monte sua escalação ideal para o Figueirense! Escolha o esquema tático e arraste os jogadores para as posições desejadas.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Formation selection and controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Esquema Tático</CardTitle>
              </CardHeader>
              <CardContent>
                <FormationSelector 
                  currentFormation={formation} 
                  onFormationChange={setFormation} 
                />
                
                <div className="flex flex-col space-y-3 mt-6">
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
          </div>
          
          {/* Middle column - Field visualization */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Campo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-green-600 w-full h-[500px] rounded-lg overflow-hidden border-4 border-white">
                  {/* Field markings */}
                  <div className="absolute w-full h-full border-2 border-white/50"></div>
                  <div className="absolute top-[28%] left-0 right-0 h-[44%] border-2 border-white/50"></div>
                  <div className="absolute w-[20%] h-[10%] top-0 left-[40%] border-b-2 border-white/50"></div>
                  <div className="absolute w-[20%] h-[10%] bottom-0 left-[40%] border-t-2 border-white/50"></div>
                  <div className="absolute w-[60%] h-[30%] left-[20%] bottom-0 border-2 border-white/50"></div>
                  <div className="absolute w-[40%] h-[15%] left-[30%] bottom-0 border-2 border-white/50"></div>
                  <div className="absolute w-[60%] h-[30%] left-[20%] top-0 border-2 border-white/50"></div>
                  <div className="absolute w-[40%] h-[15%] left-[30%] top-0 border-2 border-white/50"></div>
                  <div className="absolute rounded-full w-4 h-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/50"></div>
                  
                  {/* Player positions */}
                  {lineup.map((slot, index) => (
                    <div 
                      key={index}
                      className="absolute flex flex-col items-center -ml-10 -mt-10 w-20 h-20"
                      style={{ 
                        left: `${slot.x}%`, 
                        top: `${slot.y}%` 
                      }}
                    >
                      <div 
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          slot.player ? 'bg-figueira-black text-white' : 'bg-gray-300 text-gray-600'
                        } border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-110`}
                        onClick={() => {
                          if (slot.player) {
                            handlePlayerAssignment(index, null);
                          }
                        }}
                      >
                        {slot.player ? (
                          <span className="font-bold">{slot.player.number}</span>
                        ) : (
                          <span>{slot.position}</span>
                        )}
                      </div>
                      {slot.player && (
                        <div className="mt-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded truncate max-w-full">
                          {slot.player.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Player selection */}
          <div className="lg:col-span-1">
            <PlayerSelection 
              players={playerOptions} 
              lineup={lineup}
              onSelectPlayer={handlePlayerAssignment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LineupBuilder;
