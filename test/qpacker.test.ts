import { describe, it, expect } from 'vitest';
import { QPacker, QPackerError } from '../src/index';

const fields = ['userId', 'username', 'role'];
const packer = new QPacker(fields);

describe('QPacker', () => {
  it('should pack and unpack correctly', () => {
    const data = { userId: '123', username: 'alice', role: 'admin' };
    const token = packer.pack(data);
    expect(typeof token).toBe('string');

    const unpacked = packer.unpack(token);
    expect(unpacked).toEqual(data);
  });

  it('should mutate token correctly', () => {
    const original = { userId: '123', username: 'alice', role: 'admin' };
    const token = packer.pack(original);

    const newToken = packer.mutate(token, { role: 'superadmin' });
    const unpacked = packer.unpack(newToken);
    expect(unpacked.role).toBe('superadmin');
    expect(unpacked.userId).toBe('123');
  });

  it('should throw error on unsupported version', () => {
    // 构造一个版本错误的 token
    const badToken = Buffer.from('v2\u001F123\u001Falice\u001Fadmin').toString('base64');
    const badTokenUrl = badToken.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    expect(() => packer.unpack(badTokenUrl)).toThrow(QPackerError);
    expect(() => packer.unpack(badTokenUrl)).toThrow(/Unsupported version/);
  });

  it('should throw error on invalid token format', () => {
    expect(() => packer.unpack('invalid.token.string')).toThrow(QPackerError);
    expect(() => packer.unpack('invalid.token.string')).toThrow(/Invalid token format/);
  });

  it('should throw error on insufficient fields', () => {
    // 只包含一个字段的payload
    const partialPayload = Buffer.from('v1\u001Fonlyonefield').toString('base64');
    const partialPayloadUrl = partialPayload.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    expect(() => packer.unpack(partialPayloadUrl)).toThrow(QPackerError);
    expect(() => packer.unpack(partialPayloadUrl)).toThrow(/expected 3 fields but got 1/);
  });
});
