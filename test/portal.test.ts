
import assert from "assert";
import { PORTAL_SURFACE, REGISTERED_PRODUCTS, publicProducts } from "../src/lib/products-registry";
import { JarvisEngine } from "../src/lib/jarvis-engine";

assert.strictEqual(PORTAL_SURFACE.forSaleOrLease, false);
assert.ok(!REGISTERED_PRODUCTS.some((p) => p.id === "NEX-PORTAL"));
assert.ok(REGISTERED_PRODUCTS.every((p) => p.forSaleOrLease === false && p.priceUSD === 0));
assert.ok(publicProducts().every((p) => p.publicVisible));
assert.ok(!publicProducts().some((p) => p.id === "NEX-DAGM"));

async function main() {
const sale = await JarvisEngine.processQuery({ query: "Is Nexorian Global Engineering Corp for lease?", context: "PUBLIC" });
assert.ok(sale.answer.toLowerCase().includes("not for sale or lease"));
assert.notStrictEqual(sale.truthState, "UNKNOWN");

const unknown = await JarvisEngine.processQuery({ query: "What is the quantum state of Alpha Centauri?", context: "PUBLIC" });
assert.strictEqual(unknown.truthState, "UNKNOWN");
assert.ok(unknown.answer.includes("Epistemic status: UNKNOWN"));

console.log("portal registry and jarvis lease refusal passed");
}
main();
