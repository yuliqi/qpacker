import { describe, it, expect } from 'vitest';
import { QPacker } from '../src/index';

describe('QPacker', () => {
  const fields = ['a', 'b', 'c'];
  const packer = new QPacker(fields);

  it('should pack and unpack correctly', () => {
    const data = { a: 'hello', b: 'world', c: '!' };
    const token = packer.pack(data);
    expect(typeof token).toBe('string');

    const unpacked = packer.unpack(token);
    expect(unpacked).toEqual(data);
  });

  it('should handle missing fields as empty string', () => {
    const data = { a: 'foo' };
    const token = packer.pack(data);
    const unpacked = packer.unpack(token);
    expect(unpacked).toEqual({ a: 'foo', b: '', c: '' });
  });

  it('should throw error on unsupported version', () => {
    const invalidToken = Buffer.from('v2\u001Fhello\u001Fworld\u001F!').toString('base64');
    // Encode as base64url format:
    const base64url = invalidToken.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    expect(() => packer.unpack(base64url)).toThrow('Unsupported version: v2');
  });

  it('should mutate token fields correctly', () => {
    const data = { a: '1', b: '2', c: '3' };
    const token = packer.pack(data);

    const mutated = packer.mutate(token, { b: 'changed', c: 'new' });
    const unpacked = packer.unpack(mutated);

    expect(unpacked).toEqual({ a: '1', b: 'changed', c: 'new' });
  });
});
