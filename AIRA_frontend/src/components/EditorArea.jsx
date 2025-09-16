import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send, Bot, Sparkles, Pilcrow, CaseSensitive, Repeat, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const sampleDocument = `## The Intricacies of Quantum Entanglement

Quantum entanglement is a physical phenomenon that occurs when a pair or group of particles is generated, interacts, or shares spatial proximity in such a way that the quantum state of each particle of the pair or group cannot be described independently of the state of the others, including when the particles are separated by a large distance.

### Historical Context
The concept was a subject of a 1935 paper by Albert Einstein, Boris Podolsky, and Nathan Rosen, and several papers by Erwin Schrödinger shortly thereafter, describing what came to be known as the EPR paradox. Einstein and others considered such behavior to be impossible, as it violated the local realist view of causality.
`;

export function EditorArea({ className }) {
  const [documentText, setDocumentText] = useState(sampleDocument);
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCommand = async () => {
    if (!command.trim()) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'AI Assistant Responded',
        description: 'In a real app, the AI would now modify your document based on your command. This is a demo.',
      });
      setCommand('');
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    toast({
      title: `🚧 ${action} Feature Coming Soon!`,
      description: 'This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Document Editor</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('Improve')}>
            <Sparkles className="mr-2 h-4 w-4" /> Improve
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('Shorten')}>
            <Pilcrow className="mr-2 h-4 w-4" /> Shorten
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('Expand')}>
            <CaseSensitive className="mr-2 h-4 w-4" /> Expand
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('Rewrite')}>
            <Repeat className="mr-2 h-4 w-4" /> Rewrite
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder="Start writing your paper here..."
          className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-base leading-relaxed"
        />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative flex items-center">
            <Bot className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
              placeholder="Ask AI to write, edit, or brainstorm..."
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleCommand} 
            disabled={!command.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Example: "Expand on the historical context section" or "Find sources for the EPR paradox"
        </p>
      </div>
    </div>
  );
}