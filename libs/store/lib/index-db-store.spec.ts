import { IDbStoreService } from './index-db-store';

describe('IDbStoreService', () => {
  it('rejects reads when the database cannot be opened', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
    const request = {} as IDBOpenDBRequest;
    const open = jest.fn(() => request);
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: { open },
    });

    try {
      const service = new IDbStoreService<{ items: { id: number } }>({
        name: 'unavailable', version: 1, objects: [],
      });
      const result = service.selectList('items');
      const error = new Event('error');
      request.onerror!.call(request, error);

      await expect(result).rejects.toBe(error);
      expect(open).toHaveBeenCalledWith('unavailable', 1);
    } finally {
      consoleError.mockRestore();
      if (original) {
        Object.defineProperty(globalThis, 'indexedDB', original);
      } else {
        Reflect.deleteProperty(globalThis, 'indexedDB');
      }
    }
  });
});
