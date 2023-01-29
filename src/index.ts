import Params from './params'

/**
 * Log Level
 *
 * @enum
 */
export declare const enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Default logging level
 */
export const DEFAULT_LOG_LEVEL = LogLevel.WARN

/**
 * Log level priority
 */
const levelPriority: { [key: string]: number } = {
  [LogLevel.TRACE]: 1,
  [LogLevel.DEBUG]: 2,
  [LogLevel.INFO]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.LOG]: 6,
}

/**
 * Logger function
 */
export declare type LoggerFunction = (...data: any[]) => void

/**
 * Logger interface
 */
export declare interface Logger {
  trace: LoggerFunction
  debug: LoggerFunction
  info: LoggerFunction
  log: LoggerFunction
  warn: LoggerFunction
  error: LoggerFunction
}

/**
 * Logging Function that does nothing
 */
const noopLoggerFunction = () => {}

/**
 * Returns Params object
 *
 * @param input Input parameters
 * @param prefixes Array of prefixes for the parameters
 */
export function getParams(input: string = window.location.search, prefixes = ['ketch_', 'swb_']): Params {
  return new Params(input, prefixes)
}

/**
 * Wrap a logger with an additional prefix
 *
 * @param logger The logger to wrap
 * @param prefix The prefix to add
 */
export function wrapLogger(logger: Logger, prefix: string): Logger {
  const header = `[${prefix}]`

  return {
    trace: (...data: any[]) => {
      logger.trace(header, ...data)
    },
    debug: (...data: any[]) => {
      logger.debug(header, ...data)
    },
    info: (...data: any[]) => {
      logger.info(header, ...data)
    },
    log: (...data: any[]) => {
      logger.log(header, ...data)
    },
    warn: (...data: any[]) => {
      logger.warn(header, ...data)
    },
    error: (...data: any[]) => {
      logger.error(header, ...data)
    },
  }
}

/**
 * Returns a logger.
 *
 * @param prefix Prefix for log messages
 * @param level Log level
 */
export function getLogger(prefix: string, level: string | LogLevel = getLogLevel(getParams())): Logger {
  const loggers: { [key: string]: LoggerFunction } = {
    log: global.console.log,
  }

  level = level.toString().toLowerCase() as LogLevel

  for (const l of Object.keys(levelPriority)) {
    loggers[l] = l === 'log' || levelPriority[l] >= levelPriority[level] ? loggers.log : noopLoggerFunction
  }

  return wrapLogger(loggers as any as Logger, prefix)
}

/**
 * Returns the log level
 *
 * @param params Parameters to inspect for the level specification
 */
export function getLogLevel(params: Params = getParams()): LogLevel {
  const p = params.get('log')
  if (p && p.length) {
    const level = p.toLowerCase()

    if (level && levelPriority[level]) {
      return level as LogLevel
    }
  } else if (params.has('debug')) {
    return LogLevel.DEBUG
  }

  return DEFAULT_LOG_LEVEL
}
