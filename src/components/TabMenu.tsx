
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFootball } from '@/context/FootballContext';
import GroupStage from './GroupStage';
import KnockoutStage from './KnockoutStage';

const TabMenu = () => {
  const { getCurrentStage } = useFootball();
  const [activeTab, setActiveTab] = useState<string>("group");
  
  // Auto-switch to knockout when it becomes available
  if (getCurrentStage() === 'KNOCKOUT' && activeTab === 'group') {
    setActiveTab('knockout');
  }
  
  return (
    <div className="container mx-auto mt-4 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="group" className="text-lg font-medium">
            Fase de Grupos
          </TabsTrigger>
          <TabsTrigger 
            value="knockout" 
            className="text-lg font-medium"
            disabled={getCurrentStage() === 'GROUP'}
          >
            Mata-Mata
          </TabsTrigger>
        </TabsList>
        <TabsContent value="group" className="mt-4">
          <GroupStage />
        </TabsContent>
        <TabsContent value="knockout" className="mt-4">
          <KnockoutStage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabMenu;
