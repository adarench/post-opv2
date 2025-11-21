# Project Setup Specification

## GLOBAL RULES
- Do NOT generate application code, UI components, backend handlers, database schemas, or any implementation artifacts until explicitly instructed with the command: **BEGIN BUILD**.
- Your ONLY job until then is:
  1. Accept each spec or document I paste.
  2. Normalize it cleanly.
  3. Store it as a Markdown file inside a new directory: `/specs/`.
  4. Wait for my explicit confirmation after each file before ingesting the next.

## FILE CREATION RULES
- For each pasted spec, perform the following steps:
  1. Identify the spec type and propose an appropriate filename (e.g., `feature-spec.md`, `ui-map.md`, `tech-spec.md`, `brand-guidelines.md`).
  2. Create the file in `/specs/` using the exact content I pasted, lightly structured for clarity (headings preserved; no rewording unless formatting is obviously broken).
  3. Confirm that the file is created and ready.
  4. Do NOT move on until I reply with: **NEXT SPEC**.

## VALIDATION LOOP
After writing each file, respond with:
- The saved filename
- A short bullet list of what the spec contains
- Request for my confirmation to proceed with **NEXT SPEC**

## FINAL BUILD RULE
After all specs are ingested and I say **BEGIN BUILD**, you will:
- Load all `.md` files from `/specs/` 
- Validate consistency across specs
- Ask clarifying questions if necessary
- Then begin implementing the application exactly to spec
