# ketch-logging

Basic logging capabilities.

## Logger

```typescript
const prefix: string = ''
const level: string | LogLevel = getLogLevel() // or LogLevel.WARN or 'warn' (default level)
const logger: Logger = getLogger(prefix, level)
```

Returns a new `Logger`, which provides the following interface:

```typescript
export interface Logger {
  trace(...data: any[]): void
  debug(...data: any[]): void
  info(...data: any[]): void
  log(...data: any[]): void
  warn(...data: any[]): void
  error(...data: any[]): void
}
```

## getLogLevel

```typescript
const input: string = window.location.search
const prefix = 'swb_'
const logLevel: LogLevel = getLogLevel(input, prefix)
```

Determines the log level from the given input (defaults to the querystring). The prefix which
defaults to `swb_` is added to `log` to locate the parameter.
