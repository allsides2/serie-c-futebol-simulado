
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineupSlot, Player } from '@/pages/LineupBuilder';
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Save, User } from "lucide-react";

interface PredictionSubmissionProps {
  lineup: LineupSlot[];
  onSubmit: (userName: string, lineup: LineupSlot[]) => void;
}

interface Prediction {
  id: number;
  userName: string;
  timestamp: string;
  accuracy?: number;
}

// Local storage for predictions (would be replaced by a database in the future)
const savePrediction = (userName: string, lineup: LineupSlot[]): void => {
  const predictions = JSON.parse(localStorage.getItem('predictions') || '[]');
  const newPrediction = {
    id: Date.now(),
    userName,
    timestamp: new Date().toISOString(),
    lineup: lineup.map(slot => ({ 
      position: slot.position, 
      playerId: slot.player?.id || null 
    }))
  };
  
  predictions.push(newPrediction);
  localStorage.setItem('predictions', JSON.stringify(predictions));
};

export const getPredictions = (): Prediction[] => {
  return JSON.parse(localStorage.getItem('predictions') || '[]');
};

const PredictionSubmission: React.FC<PredictionSubmissionProps> = ({ lineup, onSubmit }) => {
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  
  const handleSubmit = () => {
    if (!userName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite seu nome antes de enviar sua escalação.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all positions have players
    const emptyPositions = lineup.filter(slot => !slot.player);
    if (emptyPositions.length > 0) {
      toast({
        title: "Escalação incompleta",
        description: "Por favor, preencha todas as posições antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    // Save prediction
    savePrediction(userName, lineup);
    onSubmit(userName, lineup);
    
    toast({
      title: "Escalação enviada!",
      description: `Obrigado, ${userName}! Sua escalação foi registrada com sucesso.`,
    });
  };
  
  return (
    <Card className="border-2 border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-800">
          <Trophy className="mr-2 h-5 w-5" />
          Envie sua Escalação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              placeholder="Digite seu nome..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          
          <p className="text-sm text-amber-800">
            <strong>Acerte a escalação do técnico!</strong> Envie sua previsão para o próximo jogo e
            compita no ranking de quem mais acerta!
          </p>
          
          <Button 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white" 
            onClick={handleSubmit}
          >
            <Save className="mr-2 h-4 w-4" />
            Enviar Minha Escalação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionSubmission;
