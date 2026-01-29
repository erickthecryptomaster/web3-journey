import { ethers } from "ethers";

// Solo dejamos RPCs que suelen ser estables (puedes agregar más después)
const RPCS = [
  "https://ethereum.publicnode.com",
  "https://eth.llamarpc.com"
];

// Forzamos la red para evitar warnings de auto-detección
const NETWORK = { name: "mainnet", chainId: 1 };

async function main() {
  for (const url of RPCS) {
    try {
      const provider = new ethers.JsonRpcProvider(url, NETWORK);

      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);

      console.log("RPC OK:", url);
      console.log("Último bloque:", blockNumber);
      console.log("Hash:", block.hash);
      console.log("Timestamp:", block.timestamp);
      return;
    } catch (e) {
      console.log("RPC falló:", url);
      console.log("Motivo:", e?.shortMessage || e?.message);
      console.log("—");
    }
  }

  console.log("Ninguna RPC respondió. Revisa tu internet o inténtalo de nuevo.");
}

main();
