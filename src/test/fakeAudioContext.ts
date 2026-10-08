/**
 * A recording stand-in for Web Audio, which jsdom lacks. Every node has every
 * param and method the city's sound code touches, and remembers what it feeds
 * so tests can check that sounds unplug themselves.
 */

export class FakeParam {
  value = 0;

  setValueAtTime = jest.fn();

  setTargetAtTime = jest.fn();

  linearRampToValueAtTime = jest.fn();

  exponentialRampToValueAtTime = jest.fn();

  setValueCurveAtTime = jest.fn();

  cancelScheduledValues = jest.fn();
}

export class FakeNode extends EventTarget {
  readonly gain = new FakeParam();

  readonly frequency = new FakeParam();

  readonly detune = new FakeParam();

  readonly Q = new FakeParam();

  readonly pan = new FakeParam();

  readonly playbackRate = new FakeParam();

  type = '';

  buffer: unknown = null;

  curve: unknown = null;

  loop = false;

  /** The nodes and params this node currently feeds. */
  readonly outputs = new Set<unknown>();

  connect = jest.fn(<T>(target: T): T => {
    this.outputs.add(target);
    return target;
  });

  disconnect = jest.fn(() => {
    this.outputs.clear();
  });

  start = jest.fn();

  stop = jest.fn();

  setPeriodicWave = jest.fn();
}

export class FakeAudioContext {
  sampleRate = 8000;

  currentTime = 0;

  state: AudioContextState = 'running';

  readonly destination = new FakeNode();

  /** Every node created, in order. */
  readonly nodes: FakeNode[] = [];

  private createNode = (): FakeNode => {
    const node = new FakeNode();
    this.nodes.push(node);
    return node;
  };

  createGain = this.createNode;

  createBiquadFilter = this.createNode;

  createBufferSource = this.createNode;

  createOscillator = this.createNode;

  createStereoPanner = this.createNode;

  createConvolver = this.createNode;

  createWaveShaper = this.createNode;

  createPeriodicWave = jest.fn(() => ({}));

  createBuffer = (channels: number, length: number) => {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return { getChannelData: (channel: number) => data[channel] };
  };

  /** This fake, typed for code that takes a real context. */
  asContext(): BaseAudioContext {
    return this as unknown as BaseAudioContext;
  }
}
