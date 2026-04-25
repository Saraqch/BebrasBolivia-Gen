import { type Team } from '../domain/Team';

const teamsSeed: Team[] = [
  {
    id: 'team-1',
    membersCount: 0,
    name: 'Core Team',
    status: 'pending-implementation',
  },
];

export const listTeams = (): Team[] => teamsSeed;
