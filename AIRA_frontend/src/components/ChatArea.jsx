import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload, Copy, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const sampleMessages = [
  {
    id: '1',
    type: 'user',
    content: 'Can you explain the concept of quantum entanglement?',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '2',
    type: 'ai',
    content: 'Quantum entanglement is a fascinating phenomenon in quantum physics where two or more particles become interconnected in such a way that the quantum state of each particle cannot be described independently. When particles are entangled, measuring one particle instantly affects the other, regardless of the distance between them.\n\nKey points about quantum entanglement:\n\n1. **Non-locality**: The effect occurs instantaneously across any distance\n2. **Correlation**: Entangled particles share correlated properties\n3. **Measurement**: Observing one particle determines the state of its partner\n\nThis phenomenon has practical applications in quantum computing, cryptography, and teleportation experiments.',
    timestamp: new Date(Date.now() - 3590000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export function ChatArea({ className }) {
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your question! However, this is a demo version. In the full implementation, I would process your query using advanced AI models to provide detailed, accurate responses tailored to your learning needs.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Message copied to clipboard.',
    });
  };

  const handleUpload = () => {
    toast({
      title: '🚧 Feature Coming Soon!',
      description: 'File upload isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex gap-3 max-w-4xl",
                message.type === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={cn(
                "flex flex-col gap-1 max-w-[80%]",
                message.type === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "rounded-lg px-4 py-2 text-sm whitespace-pre-wrap shadow-md",
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}>
                  {message.content}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{message.timestamp}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mr-auto max-w-4xl"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-background">
        <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="min-h-[60px] max-h-32 resize-none pr-24"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleUpload}
                    >
                    <Upload className="h-4 w-4" />
                </Button>
                <Button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-8 w-8"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Shift+Enter for new line. AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}