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
import { QPacker } from 'qpacker';

const qp = new QPacker(['uid', 'role', 'exp']);

const token = qp.pack({ uid: '123', role: 'admin', exp: '9999' });
console.log(token);

const data = qp.unpack(token);
console.log(data);
```

### 🔧 Field Mutation

```ts
const newToken = qp.mutate(token, { role: 'superadmin' });
const newData = qp.unpack(newToken);
console.log(newData);
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