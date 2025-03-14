
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Formation } from '@/pages/LineupBuilder';

interface FormationSelectorProps {
  currentFormation: Formation;
  onFormationChange: (formation: Formation) => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({ 
  currentFormation, 
  onFormationChange 
}) => {
  const formations: Formation[] = ['4-3-3', '4-4-2', '3-5-2', '3-4-3', '4-2-3-1'];
  
  return (
    <RadioGroup 
      value={currentFormation} 
      onValueChange={(value) => onFormationChange(value as Formation)}
      className="flex flex-col space-y-3"
    >
      {formations.map((formation) => (
        <div 
          key={formation} 
          className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-all ${
            currentFormation === formation ? 'border-figueira-black bg-figueira-black/5' : 'border-gray-200'
          }`}
          onClick={() => onFormationChange(formation)}
        >
          <RadioGroupItem value={formation} id={`formation-${formation}`} />
          <Label htmlFor={`formation-${formation}`} className="flex-1 cursor-pointer">
            <div className="font-medium">{formation}</div>
            <FormationVisual formation={formation} />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

const FormationVisual: React.FC<{ formation: Formation }> = ({ formation }) => {
  const getFormationDescription = (formation: Formation) => {
    switch (formation) {
      case '4-3-3':
        return "4 defensores, 3 meio-campistas, 3 atacantes";
      case '4-4-2':
        return "4 defensores, 4 meio-campistas, 2 atacantes";
      case '3-5-2':
        return "3 defensores, 5 meio-campistas, 2 atacantes";
      case '3-4-3':
        return "3 defensores, 4 meio-campistas, 3 atacantes";
      case '4-2-3-1':
        return "4 defensores, 5 meio-campistas, 1 atacante";
      default:
        return "";
    }
  };
  
  return (
    <div className="text-sm text-gray-500 mt-1">
      {getFormationDescription(formation)}
    </div>
  );
};

export default FormationSelector;
