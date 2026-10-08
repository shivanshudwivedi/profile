# Shivanshu Dwivedi — Portfolio

Static HTML, CSS, inline SVG, Canvas 2D and vanilla JavaScript. Self-hosted Inter;
no build step, runtime dependencies, analytics or external font requests.

## Run

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

## Design

Studied [Anduril's homepage](https://www.anduril.com/) and
[Lattice Mesh](https://www.anduril.com/lattice/lattice-mesh), including rendered
font weight, tracking, line height, centered navigation and the expanded company
panel. This page uses original artwork and code with its existing Inter font;
reference logos, photography, fonts and source are not copied.

The navigation uses a name wordmark, three centered section links and an About
disclosure. Its colors follow the section behind it. The expanded panel contains
experience, education, awards and external profiles; phones also put the main
sections there. The native disclosure works without JavaScript. Escape returns
focus, choosing a destination closes the panel, and clicking or focusing outside
closes it.

Warm ivory and true black establish contrast, with restrained champagne accents.
All dark section and artwork backgrounds are black; there are no blue or navy
surfaces. A reflective graphite woven surface replaces the cobalt hero. Dedicated
empty gradient bands blend the light and black chapters; essential text stays on
solid surfaces. The navigation follows both chapters and transition bands.

The opening uses bold mixed-case typography and an original rotating woven torus.
A geometric surface, perspective, depth sorting and traveling highlights produce
the motion in Canvas 2D. It is decorative artwork, not operational telemetry.
Rendering is capped at 30fps and 1.5 device pixel density, with fewer faces on
smaller displays. The scene pauses offscreen, in hidden documents, behind the
expanded navigation and when motion is disabled. A static SVG is the fallback.

The previous stacked stylesheet was replaced with one coherent system. The page
uses alternating full-width features and paired venture panels, illustrated
research, an engineering index, experience rows, education and leadership, a
bibliography and an awards table. The factual work and results are preserved. The complete research index now
includes all 14 Scholar records, the CV’s neutrino manuscript in preparation and
its September 2025 LVK presentation. The earlier quantum-control preprint remains
explicitly linked to the journal version; 16 records do not imply 16 independent
papers. Unpublished work retains its last supplied status. Diagrams are original illustrations, not product
screenshots or measured scientific plots. Diagram labels stay readable rather
than shrinking with their SVGs.

Motion includes routing pulses, revolving community points, a rotating event
symbol, the identity wallet in depth, quantum-control paths, a LIGO trace and
vector-graph flow. Both motion controls synchronize and persist the preference.
The operating system's reduced-motion setting takes precedence. Essential text
is never hidden behind entrance animations; scrolling stays native.

Reading copy is 19px on desktop and 18px on phones, with supporting labels at
least 16px. Secondary text is brighter on black and darker on ivory. Diagram
labels remain opaque; table titles are 18px and row text is 17px. Native dialog Escape and focus return, semantic table headers and
labeled table records on smaller displays remain. CSS and JavaScript URLs carry
content versions to prevent stale browser caches hiding changes.

## Evidence

Commercial and personal results come from Shivanshu's supplied resumes and
first-person updates. They are not independently verified analytics. Yaaro's
20K+ figure is presented as users, not monthly active users; its $12K fundraising
is not assigned an unconfirmed financing type. The personal orchestrator has
45+ days of use and helped arrange 170+ client calls and meetings. No accuracy
percentage has been invented.

The [LIGO paper](https://arxiv.org/html/2511.19682v1) supports up to 10x lower
residual motion versus linear filtering in offline evaluation. It does not
establish completed deployment of this model in a detector. The research grant
amount comes from the supplied resume. OrbitFormer results are the author's
reported benchmark, not an independently rerun evaluation.

The [ConnectED website](https://www.connectedevent.net/) supplies its campus-event
workflow and [App Store destination](https://apps.apple.com/us/app/connected-explore-events/id6758779763).
The older generic campus-social description is replaced with the current event
product; this is one founder project, not two duplicate ventures.

The eIDAS work uses September 2024–May 2025 dates and the confirmed wallet/mobile
ownership. The [Trinity feature](https://www.trincoll.edu/reporter/the-trinity-reporter-fall-2024/along-the-walk/fulbright-for-syta/)
credits Prof. Ewa Syta with the Fulbright award. It remains a research
implementation. Linking TrinityWallet does not assert sole authorship of that
repository or claim certification.

[Trinity's research feature](https://www.trincoll.edu/news/qa-trinity-student-and-faculty-research-collaboration-leads-to-published-paper/)
confirms the March 2026 APL Machine Learning publication. Preprints and conference
presentations are labeled separately from peer-reviewed papers.

Employer product names and the independent venture's actual name remain private.
The public orchestrator is a personal tool, separate from the employer's three
production products.

## Files and interactions

- `index.html`: content, artwork, navigation, tables and wallet details.
- `styles.css`: responsive type, layout, scenes, interactions and print styling.
- `script.js`: the torus, navigation lifecycle, reading progress, wallet dialog,
  bibliography controls and persistent motion preference.
- `fonts/`, `og.png`, `favicon.svg`, `apple-touch-icon.png`: existing local assets.

## Validation

Checked 320, 390, 680, 768, 960, 1100 and 1440px layouts for page overflow and
clipped reading text. Tested menu expansion, Escape/focus return, destination
closure, wallet Escape/focus return, combined bibliography filters and search,
empty results and persistent motion pause. The no-script fixture checks the
native menu, static artwork, wallet disclosure and complete bibliography and is
excluded from the release. JavaScript syntax, asset versions, metadata, unique
IDs, anchors, table header references, privacy and factual text preservation are
checked in the handoff verification record.
