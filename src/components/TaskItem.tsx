import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700"
  };

  return (
    <div className="group bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
      <button 
        onClick={() => onToggle(task.id, task.status)}
        className="mt-1 text-slate-300 hover:text-blue-500 transition-colors"
      >
        {task.status === 'done' ? (
          <CheckCircle2 className="text-green-500" size={22} />
        ) : (
          <Circle size={22} />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-semibold text-slate-900 truncate",
          task.status === 'done' && "line-through text-slate-400"
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", priorityColors[task.priority])}>
            {task.priority}
          </span>
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskItem;