## What & Why

<!-- Intent, not implementation. Which backlog item / epic does this serve? -->

## Definition of Done (Engineering Playbook §19)

- [ ] Requirements satisfied (acceptance criteria from the Product Bible / backlog item)
- [ ] Implementation complete — no placeholder code
- [ ] Tests passing at all required levels (unit / integration / architecture)
- [ ] Documentation updated (OpenAPI, ADRs, master documents where behavior changed)
- [ ] Logging and error handling in place
- [ ] Security reviewed — **tenant isolation**, authZ, secrets, input validation
- [ ] No vendor SDK referenced from business logic (provider abstraction rule)
- [ ] Temporary workarounds tracked as technical debt (Roadmap §15)

## Review order (Engineering Playbook §9)

1. Tenant isolation & security → 2. Architecture-rule compliance → 3. Correctness & tests → 4. Readability → 5. Docs
