import { parseISO, parse, isValid, addDays, startOfDay } from 'date-fns';

export interface ExtractedTask {
  id: string;
  text: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  source: 'audio';
  completed: boolean;
}

// Common date patterns and keywords
const DATE_PATTERNS = [
  // Specific dates
  /(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/gi,
  /(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/gi,
  /(?:on\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})/g,
  /(?:on\s+)?(\d{4})-(\d{1,2})-(\d{1,2})/g,
  
  // Relative dates
  /\b(today|tomorrow|next\s+week|next\s+month)\b/gi,
  /\bin\s+(\d+)\s+(days?|weeks?|months?)\b/gi,
  
  // Days of week
  /(?:on\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
  /(?:this\s+|next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
];

// Priority keywords
const PRIORITY_KEYWORDS = {
  high: ['urgent', 'asap', 'immediately', 'critical', 'important', 'deadline', 'due'],
  medium: ['soon', 'priority', 'should', 'need to', 'must'],
  low: ['when possible', 'eventually', 'someday', 'maybe', 'consider']
};

// Task action keywords
const TASK_KEYWORDS = [
  'meeting', 'call', 'appointment', 'presentation', 'review', 'submit', 'complete',
  'finish', 'send', 'email', 'follow up', 'prepare', 'plan', 'schedule', 'book',
  'buy', 'purchase', 'order', 'contact', 'visit', 'attend', 'join', 'deliver',
  'create', 'write', 'draft', 'design', 'develop', 'test', 'fix', 'update'
];

function parseRelativeDate(dateStr: string): Date | null {
  const today = startOfDay(new Date());
  const lowerStr = dateStr.toLowerCase();
  
  if (lowerStr === 'today') return today;
  if (lowerStr === 'tomorrow') return addDays(today, 1);
  
  // Parse "in X days/weeks/months"
  const inMatch = lowerStr.match(/in\s+(\d+)\s+(days?|weeks?|months?)/);
  if (inMatch) {
    const amount = parseInt(inMatch[1]);
    const unit = inMatch[2];
    
    if (unit.startsWith('day')) return addDays(today, amount);
    if (unit.startsWith('week')) return addDays(today, amount * 7);
    if (unit.startsWith('month')) return addDays(today, amount * 30); // Approximate
  }
  
  return null;
}

function parseSpecificDate(dateStr: string): Date | null {
  // Try various date formats
  const formats = [
    'dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd',
    'd MMMM yyyy', 'd MMM yyyy',
    'MMMM d yyyy', 'MMM d yyyy'
  ];
  
  for (const format of formats) {
    try {
      const parsed = parse(dateStr, format, new Date());
      if (isValid(parsed)) return parsed;
    } catch (e) {
      continue;
    }
  }
  
  return null;
}

function extractDateFromText(text: string): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  
  for (const pattern of DATE_PATTERNS) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matchText = match[0];
      
      // Try relative date first
      let date = parseRelativeDate(matchText);
      
      // If not relative, try specific date
      if (!date) {
        date = parseSpecificDate(matchText);
      }
      
      // If still no date, try to construct from parts
      if (!date && match.length > 3) {
        try {
          const year = parseInt(match[3]);
          const month = parseInt(match[2]) - 1; // JS months are 0-based
          const day = parseInt(match[1]);
          date = new Date(year, month, day);
        } catch (e) {
          continue;
        }
      }
      
      if (date && isValid(date) && date >= today) {
        dates.push(startOfDay(date));
      }
    }
  }
  
  return dates;
}

function determinePriority(text: string): 'low' | 'medium' | 'high' {
  const lowerText = text.toLowerCase();
  
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return priority as 'low' | 'medium' | 'high';
    }
  }
  
  return 'medium'; // default priority
}

function extractTasksFromSentence(sentence: string, dates: Date[]): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const lowerSentence = sentence.toLowerCase();
  
  // Check if sentence contains task-related keywords
  const hasTaskKeywords = TASK_KEYWORDS.some(keyword => 
    lowerSentence.includes(keyword)
  );
  
  // Look for action patterns
  const actionPatterns = [
    /i\s+(need to|have to|must|will|should|plan to)\s+([^.!?]+)/gi,
    /i'm\s+(going to|planning to|scheduling)\s+([^.!?]+)/gi,
    /(meeting|call|appointment|presentation)\s+([^.!?]+)/gi,
    /(review|complete|finish|submit|send)\s+([^.!?]+)/gi,
  ];
  
  if (hasTaskKeywords || actionPatterns.some(pattern => pattern.test(sentence))) {
    const priority = determinePriority(sentence);
    const defaultDate = dates.length > 0 ? dates[0] : addDays(new Date(), 1);
    
    // If specific dates are mentioned, create tasks for each date
    if (dates.length > 0) {
      dates.forEach(date => {
        tasks.push({
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: sentence.trim(),
          date: startOfDay(date),
          priority,
          source: 'audio',
          completed: false
        });
      });
    } else {
      // Create a general task for tomorrow if no specific date
      tasks.push({
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: sentence.trim(),
        date: defaultDate,
        priority,
        source: 'audio',
        completed: false
      });
    }
  }
  
  return tasks;
}

export function extractTasksFromTranscription(transcription: string): ExtractedTask[] {
  const allTasks: ExtractedTask[] = [];
  
  // Split into sentences
  const sentences = transcription
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (const sentence of sentences) {
    // Extract dates from this sentence
    const dates = extractDateFromText(sentence);
    
    // Extract tasks from this sentence
    const tasks = extractTasksFromSentence(sentence, dates);
    allTasks.push(...tasks);
  }
  
  return allTasks;
}

// Example usage:
// const transcription = "I have a meeting on 28th March 2025. Need to review the presentation tomorrow.";
// const tasks = extractTasksFromTranscription(transcription);