import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as TSKV', () => {
    const result = logger.formatMessage('log', 'Server started', 'Bootstrap');

    expect(result).toBe(
      'level=log\tmessage=Server started\toptionalParams=["Bootstrap"]',
    );
  });

  it('should escape special characters', () => {
    const result = logger.formatMessage('log', 'Hello\nworld\t!');

    expect(result).toBe(
      'level=log\tmessage=Hello\\nworld\\t!\toptionalParams=[]',
    );
  });

  it('should write log message to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Server started');

    expect(spy).toHaveBeenCalledWith(
      'level=log\tmessage=Server started\toptionalParams=[]',
    );
  });

  it('should write error message to console', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Something went wrong');

    expect(spy).toHaveBeenCalledWith(
      'level=error\tmessage=Something went wrong\toptionalParams=[]',
    );
  });

  it('should write warning to console', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Warning');

    expect(spy).toHaveBeenCalledWith(
      'level=warn\tmessage=Warning\toptionalParams=[]',
    );
  });
});
