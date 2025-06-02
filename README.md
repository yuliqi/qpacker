# qpacker

[![npm version](https://img.shields.io/npm/v/qpacker.svg)](https://www.npmjs.com/package/qpacker)
[![build status](https://github.com/yuliqi/qpacker/actions/workflows/release.yml/badge.svg)](https://github.com/yuliqi/qpacker/actions)
[![license](https://img.shields.io/npm/l/qpacker.svg)](https://github.com/yuliqi/qpacker/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/qpacker.svg)](https://www.npmjs.com/package/qpacker)

> A minimal versioned field-based data packer for token-like use cases.  
> Light. Safe. Typed.

---

## English Version

### ✨ Features

- ✅ Deterministic field-based encoding/decoding
- ✅ Compact versioned format
- ✅ Custom field order
- ✅ Mutation support (change field values)
- ✅ ESM & CJS support
- ✅ Full TypeScript typings

### 📥 Installation

```bash
npm install qpacker
```

### 🚀 Quick Start

```ts
import { QPacker, QPackerError } from 'QPacker';
const fields = ['userId', 'username', 'role'];
const packer = new QPacker(fields);

try {
  // 1. pack
  const token = packer.pack({ userId: '123', username: 'alice', role: 'admin' });
  console.log('Packed token:', token);

  // 2. unpack
  const data = packer.unpack(token);
  console.log('Unpacked data:', data);

  // 3. mutate token 中某字段
  const newToken = packer.mutate(token, { role: 'superadmin' });
  console.log('Mutated token:', newToken);

  // 4. unpack token
  const newData = packer.unpack(newToken);
  console.log('Unpacked mutated data:', newData);

} catch (error) {
  if (error instanceof QPackerError) {
    console.error('QPacker error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}

// 5. test error token
try {
  packer.unpack('invalid.token.string');
} catch (error) {
  if (error instanceof QPackerError) {
    console.error('Expected QPacker error on invalid token:', error.message);
  }
}

```

### 🧩 API Reference

- `new QPacker(fields: string[])` - define field order

- `pack(data: Record<string, string>): string` - pack object to token

- `unpack(token: string): Record<string, string>` - unpack token to object

- `mutate(token: string, patch: Record<string, string>): string` - update token fields

### 🧪 Run Tests

```bash
npm test
```

### 📄 License

[MIT](http://opensource.org/licenses/MIT)