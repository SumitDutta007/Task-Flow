import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TaskDialog } from './TaskDialog';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  LogOut,
  User,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Calendar,
  ListTodo,
  BarChart3
} from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const params = {
        sortBy,
        order: sortOrder
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await taskAPI.getAllTasks(params);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await taskAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskSaved = () => {
    fetchTasks();
    fetchStats();
    setDialogOpen(false);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      case 'low':
        return <Circle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'todo':
        return <Circle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM dd, yyyy');
  };

  const getDueDateColor = (dueDate, status) => {
    if (!dueDate || status === 'completed') return 'text-muted-foreground';
    const date = new Date(dueDate);
    if (isPast(date)) return 'text-red-400';
    if (isToday(date) || isTomorrow(date)) return 'text-yellow-400';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Manrope'}}>TaskFlow</h1>
                <p className="text-xs text-muted-foreground">Professional Task Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-testid="stats-section">
            <Card className="stat-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold" data-testid="stat-total">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <ListTodo className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-3xl font-bold" data-testid="stat-completed">{stats.byStatus.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                    <p className="text-3xl font-bold" data-testid="stat-in-progress">{stats.byStatus.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                    <p className="text-3xl font-bold" data-testid="stat-overdue">{stats.overdue}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="search-input"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]" data-testid="status-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]" data-testid="priority-filter">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]" data-testid="sort-by-filter">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={sortOrder === 'asc' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  data-testid="sort-order-button"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>

                <Button onClick={handleCreateTask} data-testid="create-task-button">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <ListTodo className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'}
              </p>
              <Button onClick={handleCreateTask} data-testid="empty-state-create-button">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="tasks-grid">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className="task-card-hover border-border/50 cursor-pointer"
                onClick={() => handleEditTask(task)}
                data-testid={`task-card-${task._id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2" data-testid="task-title">{task.title}</CardTitle>
                    <div className="flex gap-1">
                      <Badge
                        variant="outline"
                        className={`priority-${task.priority} text-xs`}
                        data-testid="task-priority-badge"
                      >
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </Badge>
                    </div>
                  </div>
                  {task.description && (
                    <CardDescription className="line-clamp-2" data-testid="task-description">
                      {task.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`status-${task.status} text-xs`}
                        data-testid="task-status-badge"
                      >
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">
                          {task.status === 'in-progress' ? 'In Progress' : task.status}
                        </span>
                      </Badge>
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className={getDueDateColor(task.dueDate, task.status)} data-testid="task-due-date">
                          {getDueDateLabel(task.dueDate)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task._id);
                        }}
                        data-testid="delete-task-button"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};
