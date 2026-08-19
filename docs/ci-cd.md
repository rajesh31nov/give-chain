# Continuous Integration & Quality Pipeline (CI/CD)

This document describes the automated CI pipeline configured for **GiveChain**.

## Pipeline Architecture

The CI pipeline is defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) and executes automatically on every `push` or `pull_request` to `main`.

### Job 1: `frontend-ci`
- **Node.js**: v20 with npm dependency caching.
- **`npm ci`**: Validates strict lockfile parity.
- **`npm run typecheck`**: Enforces zero TypeScript errors (`tsc --noEmit`).
- **`npm run lint`**: Enforces Next.js core web vitals and ESLint compliance.
- **`npm run test`**: Runs 22 Vitest frontend unit, component, RBAC, and integration tests.
- **`npm run build`**: Verifies Next.js 15 production bundle compilation across all 10 app router pages.

### Job 2: `contracts-ci`
- **Rust Toolchain**: Stable channel with target `wasm32-unknown-unknown`.
- **Cargo Caching**: Caches target dependencies and build artifacts via `Swatinem/rust-cache`.
- **`cargo test`**: Runs all 9 Soroban unit, panic assertion, double-distribution prevention, and inter-contract tests (`CampaignContract` & `DistributionContract`).
- **`cargo build --target wasm32-unknown-unknown --release`**: Validates optimized WASM compilation.

---

## Local Verification Commands

Developers can run the identical CI checks locally prior to opening a pull request:

```powershell
# Frontend Verification
npm ci
npm run typecheck
npm run lint
npm run test
npm run build

# Soroban Smart Contract Verification
cargo test
cargo build --target wasm32-unknown-unknown --release
```

---

## Security & Environment Variable Policy

- CI workflows mock RPC environment variables (`NEXT_PUBLIC_SOROBAN_RPC_URL`).
- No private key, seed phrase, or production secret is committed to the repository.
- Live Stellar Testnet deployments are intentionally isolated to Phase 8.
