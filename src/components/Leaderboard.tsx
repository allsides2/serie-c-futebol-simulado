
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered, Medal, Calendar, TrendingUp, ChevronDown } from "lucide-react";
import { getPredictions } from './PredictionSubmission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeaderboardEntry {
  userName: string;
  score: number;
  predictions: number;
}

// Mock data for leaderboard (would be replaced by actual data from database)
const generateLeaderboard = (): LeaderboardEntry[] => {
  const storedPredictions = getPredictions();
  
  // Group by userName and count predictions
  const userStats = storedPredictions.reduce((acc: Record<string, LeaderboardEntry>, prediction) => {
    if (!acc[prediction.userName]) {
      acc[prediction.userName] = {
        userName: prediction.userName,
        score: Math.floor(Math.random() * 100), // Mock score, would be replaced by actual calculation
        predictions: 0
      };
    }
    acc[prediction.userName].predictions++;
    return acc;
  }, {});
  
  return Object.values(userStats).sort((a, b) => b.score - a.score);
};

// For demo purposes, create some random rounds
const rounds = [
  { id: 1, name: "Rodada 1", date: "2023-08-01" },
  { id: 2, name: "Rodada 2", date: "2023-08-08" },
  { id: 3, name: "Rodada 3", date: "2023-08-15" },
  { id: 4, name: "Rodada 4 (atual)", date: "2023-08-22" },
];

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>("all");
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setLeaderboard(generateLeaderboard());
    
    // Set up listener for new predictions
    const handleStorageChange = () => {
      setLeaderboard(generateLeaderboard());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const getMedalColor = (index: number): string => {
    switch(index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-amber-700";
      default: return "text-gray-500";
    }
  };

  const getPositionBackground = (index: number): string => {
    switch(index) {
      case 0: return "bg-yellow-100";
      case 1: return "bg-gray-100";
      case 2: return "bg-amber-100";
      default: return index % 2 === 0 ? "bg-white" : "bg-gray-50";
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListOrdered className="mr-2 h-5 w-5" />
          Ranking de Palpites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="all">Geral</TabsTrigger>
            <TabsTrigger value="rounds">Por Rodada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum palpite registrado ainda. Seja o primeiro!
              </div>
            ) : (
              <div className="rounded-md overflow-hidden border border-gray-200">
                <div className="bg-gray-100 p-2 font-medium text-sm grid grid-cols-12">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-6">Torcedor</div>
                  <div className="col-span-3 text-right">Pontos</div>
                  <div className="col-span-2 text-right">Palpites</div>
                </div>
                
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userName}
                    className={`grid grid-cols-12 p-2 items-center ${getPositionBackground(index)}`}
                  >
                    <div className="col-span-1 flex justify-center">
                      {index < 3 ? (
                        <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-6 font-medium truncate">{entry.userName}</div>
                    <div className="col-span-3 text-right font-bold flex items-center justify-end">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      {entry.score}
                    </div>
                    <div className="col-span-2 text-right text-gray-500 text-sm">
                      {entry.predictions}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rounds">
            <div className="mb-4">
              <Select 
                value={selectedRound} 
                onValueChange={setSelectedRound}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Selecione uma rodada" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Rodadas</SelectItem>
                  {rounds.map(round => (
                    <SelectItem key={round.id} value={round.id.toString()}>
                      {round.name} ({new Date(round.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">
                {selectedRound === "all" 
                  ? "Ranking geral de todas as rodadas" 
                  : `Ranking da Rodada ${selectedRound}`}
              </span>
            </div>
            
            {/* Same leaderboard display logic as above */}
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum palpite registrado para esta rodada.
              </div>
            ) : (
              <div className="rounded-md overflow-hidden border border-gray-200">
                <div className="bg-gray-100 p-2 font-medium text-sm grid grid-cols-12">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-7">Torcedor</div>
                  <div className="col-span-4 text-right">Pontos</div>
                </div>
                
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userName}
                    className={`grid grid-cols-12 p-2 items-center ${getPositionBackground(index)}`}
                  >
                    <div className="col-span-1 flex justify-center">
                      {index < 3 ? (
                        <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-7 font-medium truncate">{entry.userName}</div>
                    <div className="col-span-4 text-right font-bold flex items-center justify-end">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
