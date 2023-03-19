if (!process.env.INFURA_PROJECT_ID) {
  throw new Error("INFURA_PROJECT_ID is empty");
}
export const INFURA_PROJECT_ID: string = process.env.INFURA_PROJECT_ID;

if (!process.env.WORMHOLE_RPC) {
  throw new Error("WORMHOLE_RPC is empty");
}
export const WORMHOLE_RPC: string = process.env.WORMHOLE_RPC;
