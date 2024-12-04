'use client';

import { useEffect } from 'react';
import { useCRMStore } from '@/lib/store/store';

export default function DataLoader({ children }: { children: React.ReactNode }) {
  const { fetchContacts, fetchDeals, fetchTasks, fetchActivities } = useCRMStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchContacts(),
          fetchDeals(),
          fetchTasks(),
          fetchActivities(),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadData();
  }, [fetchContacts, fetchDeals, fetchTasks, fetchActivities]);

  return <>{children}</>;
}
