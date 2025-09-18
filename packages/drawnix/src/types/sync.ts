export type DrawnixSyncStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type DrawnixSyncInfo = {
  status: DrawnixSyncStatus;
  lastSyncedAt?: number;
  error?: string;
  onOpenSettings: () => void;
};
