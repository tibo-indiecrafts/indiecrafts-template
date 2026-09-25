---
title: "Crypto helpers"
description: "AES-256-GCM encryption plus salted one-way hashing built on Web Crypto, with caller-injected keys."
status: stable
---

# Crypto helpers

> Symmetric encryption and salted hashing for at-rest PII and GDPR pseudonymisation.

## Purpose

Symmetric encryption (AES-256-GCM with an integrity tag) and one-way hashing (salted SHA-256) built on Web Crypto, so it runs on Node 22 and the Workers runtime with no dependency. Every function is async. The secret and salt are always caller-injected; the module holds no keys.

## Exports

- `EncryptedData` — the ciphertext, iv, and version shape produced by `encrypt`.
- `encrypt(plaintext, secret)` — encrypt a string; returns `EncryptedData`.
- `decrypt(data, secret)` — decrypt `EncryptedData`; rejects if the auth tag fails.
- `encryptObject(value, secret)` — encrypt any JSON-serialisable object.
- `decryptObject(data, secret)` — decrypt back to the original object shape.
- `hashIpAddress(ip, salt)` — salted, deterministic one-way IP hash.
- `verifyIpHash(ip, hash, salt)` — constant-time check of an IP against a stored hash.
- `fingerprintEmail(email, salt)` — salted one-way email fingerprint for erasure matching.
- `sha256Hex(input)` — unsalted, case-sensitive SHA-256 hex for exact-match secrets.
- `isEncryptedData(data)` — type guard for the `EncryptedData` shape.

## Usage

```ts
import { encrypt, decrypt } from "@indiecrafts/packages-shared-security/crypto";

const secret = process.env.PII_SECRET!;
const sealed = await encrypt("user@example.com", secret);
const plain = await decrypt(sealed, secret);
```

## Source

`code/packages/shared/security/src/crypto.ts`
