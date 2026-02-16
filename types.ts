
export interface Module {
  id: number;
  title: string;
  description: string;
  topics: string[];
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
