'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCRMStore } from '@/lib/store/store';
import { XCircleIcon } from '@heroicons/react/24/outline';

type StatusType = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  currentStatus: string;
}

const statusOptions: { value: StatusType; label: string; bgColor: string; textColor: string }[] = [
  { value: 'active', label: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'inactive', label: 'Inactive', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  { value: 'lead', label: 'Lead', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'customer', label: 'Customer', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'prospect', label: 'Prospect', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
];

export default function EditStatusModal({
  isOpen,
  onClose,
  contactId,
  currentStatus,
}: EditStatusModalProps) {
  const { updateContact } = useCRMStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<StatusType | null>(null);

  const handleStatusChange = async (newStatus: StatusType) => {
    if (!contactId) {
      setError('Contact ID is missing');
      return;
    }

    if (newStatus === currentStatus) {
      onClose();
      return;
    }

    console.log('Attempting to update status:', { contactId, currentStatus, newStatus });
    setIsLoading(true);
    setError(null);
    setUpdatingStatus(newStatus);

    try {
      const result = await updateContact(contactId, { 
        status: newStatus 
      });
      console.log('Status update result:', result);
      onClose();
    } catch (err) {
      console.error('Error updating status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact status. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setUpdatingStatus(null);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setUpdatingStatus(null);
      onClose();
    }
  };

  // Validate current status
  const validStatus = statusOptions.find(option => option.value === currentStatus) 
    ? currentStatus as StatusType 
    : 'active';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Update Contact Status
                </Dialog.Title>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {statusOptions.map((status) => {
                      const isUpdating = isLoading && updatingStatus === status.value;
                      const isSelected = status.value === validStatus;
                      return (
                        <button
                          key={status.value}
                          onClick={() => !isLoading && handleStatusChange(status.value)}
                          disabled={isLoading}
                          className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
                            ${isSelected
                              ? `${status.bgColor} ${status.textColor} ring-2 ring-offset-2 ring-${status.textColor.replace('text-', '')}`
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                        >
                          {status.label}
                          {isUpdating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
                              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent bg-gray-100 
                      px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2
                      transition-all duration-200
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Cancel'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
