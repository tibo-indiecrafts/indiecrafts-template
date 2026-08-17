# Unit economics — <project>

The finance gap `pm` doesn't cover. Fill with real numbers; feed by `data:*`
(actuals) + `pm-product-strategy:pricing-strategy`. A business is viable when
**LTV > 3× CAC** and **CAC payback < 12 months**.

## Inputs

| Metric                                    | Value                 | Source                 |
| ----------------------------------------- | --------------------- | ---------------------- |
| ARPU / avg revenue per customer per month |                       | pricing                |
| Gross margin %                            |                       | costs                  |
| Avg customer lifetime (months)            | 1 / monthly churn     | `data:cohort-analysis` |
| CAC (fully loaded acquisition cost)       | spend ÷ new customers | `data`, ads            |
| Fixed monthly costs (runway burn)         |                       |                        |
| Cash on hand                              |                       |                        |

## Derived

- **LTV** = ARPU × gross-margin × lifetime-months
- **LTV : CAC** = LTV ÷ CAC → target **≥ 3**
- **CAC payback (months)** = CAC ÷ (ARPU × gross-margin) → target **< 12**
- **Break-even customers** = fixed-costs ÷ (ARPU × gross-margin)
- **Runway (months)** = cash ÷ net monthly burn

## Rule

Re-run after any pricing or channel change. If LTV:CAC < 3 → fix retention or
pricing before scaling spend. Chart the trend with `dataviz` / `data:build-dashboard`.
