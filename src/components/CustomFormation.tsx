
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateCustomFormation } from '@/utils/playerUtils';
import { Formation } from '@/pages/LineupBuilder';
import { AlertCircle, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CustomFormationProps {
  onFormationSubmit: (formation: string) => void;
}

const CustomFormation: React.FC<CustomFormationProps> = ({ onFormationSubmit }) => {
  const { toast } = useToast();
  const [customFormation, setCustomFormation] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  const validateInput = (input: string) => {
    setCustomFormation(input);
    if (input.length === 0) {
      setIsValid(null);
      return;
    }
    setIsValid(validateCustomFormation(input));
  };
  
  const handleSubmit = () => {
    if (isValid) {
      onFormationSubmit(customFormation);
      toast({
        title: "Esquema tático personalizado",
        description: `Esquema ${customFormation} aplicado com sucesso!`,
      });
    } else {
      toast({
        title: "Esquema inválido",
        description: "O esquema deve ser no formato X-X-X e somar 10 jogadores (ex: 4-3-3)",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Ex: 4-3-3"
            value={customFormation}
            onChange={(e) => validateInput(e.target.value)}
            className={`pr-8 ${
              isValid === true ? 'border-green-500' : 
              isValid === false ? 'border-red-500' : ''
            }`}
          />
          {isValid !== null && (
            <div className="absolute right-2 top-2.5">
              {isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid}
          className="bg-figueira-black hover:bg-figueira-black/90"
        >
          Aplicar
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Digite um esquema no formato X-X-X que some 10 jogadores. Ex: 4-3-3, 3-5-2, etc.
      </p>
    </div>
  );
};

export default CustomFormation;
