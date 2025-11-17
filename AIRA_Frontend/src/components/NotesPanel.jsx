import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const sampleSummary = {
  title: 'Quantum Physics - Chapter 3',
  content: `**Key Concepts:**

• **Wave-Particle Duality**: Light and matter exhibit both wave and particle properties
• **Heisenberg Uncertainty Principle**: Cannot simultaneously know exact position and momentum
• **Quantum Superposition**: Particles exist in multiple states until observed

**Important Equations:**
- E = hf (Planck's equation)
- λ = h/p (de Broglie wavelength)

**Applications:**
- Quantum computing
- Laser technology
- Medical imaging (MRI)

**Study Tips:**
Focus on understanding the conceptual framework rather than memorizing formulas. Practice with thought experiments like Schrödinger's cat.`,
  citations: [
    'Griffiths, D. J. (2018). Introduction to Quantum Mechanics, Chapter 3',
    'Lecture Notes: Quantum Mechanics Fundamentals, Prof. Smith',
  ],
  timestamp: '2 hours ago',
};

export function NotesPanel({ className }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [summary, setSummary] = useState(sampleSummary);
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
        title: 'Files uploaded successfully!',
        description: `${validFiles.length} file(s) ready for summarization.`,
      });
      
      setTimeout(() => setUploadState('idle'), 3000);
    }, 2000);
  };

  const handleSummarize = () => {
    toast({
      title: '🚧 Feature Coming Soon!',
      description: 'AI summarization isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-l", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Note Summarization</h2>
        <p className="text-sm text-muted-foreground">Upload materials for AI-powered summaries</p>
      </div>

      <div className="p-4 space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            uploadState === 'success' && "border-green-500 bg-green-50 dark:bg-green-950"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {uploadState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop files here or</p>
                   <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload-notes"
                  />
                  <Button asChild variant="link" size="sm">
                    <label htmlFor="file-upload-notes" className="cursor-pointer">
                      click to upload
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, TXT supported</p>
                </div>
              </motion.div>
            )}

            {uploadState === 'uploading' && <motion.div key="uploading" className="space-y-3"><Loader2 className="mx-auto h-10 w-10 text-primary animate-spin" /><p className="text-sm font-medium">Uploading...</p></motion.div>}
            {uploadState === 'success' && <motion.div key="success" className="space-y-3"><CheckCircle className="mx-auto h-10 w-10 text-green-500" /><p className="text-sm font-medium text-green-700 dark:text-green-400">Files ready!</p></motion.div>}
            {uploadState === 'error' && <motion.div key="error" className="space-y-3"><AlertCircle className="mx-auto h-10 w-10 text-destructive" /><p className="text-sm font-medium text-destructive">Upload failed</p></motion.div>}
          </AnimatePresence>
        </div>

        <Button 
          onClick={handleSummarize}
          className="w-full" 
          disabled={uploadState === 'uploading'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Summarize Notes
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Latest Summary</h3>
            <span className="text-xs text-muted-foreground">{summary.timestamp}</span>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-primary">{summary.title}</h4>
            <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: summary.content.replace(/•/g, '<li>').replace(/\n- /g, '<li>- ') }}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Citations</h4>
            <div className="space-y-1">
              {summary.citations.map((citation, index) => (
                <p key={index} className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  {citation}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}