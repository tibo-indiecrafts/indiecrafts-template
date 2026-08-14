// Stubs the `server-only` package so modules that import it can be unit-tested.
// The real package throws if imported into a client bundle; in tests we only
// exercise the pure logic, so a no-op is safe.
export {};
