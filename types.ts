
export type SectionId = 
  | 'intro' 
  | 'prompt-engineering' 
  | 'model-config' 
  | 'structured-output' 
  | 'function-calling' 
  | 'grounding' 
  | 'playground'
  | 'showcase';

export interface TutorialSection {
  id: SectionId;
  title: string;
  icon: string;
  description: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  description: string;
  model: string;
  config: {
    temperature: number;
    topP: number;
    topK: number;
  };
  systemInstruction?: string;
  prompt: string;
  output: string;
  tags: string[];
  comments: Comment[];
}

export interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
}
