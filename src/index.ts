const VERSION = 'v1';
const SEP = String.fromCharCode(31); // Unit Separator (ASCII 31)

function encodeBase64Url(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padLen);
  return Buffer.from(base64, 'base64').toString('utf8');
}

// 自定义错误类型
export class QPackerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QPackerError';
  }
}

export class QPacker {
  constructor(private fields: string[]) {}

  pack(data: Record<string, any>): string {
    const payload = this.fields.map(f => data[f] ?? '').join(SEP);
    const versionedPayload = `${VERSION}${SEP}${payload}`;
    return encodeBase64Url(versionedPayload);
  }

unpack(token: string): Record<string, string> {
  let decoded: string;
  try {
    decoded = decodeBase64Url(token);
  } catch (err) {
    throw new QPackerError('Invalid token format: ' + (err instanceof Error ? err.message : String(err)));
  }

  const parts = decoded.split(SEP);
  if (parts.length < 2) {
    throw new QPackerError(`Invalid token format: expected at least version and one field but got ${parts.length}`);
  }

  const [version, ...values] = parts;
  if (version !== VERSION) throw new QPackerError(`Unsupported version: ${version}`);

  if (values.length !== this.fields.length) {
    throw new QPackerError(`Invalid token format: expected ${this.fields.length} fields but got ${values.length}`);
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < this.fields.length; i++) {
    result[this.fields[i]] = values[i] ?? '';
  }
  return result;
}

  mutate(token: string, overrides: Partial<Record<string, string>>): string {
    const current = this.unpack(token);
    const merged = { ...current, ...overrides };
    return this.pack(merged);
  }
}
