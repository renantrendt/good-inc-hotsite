export const debug = {
  log: (namespace: string, message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${namespace}] ${message}`, ...args)
    }
  },
  error: (namespace: string, message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${namespace}] ${message}`, ...args)
    }
  }
}
