import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as JSON', () => {
    const result = logger.formatMessage('log', 'Server started', 'Bootstrap');

    expect(JSON.parse(result)).toEqual({
      level: 'log',
      message: 'Server started',
      optionalParams: ['Bootstrap'],
    });
  });

  it('should write log message to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Server started');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'Server started',
        optionalParams: [],
      }),
    );
  });

  it('should write error message to console', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Something went wrong');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'Something went wrong',
        optionalParams: [],
      }),
    );
  });

  it('should write warning to console', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Warning');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'Warning',
        optionalParams: [],
      }),
    );
  });
});
