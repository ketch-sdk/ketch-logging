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
  [LogLevel.LOG]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
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
 * Returns a logger.
 *
 * @param prefix Prefix for log messages
 * @param level Log level
 */
export function getLogger(prefix: string, level: string | LogLevel = getLogLevel(getParams())): Logger {
  const header = `[${prefix}]`
  const loggers: { [key: string]: LoggerFunction } = {}

  level = level.toString().toLowerCase() as LogLevel

  for (const l of Object.keys(levelPriority)) {
    let loggerFunction = noopLoggerFunction
    if (levelPriority[l] >= levelPriority[level]) {
      loggerFunction = (...data: any[]) => {
        console.log(header, ...data)
      }
    }
    loggers[l] = loggerFunction
  }

  return loggers as any as Logger
}

/**
 * Returns the log level
 *
 * @param params Parameters to inspect for the level specification
 */
export function getLogLevel(params: Params = getParams()): LogLevel {
  if (params.has(`log`)) {
    const level = (params.get(`log`) || '').toLowerCase()

    if (level && levelPriority[level]) {
      return level as LogLevel
    }
  } else if (params.has(`debug`)) {
    return LogLevel.DEBUG
  }

  return DEFAULT_LOG_LEVEL
}
