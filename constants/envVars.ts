if (!process.env.INFURA_PROJECT_ID) {
  throw new Error("INFURA_PROJECT_ID is empty");
}
export const INFURA_PROJECT_ID: string = process.env.INFURA_PROJECT_ID;
