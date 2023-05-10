import { DEFAULT_LOG_LEVEL, getLogger, getLogLevel, getParams, Logger, LogLevel, wrapLogger } from './index'

function testLogger(log: Logger) {
  log.trace('traced')
  log.debug('debugged')
  log.info('infoed')
  log.warn('warned')
  log.error('errored')
  log.log('logged')
}

describe('getLogLevel', () => {
  it('returns trace', () => {
    expect(getLogLevel()).toEqual(LogLevel.TRACE)
  })
  it('returns value from query', () => {
    expect(getLogLevel(getParams('ketch_log=debug'))).toEqual(LogLevel.DEBUG)
  })
  it('supports a different prefix', () => {
    expect(getLogLevel(getParams('swb_log=debug', ['swb_']))).toEqual(LogLevel.DEBUG)
  })
  it('supports a prefix array', () => {
    expect(getLogLevel(getParams('s_log=debug', ['swb_', 'ketch_', 's_']))).toEqual(LogLevel.DEBUG)
  })
  it('returns value from query ignoring case', () => {
    expect(getLogLevel(getParams('ketch_log=DeBuG'))).toEqual(LogLevel.DEBUG)
  })
  it('returns default if unrecognized from query', () => {
    expect(getLogLevel(getParams('ketch_log=debugf'))).toEqual(DEFAULT_LOG_LEVEL)
  })
  it('returns debug if specified with 1 value', () => {
    expect(getLogLevel(getParams('ketch_debug=1'))).toEqual(LogLevel.DEBUG)
  })
  it('returns debug if specified with 0 value', () => {
    expect(getLogLevel(getParams('ketch_debug=0'))).toEqual(LogLevel.DEBUG)
  })
})

describe('wrapLogger', () => {
  it('includes the new prefix', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const innerLogger = getLogger('first', LogLevel.LOG)
    const logger = wrapLogger(innerLogger, 'second')
    testLogger(logger)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('[first]', '[second]', 'logged')
  })
})

describe('getLogger', () => {
  it('returns a default logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('defaultLogger') // test configuration sets ketch_log=trace
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(5)
    expect(spy).toHaveBeenNthCalledWith(1, '[defaultLogger]', 'traced')
    expect(spy).toHaveBeenNthCalledWith(2, '[defaultLogger]', 'debugged')
    expect(spy).toHaveBeenNthCalledWith(3, '[defaultLogger]', 'infoed')
    expect(spy).toHaveBeenNthCalledWith(4, '[defaultLogger]', 'warned')
    expect(spy).toHaveBeenNthCalledWith(5, '[defaultLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[defaultLogger]', 'errored')
  })

  it('returns a trace logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('traceLogger', LogLevel.TRACE)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(5)
    expect(spy).toHaveBeenNthCalledWith(1, '[traceLogger]', 'traced')
    expect(spy).toHaveBeenNthCalledWith(2, '[traceLogger]', 'debugged')
    expect(spy).toHaveBeenNthCalledWith(3, '[traceLogger]', 'infoed')
    expect(spy).toHaveBeenNthCalledWith(4, '[traceLogger]', 'warned')
    expect(spy).toHaveBeenNthCalledWith(5, '[traceLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[traceLogger]', 'errored')
  })

  it('returns a debug logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('debugLogger', LogLevel.DEBUG)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy).toHaveBeenNthCalledWith(1, '[debugLogger]', 'debugged')
    expect(spy).toHaveBeenNthCalledWith(2, '[debugLogger]', 'infoed')
    expect(spy).toHaveBeenNthCalledWith(3, '[debugLogger]', 'warned')
    expect(spy).toHaveBeenNthCalledWith(4, '[debugLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[debugLogger]', 'errored')
  })

  it('returns an info logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('infoLogger', LogLevel.INFO)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenNthCalledWith(1, '[infoLogger]', 'infoed')
    expect(spy).toHaveBeenNthCalledWith(2, '[infoLogger]', 'warned')
    expect(spy).toHaveBeenNthCalledWith(3, '[infoLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[infoLogger]', 'errored')
  })

  it('returns a warn logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('warnLogger', LogLevel.WARN)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenNthCalledWith(1, '[warnLogger]', 'warned')
    expect(spy).toHaveBeenNthCalledWith(2, '[warnLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[warnLogger]', 'errored')
  })

  it('returns an error logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const spyError = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const log = getLogger('errorLogger', LogLevel.ERROR)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenNthCalledWith(1, '[errorLogger]', 'logged')

    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenNthCalledWith(1, '[errorLogger]', 'errored')
  })

  it('returns a log logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    const log = getLogger('logLogger', LogLevel.LOG)
    testLogger(log)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenNthCalledWith(1, '[logLogger]', 'logged')
  })
})
