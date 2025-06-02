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
  const padLen = 4 - (base64.length % 4);
  if (padLen !== 4) base64 += '='.repeat(padLen);
  return Buffer.from(base64, 'base64').toString('utf8');
}

export class QPacker {
  constructor(private fields: string[]) {}

  pack(data: Record<string, any>): string {
    const payload = this.fields.map(f => data[f] ?? '').join(SEP);
    const versionedPayload = `${VERSION}${SEP}${payload}`;
    return encodeBase64Url(versionedPayload);
  }

  unpack(token: string): Record<string, string> {
    const decoded = decodeBase64Url(token);
    const [version, ...values] = decoded.split(SEP);
    if (version !== VERSION) throw new Error(`Unsupported version: ${version}`);
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
