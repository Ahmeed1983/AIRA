import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText, FolderClock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'history', label: 'History', icon: FolderClock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-10">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "flex-1 h-16 rounded-none flex-col gap-1 text-muted-foreground",
                activeTab === tab.id ? 'text-primary bg-primary/10' : ''
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}