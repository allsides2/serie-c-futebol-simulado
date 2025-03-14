
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered, Medal, Calendar } from "lucide-react";
import { getPredictions } from './PredictionSubmission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userName}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      index < 3 ? 'bg-gray-50 border border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                        index < 3 ? 'bg-gray-100' : ''
                      }`}>
                        {index < 3 ? (
                          <Medal className={`h-4 w-4 ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className="font-medium">{entry.userName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{entry.score}</span> pts 
                      <span className="text-gray-500 ml-2">({entry.predictions} palpites)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rounds">
            <div className="mb-4">
              <select 
                className="w-full p-2 rounded-md border border-gray-300"
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
              >
                <option value="all">Todas as Rodadas</option>
                {rounds.map(round => (
                  <option key={round.id} value={round.id.toString()}>
                    {round.name} ({new Date(round.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {selectedRound === "all" 
                  ? "Exibindo ranking geral de todas as rodadas" 
                  : `Exibindo ranking da Rodada ${selectedRound}`}
              </span>
            </div>
            
            {/* Same leaderboard display logic as above */}
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum palpite registrado para esta rodada.
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userName}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      index < 3 ? 'bg-gray-50 border border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                        index < 3 ? 'bg-gray-100' : ''
                      }`}>
                        {index < 3 ? (
                          <Medal className={`h-4 w-4 ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className="font-medium">{entry.userName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{entry.score}</span> pts
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
