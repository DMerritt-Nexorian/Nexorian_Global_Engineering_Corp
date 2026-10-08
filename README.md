# Nexorian Global Engineering Corp

Operating portal for this repository. The company name is not a product, and nothing in this application is offered for sale or lease.

What runs here:

- Registry of named repositories, with implementation status and limitations.
- Jarvis, bound to repository inspection, confined file reads, the local N=8 NTT, and the experimental lattice kernel.
- Demonstrations at `/demos/ntt` and `/demos/pqc`. The lattice kernel is experimental. It is not FIPS 203 or FIPS 204.
- Founder console only when `FOUNDER_ACCESS_TOKEN` is set on the server and presented to `/api/access`.

What does not run here:

- Payments, leases, downloads, or checksummed release artifacts.
- A 3D entity, a web application firewall, or an air-gapped data room.
- Kani. Proof harnesses are in `Core_Sec_NTT`, not in this repository.

DigitalOcean:

- Build command: `npm run build`
- Run command: `npm start`
- HTTP port: `8080` if the platform sets `PORT`, otherwise Next.js uses `3000`. Set the platform port to the value it injects.
- Environment: `FOUNDER_ACCESS_TOKEN` for the founder console. Do not commit it.

HD-GTLM in this portal is a software state machine of the supplied interlock rules. It is not a tape-out, a power measurement, or a safety certification.
