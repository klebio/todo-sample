import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import TaskItem from '@/components/TaskItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('tasks').insert([{
      ...newTask,
      user_id: user.id
    }]);

    if (error) showError('Erro ao criar tarefa');
    else {
      showSuccess('Tarefa criada!');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium' });
      fetchTasks();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', id);
    if (!error) fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      showSuccess('Tarefa removida');
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Minhas Tarefas</h2>
          <p className="text-slate-500">Você tem {tasks.filter(t => t.status !== 'done').length} tarefas pendentes.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-blue-200">
              <Plus className="mr-2" size={20} /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input 
                  required 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder="O que precisa ser feito?"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (Opcional)</Label>
                <Input 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Mais detalhes..."
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={v => setNewTask({...newTask, priority: v})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 py-6 rounded-xl font-bold">
                Salvar Tarefa
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Buscar tarefas..." 
          className="pl-10 bg-white border-slate-200 rounded-xl py-6"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
              <p className="text-slate-400">Nenhuma tarefa encontrada.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Index;