import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, FolderClock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const sampleChats = [
  { id: '1', title: 'Quantum Entanglement', timestamp: '2 hours ago' },
  { id: '2', title: 'Calculus Derivatives', timestamp: '1 day ago' },
  { id: '3', title: 'WWII History', timestamp: '3 days ago' },
];

export function Sidebar({ className, onNewChat, currentChatId }) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectChat = (chatId) => {
    // In a real app, this would change the chat content.
    // Here we just show a notification.
    toast({
      title: 'Switched Chat',
      description: `You are now viewing chat: ${sampleChats.find(c => c.id === chatId).title}`,
    });
     navigate(`/dashboard?chat=${chatId}`);
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn("flex flex-col h-full bg-card border-r", className)}
    >
      <div className="p-4 border-b">
        <Button 
          onClick={onNewChat}
          className="w-full" 
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-3">
          <FolderClock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Previous Chats</h3>
        </div>
        <div className="space-y-1">
          {sampleChats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-auto p-3",
                currentChatId === chat.id && "bg-accent"
              )}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="flex items-start w-full gap-3">
                <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                <div className="flex flex-col w-full truncate">
                    <span className="font-medium text-sm truncate">
                    {chat.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                    {chat.timestamp}
                    </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}