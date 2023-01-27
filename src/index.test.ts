import { DEFAULT_LOG_LEVEL, getLogger, getLogLevel, getParams, Logger, LogLevel } from './index'

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

function testLogger(log: Logger) {
  log.trace('traced')
  log.debug('debugged')
  log.info('infoed')
  log.log('logged')
  log.warn('warned')
  log.error('errored')
}

describe('getLogger', () => {
  it('returns a default logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('defaultLogger')) // test configuration sets ketch_log=trace
    expect(spy).toHaveBeenCalledTimes(6)
  })

  it('returns a trace logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('traceLogger', LogLevel.TRACE))
    expect(spy).toHaveBeenCalledTimes(6)
  })

  it('returns a debug logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('debugLogger', LogLevel.DEBUG))
    expect(spy).toHaveBeenCalledTimes(5)
  })

  it('returns an info logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('infoLogger', LogLevel.INFO))
    expect(spy).toHaveBeenCalledTimes(4)
  })

  it('returns a log logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('logLogger', LogLevel.LOG))
    expect(spy).toHaveBeenCalledTimes(4)
  })

  it('returns a warn logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('warnLogger', LogLevel.WARN))
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('returns a error logger', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    testLogger(getLogger('errorLogger', LogLevel.ERROR))
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
