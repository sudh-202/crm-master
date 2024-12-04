import { create } from 'zustand';
import type { Contact, Deal, Task, Activity } from '@prisma/client';

// Define valid status types
type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

// Ensure Contact type matches Prisma schema
type ContactWithRelations = Contact & {
  deals?: Deal[];
  tasks?: Task[];
  activities?: Activity[];
};

type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed';

interface CRMStore {
  contacts: ContactWithRelations[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  searchTerm: string;
  
  // Data fetching
  fetchContacts: () => Promise<void>;
  fetchDeals: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  
  // Search
  setSearchTerm: (term: string) => void;
  
  // Contact actions
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Deal actions
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDeal: (id: string, newStage: DealStage) => Promise<void>;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useCRMStore = create<CRMStore>((set) => ({
  contacts: [],
  deals: [],
  tasks: [],
  activities: [],
  searchTerm: '',
  
  // Data fetching
  fetchContacts: async () => {
    const response = await fetch('/api/contacts');
    const contacts = await response.json();
    set({ contacts });
  },
  
  fetchDeals: async () => {
    const response = await fetch('/api/deals');
    const deals = await response.json();
    set({ deals });
  },
  
  fetchTasks: async () => {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    set({ tasks });
  },
  
  fetchActivities: async () => {
    const response = await fetch('/api/activities');
    const activities = await response.json();
    set({ activities });
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  // Contact actions
  addContact: async (contact) => {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    const newContact = await response.json();
    set((state) => ({
      contacts: [...state.contacts, newContact],
    }));
  },
  
  updateContact: async (id, contact) => {
    try {
      console.log('Updating contact:', { id, contact });

      if (!id) {
        throw new Error('Contact ID is required');
      }

      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contact');
      }

      const data = await response.json();
      console.log('Update response:', { status: response.status, data });

      set((state) => {
        const newContacts = state.contacts.map((c) =>
          c.id === id ? { ...c, ...contact, ...data } : c
        );
        console.log('Updated contacts state:', newContacts);
        return { contacts: newContacts };
      });

      return data;
    } catch (error) {
      console.error('Error in updateContact:', error);
      throw error instanceof Error ? error : new Error('Failed to update contact');
    }
  },
  
  deleteContact: async (id) => {
    await fetch(`/api/contacts?id=${id}`, {
      method: 'DELETE',
    });
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    }));
  },
  
  // Deal actions
  addDeal: async (deal) => {
    const response = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    const newDeal = await response.json();
    set((state) => ({
      deals: [...state.deals, newDeal],
    }));
  },
  
  updateDeal: async (id, deal) => {
    const response = await fetch(`/api/deals?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    const updatedDeal = await response.json();
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? updatedDeal : d
      ),
    }));
  },
  
  deleteDeal: async (id) => {
    await fetch(`/api/deals?id=${id}`, {
      method: 'DELETE',
    });
    set((state) => ({
      deals: state.deals.filter((d) => d.id !== id),
    }));
  },
  
  moveDeal: async (id, newStage) => {
    const response = await fetch(`/api/deals?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    const updatedDeal = await response.json();
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? updatedDeal : d
      ),
    }));
  },
  
  // Task actions
  addTask: async (task) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const newTask = await response.json();
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },
  
  updateTask: async (id, task) => {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const updatedTask = await response.json();
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updatedTask : t
      ),
    }));
  },
  
  deleteTask: async (id) => {
    await fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    });
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  
  toggleTaskStatus: async (id) => {
    const task = await fetch(`/api/tasks?id=${id}`).then((r) => r.json());
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: task.status === 'completed' ? 'pending' : 'completed',
      }),
    });
    const updatedTask = await response.json();
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updatedTask : t
      ),
    }));
  },
  
  // Activity actions
  addActivity: async (activity) => {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    const newActivity = await response.json();
    set((state) => ({
      activities: [...state.activities, newActivity],
    }));
  },
  
  updateActivity: async (id, activity) => {
    const response = await fetch(`/api/activities?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    const updatedActivity = await response.json();
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? updatedActivity : a
      ),
    }));
  },
  
  deleteActivity: async (id) => {
    await fetch(`/api/activities?id=${id}`, {
      method: 'DELETE',
    });
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    }));
  },
}));
