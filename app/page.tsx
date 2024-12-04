'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';
import LeadsWidget from '@/components/dashboard/widgets/LeadsWidget';
import TasksWidget from '@/components/dashboard/widgets/TasksWidget';
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';
import PipelineWidget from '@/components/dashboard/widgets/PipelineWidget';

// Available widgets with their navigation paths
const availableWidgets = [
  { id: 'leads', title: 'Leads Overview', component: LeadsWidget, path: '/leads' },
  { id: 'tasks', title: 'Tasks Overview', component: TasksWidget, path: '/tasks' },
  { id: 'activity', title: 'Recent Activity', component: ActivityWidget, path: '/activities' },
  { id: 'pipeline', title: 'Pipeline Overview', component: PipelineWidget, path: '/pipeline' },
];

// Available themes
const themes = {
  default: { primary: 'indigo', secondary: 'gray', accent: 'blue' },
  ocean: { primary: 'blue', secondary: 'slate', accent: 'cyan' },
  forest: { primary: 'emerald', secondary: 'stone', accent: 'green' },
  sunset: { primary: 'orange', secondary: 'zinc', accent: 'amber' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeWidgets, setActiveWidgets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-widgets');
      return saved ? JSON.parse(saved) : availableWidgets.map(w => w.id);
    }
    return availableWidgets.map(w => w.id);
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-theme') || 'default';
    }
    return 'default';
  });

  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', currentTheme);
    document.documentElement.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveWidgets(items);
  };

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets((current: string[]) =>
      current.includes(widgetId)
        ? current.filter(id => id !== widgetId)
        : [...current, widgetId]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header controls */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-theme-primary">Dashboard</h1>
          <div className="flex space-x-4">
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-theme-primary"
            >
              {Object.keys(themes).map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
                </option>
              ))}
            </select>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWidgetMenu(!showWidgetMenu)}
                className="btn-primary rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-blue-600"
              >
                Customize Widgets
              </button>
              {showWidgetMenu && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-theme-primary ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-30"
                  onMouseLeave={() => setShowWidgetMenu(false)}
                >
                  {availableWidgets.map(widget => (
                    <div key={widget.id} className="py-1">
                      <button
                        onClick={() => toggleWidget(widget.id)}
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                      >
                        <input
                          type="checkbox"
                          checked={activeWidgets.includes(widget.id)}
                          onChange={() => {}}
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        {widget.title}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Draggable widgets grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {activeWidgets.map((widgetId: string, index: number) => {
                  const widget = availableWidgets.find(w => w.id === widgetId);
                  if (!widget) return null;

                  return (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-theme-primary rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                          onClick={(e) => {
                            // Only navigate if not dragging
                            if (!e.currentTarget.hasAttribute('data-rbd-dragging-draggable-id')) {
                              router.push(widget.path);
                            }
                          }}
                        >
                          <widget.component />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
