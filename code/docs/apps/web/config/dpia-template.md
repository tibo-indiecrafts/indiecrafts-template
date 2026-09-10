# Data-protection impact assessment (DPIA) template

A DPIA (GDPR Art. 35) assesses privacy risk before you build high-risk processing.

## 1. When you need a DPIA

Run a DPIA when the processing involves any of these:

- **Large-scale processing** — many data subjects, over a wide area, or ongoing.
- **Special-category data** — health, biometric, genetic, political, religious, or
  sexual-orientation data (Art. 9).
- **Systematic monitoring** — for example, tracking behavior or location over time.
- **New or high-risk technology** — profiling, automated decision-making, or a new
  technology with unknown risk.

This template's default processing — name, email, locale, and country, for a
marketing/blog site — is low-risk. It usually does not trigger a DPIA. See
[Records of processing (ROPA)](./ropa) for the current activities.

Adding high-risk processing does trigger one. Examples: biometric login, health
data, or large-scale profiling. Run this template before you ship that feature.
See [Privacy notices by regime & scope](./privacy-by-regime) for the
special-category-data boundary this template ships with.

## 2. The template

Fill in every [placeholder] before sign-off.

### Description of processing

- **Data collected:** [fields]
- **Purpose:** [why you process it]
- **Data subjects:** [who is affected]
- **Collection and storage:** [how you collect it, where you store it]
- **Lawful basis:** [Art. 6 basis; add the Art. 9 basis if special-category]

### Necessity and proportionality

- **Why this data is necessary:** [reasoning]
- **Less intrusive alternative considered:** [alternative, or "none"]
- **Minimization applied:** [what you cut or shortened]

### Risks to individuals

| Risk   | Likelihood            | Severity              |
| ------ | --------------------- | --------------------- |
| [risk] | [low / medium / high] | [low / medium / high] |

### Mitigations

- [mitigation]

### Residual risk

- **Remaining risk after mitigation:** [low / medium / high]
- **Acceptable?** [yes / no, with reasoning]

### Sign-off

- **DPO / privacy contact:** [name, email]
- **Date:** [date]
- **Decision:** [approved / approved with conditions / rejected]
