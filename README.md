# Numeron

Numeron is an on-chain world built through the Dubhe Engine with the Monster Hunter template

## Project Structure

- [AI](./eliza-config) Chain thinker with elizaOS AI
- [Contracts](./contracts) Move Based Build Wiht Dubhe Engine Toolchains
- [Numeron Code](./src) User Client Interface

---

## Quick Start

### Start Eliza

```bash
git clone https://github.com/elizaos/eliza.git

cd eliza

pnpm install --no-frozen-lockfile

pnpm run build

write .env file (set sui private key and AI model key)

pnpm run start --character=eliza-config/numeron.character.json
```

### Start Numeron Project

```bash
1. install sui <https://docs.sui.io/build/install>

2. cd Numeron/

3. pnpm install

4. open new window && pnpm start:localnet

5. open new window && pnpm dev
```

Environment: node.js (v18.20.0+) ([download](https://nodejs.org/en/download/))

> Please use `node -v` check your node version

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).


## Prerequisites

- [Dubhe Engine](https://dubhe.obelisk.build/dubhe)
- Nextjs

