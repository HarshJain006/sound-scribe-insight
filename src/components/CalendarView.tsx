import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, List, Grid, Loader2, FileText, MessageSquare } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay, setMonth, setYear, getMonth, getYear, parse } from 'date-fns';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useAuth } from '@/contexts/AuthContext';
import { DayData, TodoItem as SheetTodoItem } from '@/services/googleSheetsService';

interface CalendarTask {
  id: string;
  text: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CalendarViewProps {
  tasks?: CalendarTask[];
  onTaskSelect?: (task: CalendarTask) => void;
  onDateSelect?: (date: Date) => void;
}

type ViewMode = 'month' | 'week' | 'day';

const CalendarView: React.FC<CalendarViewProps> = ({ tasks = [], onTaskSelect, onDateSelect }) => {
  const { user } = useAuth();
  const { isInitialized, loadDayData, daysWithData, isLoading } = useGoogleSheets();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
  const [loadingDayData, setLoadingDayData] = useState(false);

  // Get complete calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Combine local tasks with sheet data
  const getTasksForDate = (date: Date): CalendarTask[] => {
    const localTasks = tasks.filter(task => isSameDay(task.date, date));
    return localTasks;
  };

  // Check if date has data in sheets
  const dateHasSheetData = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    return daysWithData.includes(dateString);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-primary';
    }
  };

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);

    // Load data from Google Sheets for this date
    if (user && isInitialized) {
      setLoadingDayData(true);
      try {
        const data = await loadDayData(date);
        setSelectedDayData(data);
      } catch (error) {
        console.error('Error loading day data:', error);
        setSelectedDayData(null);
      } finally {
        setLoadingDayData(false);
      }
    }
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
    handleDateClick(today);
  };

  const handleDatePickerSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      handleDateClick(date);
      setIsDatePickerOpen(false);
    }
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = setMonth(currentDate, parseInt(monthIndex));
    setCurrentDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(currentDate, parseInt(year));
    setCurrentDate(newDate);
  };

  // Generate year options
  const currentYear = getYear(new Date());
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  const monthOptions = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Convert sheet todos to display format
  const sheetTodos: CalendarTask[] = selectedDayData?.todos?.map(todo => ({
    id: todo.id,
    text: todo.text,
    date: parse(todo.date, 'yyyy-MM-dd', new Date()),
    completed: todo.completed,
    priority: todo.priority,
  })) || [];

  // Combine local and sheet todos (dedupe by id)
  const allTodos = [...selectedDateTasks];
  sheetTodos.forEach(sheetTodo => {
    if (!allTodos.find(t => t.id === sheetTodo.id)) {
      allTodos.push(sheetTodo);
    }
  });

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
            
            {/* Month and Year Selectors */}
            <div className="flex items-center gap-2">
              <Select value={getMonth(currentDate).toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={getYear(currentDate).toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Today
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                Has Data
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
              const hasSheetData = dateHasSheetData(day);
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
                          : hasSheetData || dayTasks.length > 0
                            ? 'bg-muted border-border hover:bg-muted/80 hover:border-primary/50'
                            : 'bg-card/50 border-border/30 hover:bg-card/80 hover:border-accent/30'
                    }
                  `}
                >
                  <div className={`font-medium group-hover:scale-110 transition-transform duration-200 ${!isCurrentMonth ? 'opacity-50' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  {(dayTasks.length > 0 || hasSheetData) && (
                    <div className="flex justify-center gap-1 mt-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((task, index) => (
                        <div 
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${getPriorityColor(task.priority)}`}
                        />
                      ))}
                      {hasSheetData && dayTasks.length === 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
              ? `Data for ${format(selectedDate, 'MMMM d, yyyy')}`
              : 'Select a date to view data'
            }
            {loadingDayData && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingDayData ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading data from your sheet...</p>
            </div>
          ) : selectedDate ? (
            <>
              {/* Tasks Section */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Tasks ({allTodos.length})
                </h4>
                {allTodos.length > 0 ? (
                  <div className="space-y-2">
                    {allTodos.map(task => (
                      <div
                        key={task.id}
                        onClick={() => onTaskSelect?.(task)}
                        className={`
                          group p-3 rounded-lg border cursor-pointer transition-all duration-300 
                          ${task.completed 
                            ? 'bg-muted/50 border-muted/30 opacity-75' 
                            : 'bg-card/50 border-border/50 hover:bg-card/80 hover:border-primary/30'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${getPriorityColor(task.priority)}`} />
                          <div className="flex-1">
                            <p className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {task.text}
                            </p>
                            <Badge 
                              variant="outline" 
                              className="text-xs mt-1"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks for this date</p>
                )}
              </div>

              {/* Notes Section */}
              {selectedDayData?.notes && selectedDayData.notes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes ({selectedDayData.notes.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDayData.notes.map(note => (
                      <div key={note.id} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                        <p className="text-sm">{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(note.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Section */}
              {selectedDayData?.analysis && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Day Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-success mb-1">Work Done</p>
                      <p className="text-sm text-muted-foreground">{selectedDayData.analysis.workDone}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-primary mb-1">Progress</p>
                      <p className="text-sm text-muted-foreground">{selectedDayData.analysis.progress}</p>
                    </div>
                    {selectedDayData.efficiency > 0 && (
                      <div className="flex items-center justify-between p-3 bg-gradient-secondary rounded-lg">
                        <span className="text-sm font-semibold">Efficiency</span>
                        <span className="text-lg font-bold text-primary">{selectedDayData.efficiency}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transcriptions Section */}
              {selectedDayData?.transcriptions && selectedDayData.transcriptions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcriptions ({selectedDayData.transcriptions.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {selectedDayData.transcriptions.map((text, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                        <p className="text-sm text-muted-foreground">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {allTodos.length === 0 && !selectedDayData?.notes?.length && !selectedDayData?.analysis && (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No data saved for this date
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Click on a date to view its data
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
