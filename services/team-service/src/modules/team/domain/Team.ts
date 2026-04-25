export interface Team {
  id: string;
  membersCount: number;
  name: string;
  status: 'pending-implementation' | 'active';
}
