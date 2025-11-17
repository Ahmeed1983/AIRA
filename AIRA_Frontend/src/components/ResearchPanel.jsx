import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle, Book, Quote, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const sampleCitations = [
    {
        id: 1,
        text: 'Einstein, A., Podolsky, B., & Rosen, N. (1935). Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?. Physical Review, 47(10), 777–780.',
        style: 'APA'
    },
    {
        id: 2,
        text: 'Schrödinger, E. (1935). Die gegenwärtige Situation in der Quantenmechanik. Naturwissenschaften, 23(48), 807-812.',
        style: 'Chicago'
    }
];

export function ResearchPanel({ className }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [citations, setCitations] = useState(sampleCitations);
  const { toast } = useToast();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, DOCX, or TXT files only.',
        variant: 'destructive',
      });
      return;
    }

    setUploadState('uploading');
    
    setTimeout(() => {
      setUploadState('success');
      toast({
        title: 'Sources uploaded!',
        description: `${validFiles.length} source(s) ready for citation.`,
      });
      
      setTimeout(() => setUploadState('idle'), 3000);
    }, 2000);
  };

  const handleCite = () => {
    toast({
      title: '🚧 Feature Coming Soon!',
      description: 'AI citation generation isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  const copyCitation = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Citation copied to clipboard.',
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-l", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Research Assistant</h2>
        <p className="text-sm text-muted-foreground">Upload sources to find info and generate citations</p>
      </div>

      <div className="p-4 space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            uploadState === 'success' && "border-green-500 bg-green-50 dark:bg-green-950"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {uploadState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop your sources here</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, TXT files</p>
                </div>
                <input type="file" multiple accept=".pdf,.docx,.txt" onChange={handleFileInput} className="hidden" id="file-upload" />
                <Button asChild variant="outline" size="sm"><label htmlFor="file-upload" className="cursor-pointer">Choose Files</label></Button>
              </motion.div>
            )}
            {uploadState === 'uploading' && (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <p className="text-sm font-medium">Processing sources...</p>
              </motion.div>
            )}
            {uploadState === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Sources ready!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button onClick={handleCite} className="w-full" disabled={uploadState === 'uploading'}>
          <Quote className="mr-2 h-4 w-4" /> Generate Citations
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Generated Citations</h3>
          </div>
          {citations.length > 0 ? (
            <div className="space-y-3">
              {citations.map((citation) => (
                <div key={citation.id} className="bg-muted/50 rounded-lg p-3 text-xs relative group">
                  <p className="pr-8">{citation.text}</p>
                  <span className="absolute top-1 right-1 text-xxs bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">{citation.style}</span>
                  <Button variant="ghost" size="icon" className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => copyCitation(citation.text)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              <p>Upload a source and click "Generate Citations" to get started.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}