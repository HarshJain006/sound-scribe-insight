 import React, { useState } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
 import { Calendar } from '@/components/ui/calendar';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, Loader2, FileText, MessageSquare } from 'lucide-react';
 import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay, setMonth, setYear, getMonth, getYear, parse } from 'date-fns';
 import { useGoogleSheets } from '@/hooks/useGoogleSheets';
 import { useAuth } from '@/contexts/AuthContext';
 import { DayData } from '@/services/googleSheetsService';
 
 interface CalendarTask {
   id: string;
   text: string;
   date: Date;
   completed: boolean;
   priority: 'low' | 'medium' | 'high';
 }
 
 interface CalendarViewProps {
   onTaskSelect?: (task: CalendarTask) => void;
   onDateSelect?: (date: Date) => void;
 }
 
 const CalendarView: React.FC<CalendarViewProps> = ({ onTaskSelect, onDateSelect }) => {
   const { user } = useAuth();
   const { isInitialized, loadDayData, daysWithData } = useGoogleSheets();
   
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
   const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
   const [loadingDayData, setLoadingDayData] = useState(false);
 
   const monthStart = startOfMonth(currentDate);
   const monthEnd = endOfMonth(currentDate);
   const calendarStart = startOfWeek(monthStart);
   const calendarEnd = endOfWeek(monthEnd);
   const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
 
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
 
   const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
   const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
 
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
     setCurrentDate(setMonth(currentDate, parseInt(monthIndex)));
   };
 
   const handleYearChange = (year: string) => {
     setCurrentDate(setYear(currentDate, parseInt(year)));
   };
 
   const currentYear = getYear(new Date());
   const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
   
   const monthOptions = [
     { value: '0', label: 'Jan' }, { value: '1', label: 'Feb' },
     { value: '2', label: 'Mar' }, { value: '3', label: 'Apr' },
     { value: '4', label: 'May' }, { value: '5', label: 'Jun' },
     { value: '6', label: 'Jul' }, { value: '7', label: 'Aug' },
     { value: '8', label: 'Sep' }, { value: '9', label: 'Oct' },
     { value: '10', label: 'Nov' }, { value: '11', label: 'Dec' },
   ];
 
   const sheetTodos: CalendarTask[] = selectedDayData?.todos?.map(todo => ({
     id: todo.id,
     text: todo.text,
     date: parse(todo.date, 'yyyy-MM-dd', new Date()),
     completed: todo.completed,
     priority: todo.priority,
   })) || [];
 
   return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
       {/* Calendar Grid */}
       <Card className="glass shadow-medium border-border/20">
         <CardHeader className="pb-2 md:pb-4">
           <div className="flex items-center justify-between">
             <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
               <DialogTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto touch-manipulation">
                   <CalendarIcon className="w-4 h-4 text-primary" />
                   <CardTitle className="text-base md:text-xl">
                     {format(currentDate, 'MMM yyyy')}
                   </CardTitle>
                 </Button>
               </DialogTrigger>
               <DialogContent className="w-auto p-4">
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
             <Button
               variant="outline"
               size="sm"
               onClick={handleTodayClick}
               className="border-border/20 touch-manipulation h-9 text-xs"
             >
               Today
             </Button>
           </div>
 
           <div className="flex items-center justify-between mt-2">
             <Button
               variant="ghost"
               size="icon"
               onClick={handlePrevMonth}
               className="touch-manipulation h-10 w-10"
             >
               <ChevronLeft className="w-5 h-5" />
             </Button>
             
             <div className="flex items-center gap-1">
               <Select value={getMonth(currentDate).toString()} onValueChange={handleMonthChange}>
                 <SelectTrigger className="w-16 md:w-20 h-9 text-xs touch-manipulation">
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
                 <SelectTrigger className="w-16 h-9 text-xs touch-manipulation">
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
             
             <Button
               variant="ghost"
               size="icon"
               onClick={handleNextMonth}
               className="touch-manipulation h-10 w-10"
             >
               <ChevronRight className="w-5 h-5" />
             </Button>
           </div>
         </CardHeader>
 
         <CardContent className="pt-0">
           {/* Day headers */}
           <div className="grid grid-cols-7 gap-0.5 mb-1">
             {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
               <div key={i} className="text-center text-[10px] md:text-xs font-medium text-muted-foreground py-1">
                 {day}
               </div>
             ))}
           </div>
 
           {/* Calendar days */}
           <div className="grid grid-cols-7 gap-0.5">
             {calendarDays.map(day => {
               const hasData = dateHasSheetData(day);
               const isSelected = selectedDate && isSameDay(day, selectedDate);
               const isDayToday = isToday(day);
               const isCurrentMonth = isSameMonth(day, currentDate);
               
               return (
                 <button
                   key={day.toISOString()}
                   onClick={() => handleDateClick(day)}
                   className={`
                     aspect-square flex flex-col items-center justify-center rounded-md text-xs md:text-sm
                     transition-all duration-100 active:scale-95 touch-manipulation select-none
                     ${!isCurrentMonth 
                       ? 'text-muted-foreground/40 bg-transparent' 
                       : isDayToday 
                         ? 'bg-primary text-primary-foreground font-bold shadow-glow' 
                         : isSelected
                           ? 'bg-accent text-accent-foreground font-semibold'
                           : hasData
                             ? 'bg-muted/80 hover:bg-muted'
                             : 'hover:bg-muted/50'
                     }
                   `}
                 >
                   <span>{format(day, 'd')}</span>
                   {hasData && !isDayToday && !isSelected && (
                     <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                   )}
                 </button>
               );
             })}
           </div>
         </CardContent>
       </Card>
 
       {/* Details Panel */}
       <Card className="glass shadow-medium border-border/20">
         <CardHeader className="pb-2">
           <CardTitle className="flex items-center gap-2 text-base md:text-xl">
             <Eye className="w-4 h-4 text-accent" />
             {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
             {loadingDayData && <Loader2 className="w-4 h-4 animate-spin" />}
           </CardTitle>
         </CardHeader>
 
         <CardContent className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
           {loadingDayData ? (
             <div className="text-center py-8">
               <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
               <p className="text-sm text-muted-foreground">Loading...</p>
             </div>
           ) : selectedDate ? (
             <>
               {/* Tasks */}
               <div>
                 <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                   <CalendarIcon className="w-4 h-4" />
                   Tasks ({sheetTodos.length})
                 </h4>
                 {sheetTodos.length > 0 ? (
                   <div className="space-y-2">
                     {sheetTodos.map(task => (
                       <div
                         key={task.id}
                         onClick={() => onTaskSelect?.(task)}
                         className={`
                           p-3 rounded-lg border touch-manipulation active:scale-[0.98] transition-transform
                           ${task.completed ? 'bg-muted/50 opacity-60' : 'bg-card/50 border-border/50'}
                         `}
                       >
                         <div className="flex items-start gap-2">
                           <div className={`w-2 h-2 rounded-full mt-1.5 ${getPriorityColor(task.priority)}`} />
                           <div className="flex-1 min-w-0">
                             <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                               {task.text}
                             </p>
                             <Badge variant="outline" className="text-[10px] mt-1">
                               {task.priority}
                             </Badge>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-sm text-muted-foreground">No tasks</p>
                 )}
               </div>
 
               {/* Notes */}
               {selectedDayData?.notes && selectedDayData.notes.length > 0 && (
                 <div>
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                     <MessageSquare className="w-4 h-4" />
                     Notes ({selectedDayData.notes.length})
                   </h4>
                   <div className="space-y-2">
                     {selectedDayData.notes.map(note => (
                       <div key={note.id} className="p-2 bg-muted/50 rounded-lg text-sm">
                         <p>{note.text}</p>
                         <p className="text-[10px] text-muted-foreground mt-1">
                           {format(new Date(note.createdAt), 'h:mm a')}
                         </p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
 
               {/* Analysis */}
               {selectedDayData?.analysis && (
                 <div>
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                     <FileText className="w-4 h-4" />
                     Analysis
                   </h4>
                   <div className="space-y-2">
                     <div className="p-2 bg-muted/50 rounded-lg">
                       <p className="text-xs font-medium text-success">Work Done</p>
                       <p className="text-sm text-muted-foreground">{selectedDayData.analysis.workDone}</p>
                     </div>
                     <div className="p-2 bg-muted/50 rounded-lg">
                       <p className="text-xs font-medium text-primary">Progress</p>
                       <p className="text-sm text-muted-foreground">{selectedDayData.analysis.progress}</p>
                     </div>
                     {selectedDayData.efficiency > 0 && (
                       <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                         <span className="text-sm font-medium">Efficiency</span>
                         <span className="text-lg font-bold text-primary">{selectedDayData.efficiency}%</span>
                       </div>
                     )}
                   </div>
                 </div>
               )}
 
               {/* Transcriptions */}
               {selectedDayData?.transcriptions && selectedDayData.transcriptions.length > 0 && (
                 <div>
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                     <FileText className="w-4 h-4" />
                     Transcriptions ({selectedDayData.transcriptions.length})
                   </h4>
                   <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                     {selectedDayData.transcriptions.map((text, idx) => (
                       <div key={idx} className="p-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                         {text}
                       </div>
                     ))}
                   </div>
                 </div>
               )}
 
               {/* Empty state */}
               {sheetTodos.length === 0 && !selectedDayData?.notes?.length && !selectedDayData?.analysis && (
                 <div className="text-center py-6">
                   <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                   <p className="text-sm text-muted-foreground">No data for this date</p>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-8">
               <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
               <p className="text-sm text-muted-foreground">Tap a date to view data</p>
             </div>
           )}
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default CalendarView;