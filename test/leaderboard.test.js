import { calculateLeaderboard } from '../lib/leaderboard.js';
import assert from 'assert';
import { test } from 'node:test';

test('sorts players by points', () => {
  const names = ['a', 'b', 'c'];
  const timers = [{points:2}, {points:5}, {points:1}];
  const result = calculateLeaderboard(names, timers);
  assert.deepStrictEqual(result[0], {name:'b', points:5});
  assert.deepStrictEqual(result[2], {name:'c', points:1});
});
