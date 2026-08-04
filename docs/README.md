# Documentation

Everything about how this site was designed and built.

## If you only read one

**[07 · Content guide](./07-content-guide.md)** — how to put your actual
portfolio into the site. That is the thing you came back to do.

## The set

| | Doc | What's in it |
| --- | --- | --- |
| 00 | [Brief](./00-brief.md) | What was asked for, how it changed mid-build, and the definition of done. |
| 01 | [Design system](./01-design-system.md) | The token scale, measured contrast ratios, and the rules the design holds itself to. |
| 02 | [Typography](./02-typography.md) | Three families, the fluid scale, and the details that matter at display sizes. |
| 03 | [Components](./03-components.md) | 21st.dev provenance — exactly what was retrieved, what was changed, and what was built by hand. |
| 04 | [Architecture](./04-architecture.md) | Project structure, the server/client split, and known trade-offs. |
| 05 | [Accessibility](./05-accessibility.md) | Audit results, and an honest list of what is *not* covered. |
| 06 | [Motion](./06-motion.md) | The motion vocabulary, and the restraint rules that stop it becoming a showreel. |
| 07 | [Content guide](./07-content-guide.md) | **Filling the site in.** Field lengths, images, re-skinning. |
| 08 | [Performance](./08-performance.md) | Rendering decisions and the no-state-on-pointer rule. |
| 09 | [Responsive](./09-responsive.md) | Verified widths and mobile-specific decisions. |
| 10 | [Decisions](./10-decisions.md) | Every non-obvious call, with the alternative that lost. |
| 11 | [Build log](./11-build-log.md) | How it got built, in order, including everything that broke. |
| 12 | [Deployment](./12-deployment.md) | Shipping it, and the pre-flight checklist. |
| 13 | [QA checklist](./13-qa-checklist.md) | The `ui-ux-pro-max` pre-delivery checklist, worked through item by item. |
| 14 | [21st.dev log](./14-21st-dev-log.md) | Every catalogue search, and why each result was taken or rejected. |
| 15 | [Next steps](./15-next-steps.md) | What to build next, in the order worth building it. |
| 16 | [Gold filaments](./16-floating-paths.md) | The flowing line treatment — tuning, per-section table, and the sub-pixel trap. |

## The three things worth knowing up front

**All content lives in one file.** `src/content/site.ts`. No copy is hard-coded
into a component.

**One line re-skins the entire site.** `--accent` in `src/app/globals.css` is
the only chromatic value in the palette.

**Every placeholder is obviously a placeholder.** Nothing on the site claims
anything about anyone. That is deliberate — see
[00 · Brief](./00-brief.md).
