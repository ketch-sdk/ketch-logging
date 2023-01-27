import { getParams } from './index'

describe('params', () => {
  describe('delete', () => {
    it('deletes prefixed parameters', () => {
      const params = getParams('ketch_log=warn')
      expect(params.has('log')).toBeTruthy()
      params.delete('log')
      expect(params.has('log')).toBeFalsy()
    })
  })

  describe('get', () => {
    it('returns parameters', () => {
      const params = getParams('ketch_log=warn')
      expect(params.get('log')).toBe('warn')
    })

    it('returns parameters for secondary prefix', () => {
      const params = getParams('swb_log=warn')
      expect(params.get('log')).toBe('warn')
    })

    it('returns parameters for multiple prefix', () => {
      const params = getParams('ketch_log=warn&swb_log=error')
      expect(params.get('log')).toBe('warn')
    })

    it('returns null', () => {
      const params = getParams('log=warn')
      expect(params.get('log')).toBeNull()
    })
  })

  describe('getAll', () => {
    it('returns parameters', () => {
      const params = getParams('ketch_log=warn&ketch_log=error')
      expect(params.getAll('log')).toEqual(['warn', 'error'])
    })

    it('returns empty array', () => {
      const params = getParams('log=warn&log=error')
      expect(params.getAll('log')).toHaveLength(0)
    })
  })

  describe('has', () => {
    it('returns true for existing parameter', () => {
      const params = getParams('ketch_log=warn')
      expect(params.has('log')).toBeTruthy()
    })

    it('returns true for existing parameter with secondary prefix', () => {
      const params = getParams('swb_log=warn')
      expect(params.has('log')).toBeTruthy()
    })

    it('returns false for missing parameter', () => {
      const params = getParams('log=warn')
      expect(params.has('log')).toBeFalsy()
    })
  })
})
