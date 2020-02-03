import eventDependent from './';
import { EventEmitter } from 'events';

describe('eventDependent', () => {
  it('should await an EventEmitter event before resolving the requested Promise', async () => {
    const source = new EventEmitter();

    const augmentedSource = eventDependent(
      source,
      'ready',
      'error',
      {
        async getFoo(suffix: string) {
          return `Foo${suffix}`;
        },
      },
    );

    process.nextTick(() => source.emit('ready'));

    const result = await augmentedSource.getFoo(' bar!');

    expect(result).toBe('Foo bar!');
    expect(source.listenerCount('ready')).toBe(0);
    expect(source.listenerCount('error')).toBe(0);
  });

  it.todo('should throw an error if the event times out');
});