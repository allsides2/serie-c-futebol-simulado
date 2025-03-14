
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Formation } from '@/pages/LineupBuilder';
import CustomFormation from './CustomFormation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormationSelectorProps {
  currentFormation: Formation | string;
  onFormationChange: (formation: Formation | string) => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({ 
  currentFormation, 
  onFormationChange 
}) => {
  const formations: Formation[] = ['4-3-3', '4-4-2', '3-5-2', '3-4-3', '4-2-3-1'];
  const [activeTab, setActiveTab] = useState<string>("standard");
  
  const handleCustomFormation = (customFormation: string) => {
    onFormationChange(customFormation);
  };
  
  return (
    <Tabs 
      defaultValue="standard" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-4 w-full grid grid-cols-2">
        <TabsTrigger value="standard">Padrão</TabsTrigger>
        <TabsTrigger value="custom">Personalizado</TabsTrigger>
      </TabsList>
      
      <TabsContent value="standard">
        <RadioGroup 
          value={currentFormation as string}
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
      </TabsContent>
      
      <TabsContent value="custom">
        <div className="p-4 border rounded-md mb-4">
          <h3 className="text-sm font-medium mb-2">Esquema Atual: {currentFormation}</h3>
          <CustomFormation onFormationSubmit={handleCustomFormation} />
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          <p className="mb-2">Dicas para esquemas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Primeiro número: Defensores</li>
            <li>Segundo número: Meio-campistas</li>
            <li>Terceiro número: Atacantes</li>
            <li>A soma deve ser 10 (goleiro não conta)</li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const FormationVisual: React.FC<{ formation: Formation | string }> = ({ formation }) => {
  const getFormationDescription = (formation: Formation | string) => {
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
        const parts = formation.split('-');
        if (parts.length === 3) {
          return `${parts[0]} defensores, ${parts[1]} meio-campistas, ${parts[2]} atacantes`;
        }
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
