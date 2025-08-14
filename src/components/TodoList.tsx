import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TodoItem {
  id: string;
  text: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  source: 'audio' | 'manual';
}

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (text: string, date: Date) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onRemove, onAdd }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const filterTodos = (todos: TodoItem[]) => {
    if (showCompleted) return todos;
    return todos.filter(todo => !todo.completed);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `${format(date, 'MMM d')} (Overdue)`;
    return format(date, 'MMM d, yyyy');
  };

  const groupedTodos = filterTodos(todos).reduce((groups, todo) => {
    const dateKey = isToday(todo.date) ? 'today' : 
                   isTomorrow(todo.date) ? 'tomorrow' :
                   isPast(todo.date) ? 'overdue' : 'upcoming';
    
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(todo);
    return groups;
  }, {} as Record<string, TodoItem[]>);

  return (
    <Card className="glass shadow-medium border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Smart To-Do List
            </CardTitle>
            <CardDescription>
              Tasks automatically extracted from your audio insights
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            className="border-white/20"
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedTodos).map(([group, todos]) => (
          <div key={group} className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {group === 'today' ? 'Today' : 
               group === 'tomorrow' ? 'Tomorrow' :
               group === 'overdue' ? 'Overdue' : 'Upcoming'}
              <Badge variant="secondary" className="ml-2">
                {todos.length}
              </Badge>
            </h4>
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-soft ${
                    todo.completed 
                      ? 'bg-muted/50 border-muted/30' 
                      : 'bg-card/50 border-border/50 hover:bg-card/80'
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      todo.completed 
                        ? 'text-muted-foreground line-through' 
                        : 'text-foreground'
                    }`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(todo.priority)}`}
                      >
                        {todo.priority}
                      </Badge>
                      {todo.source === 'audio' && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                          Auto-detected
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {getDateDisplay(todo.date)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(todo.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedTodos).length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {showCompleted 
                ? 'No completed tasks found' 
                : 'No pending tasks. Great job staying on top of things!'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;