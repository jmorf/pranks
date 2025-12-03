import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20251203_045753 from './20251203_045753';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251203_045753.up,
    down: migration_20251203_045753.down,
    name: '20251203_045753'
  },
];
