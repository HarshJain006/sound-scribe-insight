import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, List, Grid } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';

interface CalendarTask {
  id: string;
  text: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CalendarViewProps {
  tasks: CalendarTask[];
  onTaskSelect?: (task: CalendarTask) => void;
  onDateSelect?: (date: Date) => void;
}

type ViewMode = 'month' | 'week' | 'day';

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskSelect, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get complete calendar grid (6 weeks = 42 days) including adjacent month days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-primary';
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDatePickerSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setSelectedDate(date);
      onDateSelect?.(date);
      setIsDatePickerOpen(false);
    }
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Calendar Section */}
      <Card className="glass shadow-medium border-white/20 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-left justify-start p-2 h-auto">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-auto p-6">
                <DialogHeader>
                  <DialogTitle>Select Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={selectedDate || currentDate}
                  onSelect={handleDatePickerSelect}
                  initialFocus
                  className="rounded-md border"
                />
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTodayClick}
                className="border-white/20"
              >
                Today
              </Button>
              <div className="flex items-center border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="hover:bg-muted/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Today
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                Has Tasks
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="hover:bg-muted/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map(day => {
              const dayTasks = getTasksForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isDayToday = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    group aspect-square p-2 rounded-lg border text-center text-sm cursor-pointer 
                    transition-all duration-300 hover:scale-110 hover:shadow-soft hover:-translate-y-1
                    transform-gpu will-change-transform
                    ${!isCurrentMonth 
                      ? 'text-muted-foreground/50 bg-muted/20 border-border/10' 
                      : isDayToday 
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow animate-pulse' 
                        : isSelected
                          ? 'bg-accent text-accent-foreground border-accent scale-105 shadow-medium'
                          : dayTasks.length > 0
                            ? 'bg-muted border-border hover:bg-muted/80 hover:border-primary/50'
                            : 'bg-card/50 border-border/30 hover:bg-card/80 hover:border-accent/30'
                    }
                  `}
                >
                  <div className={`font-medium group-hover:scale-110 transition-transform duration-200 ${!isCurrentMonth ? 'opacity-50' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((task, index) => (
                        <div 
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${getPriorityColor(task.priority)}`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground transition-opacity group-hover:opacity-100 opacity-75">
                          +{dayTasks.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task Details Section */}
      <Card className="glass shadow-medium border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" />
            {selectedDate 
              ? `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}`
              : 'Select a date to view tasks'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-3">
              {selectedDateTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => onTaskSelect?.(task)}
                  className={`
                    group p-4 rounded-lg border cursor-pointer transition-all duration-300 
                    hover:shadow-soft hover:scale-102 hover:-translate-y-1 transform-gpu
                    ${task.completed 
                      ? 'bg-muted/50 border-muted/30 opacity-75' 
                      : 'bg-card/50 border-border/50 hover:bg-card/80 hover:border-primary/30'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 transition-all duration-300 group-hover:scale-125 group-hover:shadow-soft ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium transition-colors duration-200 ${
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground group-hover:text-primary'
                      }`}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            task.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            task.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-success/10 text-success border-success/20'
                          }`}
                        >
                          {task.priority} priority
                        </Badge>
                        {task.completed && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No tasks scheduled for this date
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Click on a date to view its tasks
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;