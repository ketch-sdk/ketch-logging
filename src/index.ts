export declare const enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}

export const DEFAULT_LOG_LEVEL = LogLevel.WARN

const levelPriority: { [key: string]: number } = {
  [LogLevel.TRACE]: 1,
  [LogLevel.DEBUG]: 2,
  [LogLevel.INFO]: 3,
  [LogLevel.LOG]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
}

export declare type LoggerFunction = (...data: any[]) => void

export declare interface Logger {
  trace: LoggerFunction
  debug: LoggerFunction
  info: LoggerFunction
  log: LoggerFunction
  warn: LoggerFunction
  error: LoggerFunction
}

const noopLoggerFunction = () => {}

export function getLogger(prefix: string, level: string | LogLevel = getLogLevel()): Logger {
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

export function getLogLevel(input: string = window.location.search, prefixes = ['ketch_', 'swb_']): LogLevel {
  const params = new URLSearchParams(input)
  for (const prefix of prefixes) {
    if (params.has(`${prefix}log`)) {
      const level = (params.get(`${prefix}log`) || '').toLowerCase()

      if (level && levelPriority[level]) {
        return level as LogLevel
      }
    } else if (params.has(`${prefix}debug`)) {
      return LogLevel.DEBUG
    }
  }

  return DEFAULT_LOG_LEVEL
}
