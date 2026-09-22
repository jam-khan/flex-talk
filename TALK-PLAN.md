**Applied changes: Evaluation summary and focused solver edits.**

The deck now has 35 slides. The two evaluation questions share one slide: click once for the RQ1 summary, again for RQ2, then advance directly to Ongoing / Future Work. The separate result slides and repeated closing diagram have been removed. In the solver section, “Zap would loop” has been removed; the cyclic/acyclic comparison now leads directly to Fix's initial candidates. The Sherlock Holmes slide has also been removed: its solution box now appears after the final fixpoint checks. The following slide shows the original and rewritten constraints side by side, with the solution visible, and a final click shows `grind` closing the remaining goal.

The Zap sequence now has three slides and ten reveal clicks (previously five slides and eighteen reveals): strongest-solution construction and simplification, the certified rewrite, and certificate construction. All use the simple range example. The first slide retains the Cosman–Jhala citation; the second shows `grind` producing a proof of the residual constraint and the certificate returning a proof of the original. All seven certificate proof states remain, with six combined highlight/transition clicks, a fixed solution definition, larger formulas, and an explicit explanation that `q.1` closes the unchanged conjunct. Budget about four minutes for Zap.

Ongoing / Future Work starts with the original Imp, lambda RK, and Flux diagram. Four clicks add Spacer as a direct oracle, LiquidHaskell, MVCGen/LOOM + CHCs, then LiquidLean. Dotted borders mark every addition as in progress; MVCGen/LOOM + CHCs and LiquidLean retain the green foundational style and Lean badge.

The broader proposal below is deferred. Jam prefers to retain more of the solver detail and review changes one at a time; the 18-slide outline is an earlier proposal, not the current deck or an agreed final cut.

**Earlier proposal: 18 slides, 22 minutes, for a PL / verification audience.**

Reserve the remaining three minutes for questions or overruns. This assumes a 25-minute total slot; the speaking target stays at 22 minutes even if questions are separate. Two of those 22 minutes belong to Jam's Ongoing / Future Work section.

This is the earlier proposed edit plan. The title-slide change, final section, and revised Evaluation are implemented. Slide numbers below refer to the original 44-slide deck (plus the originally appended #45), not the current numbering.

Based on [flex-paper.txt](flex-paper.txt), especially §§2–6 and the certification arguments in Appendices A–B, the talk should carry three claims:

1. CHCs are Lean propositions with existential predicate witnesses. Solving them can produce proofs checked by the kernel, while using arbitrary Lean theories.
2. Existing elimination and predicate-abstraction algorithms become practical foundational solvers through certified reductions: `zap` for acyclic variables, `fix` for cyclic variables, then ordinary Lean proof machinery.
3. The same backend supports verified generators for Imp and λRK, and expressive Rust verification through Flux. The experiments demonstrate useful automation, with a substantial runtime cost and manual work for the expressive case studies.

**Where the current time goes**

The solver section (#13–31) alone occupies 19 slides. The certificate walkthrough (#21) has 13 reveal steps; the three fixpoint-round slides (#25–27) add 11 more. These are substantial explanations even though some share a slide number. The deck also repeats the agenda four times, the frontend diagram three times including the conclusion, and the acyclic/cyclic comparison three times. The Rust case studies receive just one slide after all that machinery.

The main change should be to replace repeated derivations with one example per mechanism, and spend the recovered time showing why the mechanisms matter.

**Proposed running order and hard time budgets**

| New | Source in current deck | What to show and say | Time | Finish by |
| --- | --- | --- | --- | --- |
| 1 | #1 — title | Jam presents; acknowledge collaborators in one sentence. | 0:30 | 0:30 |
| 2 | Merge #2–5, using #5 as the base | One small program → CHCs → solver diagram, then the two problems: expressive specifications and the trusted solver. Explain unknown predicates in one sentence; omit the SMT tutorial and tool-name lists. | 1:30 | 2:00 |
| 3 | #6 — Flex | Lean propositions + kernel-checked proof terms. Preview the fallback to interactive proof when automation stops. | 1:00 | 3:00 |
| 4 | #11, folding in #9–10 | `foreach`: point at the refined callback argument, then the unknown loop invariant and its entry/preservation/use obligations. Explain refinement notation here. | 1:30 | 4:30 |
| 5 | #12 — `dot` | The same callback API, now with an unknown closure precondition. Array bounds explain why κ is needed. Avoid a separate contravariance lesson. | 1:00 | 5:30 |
| 6 | #14 — CHCs as Lean Props | Highlight `∃ κ : … → Prop`. A proof must provide the predicate and justify the clauses: this is the synthesis problem. | 1:00 | 6:30 |
| 7 | #15 — acyclic/cyclic | One comparison only: `dot` gives the acyclic example; `foreach` gives the cycle. Introduce the two tactics. | 0:30 | 7:00 |
| 8 | Merge #16–17 | `zap`: strongest solution → substitute in assumptions / discharge heads → residual VC. Use the `dot` example and at most two reveals. | 1:30 | 8:30 |
| 9 | Compress #18–21 | Keep `cert : c′ → c`, then one small constraint/solution/certificate correspondence from paper Fig. 4. Explain deterministic construction without traversing every proof state. | 2:00 | 10:30 |
| 10 | Compress #24–29; absorb #23 orally | `fix`: qualifiers → initial conjunction → discard unprovable candidates → inductive invariant. Show one rejected candidate and the surviving `lo ≤ i`; finish with the certified rewrite. | 2:00 | 12:30 |
| 11 | Simplify #31 | A pipeline strip: CHC → `zap` → `fix` → Lean tactics / interactive proof. Remove the new mixed-constraint formula. | 0:30 | 13:00 |
| 12 | Merge #33 + #36 | Frontend diagram with a compact semantic guarantee for Imp and λRK. State explicitly that Flux's generator remains trusted. | 1:30 | 14:30 |
| 13 | New detail drawn from paper §6.1 / Fig. 16 | RingBuffer: a quantified invariant ensures every valid slot is initialized; explain how it justifies `dequeue`'s read and is preserved. | 2:00 | 16:30 |
| 14 | Condense #37 | Brief breadth: sorting, ring buffer, bitvectors, hash table. State that these case studies include manual specifications and proofs. Do not read every statistic. | 0:30 | 17:00 |
| 15 | #41; absorb setup from #39–40 | Deterministic certificate construction matters: 100% acyclic reduction versus 67% / 90% for the search-based variants, across 369 constraints. | 1:00 | 18:00 |
| 16 | Merge #42–43 | Paper-reported 95.7% automatic on 880 constraints; 82.3% on the cyclic subset. Keep the cost visible: 31 seconds vs 21.8 minutes for the whole suite. | 1:30 | 19:30 |
| 17 | Replace #44's repeated diagram with a concise takeaway | CHC inference with kernel-checked proofs, expressive specifications, and verified generators where available. Transition from the current limitations to next steps. | 0:30 | 20:00 |
| 18 | #45 — Ongoing / Future Work | Jam's concrete ideas: at most two, with the problem, next experiment, and success criterion for each. | 2:00 | 22:00 |

**Exact cuts and backup moves**

| Current slides | Action | Reason / destination |
| --- | --- | --- |
| #2–4 — SMT, SMT verifiers, CHC verifiers | Fold into #5 as one compact motivating diagram. | This audience needs the interface and unknown predicates; three successive infrastructure diagrams delay the contribution. |
| #7 — Three verifiers on top of Flex | Remove this early copy. | Introduce the frontends once, with their guarantees, in new #12. |
| #8, #13, #32, #38 — Agenda | Remove all four from the short deck. | Use the preview on new #3 and spoken transitions. |
| #9–10 — Refinement types, Subtyping | Move to backup; explain notation on `foreach`. | Two standalone background slides are unnecessary for this audience. |
| #16–17 — strongest solution, rewrite | Merge into one slide. | The example already gives the solution; show what the tactic does with it. |
| #18–21 — certification sequence | Retain one replacement slide; move the detailed originals to backup. | Preserve the technical novelty without the disjunction/existential tutorial and 13-step proof walk. |
| #22 and #30 — repeated acyclic/cyclic comparisons | Remove. | New #7 establishes the distinction once. |
| #23 — Zap would loop | Move to backup; explain the recursive dependency in one sentence before `fix`. | The loop example already motivates approximation. |
| #24–27 and #29 — qualifiers, three rounds, rewrite | Replace with one slide; keep detailed rounds in backup. | One failed candidate plus the final invariant is enough to convey predicate abstraction. |
| #28 — Sherlock Holmes quotation | Remove. | The algorithm summary already makes the point. |
| #31 — full pipeline | Keep only the pipeline and tactic line. | A third, mixed CHC creates a fresh example to decode. |
| #34–35 — Imp Fibonacci example, λRK syntax | Move to backup. | Preserve generation soundness in new #12; use the example budget on Rust expressiveness. |
| #36 — λRK soundness | Fold its end-to-end statement into #33. | Keep the verified-generation contribution without introducing all intermediate judgments. |
| #37 — case studies | Split emphasis into a concrete RingBuffer example and a brief breadth slide. | The paper's payoff deserves an explanation, not only a list of results. |
| #39–40 — questions and construction/search setup | Remove as standalone slides; fold the comparison definition into #41. | State what is measured directly beside the result. |
| #42–43 — full-pipeline experiment | Merge. | Setup, coverage, and cost are one argument. |
| #44 — closing diagram | Replace with a short takeaway, then future work. | Avoid a third presentation of the frontend diagram and a premature ending. |

Put backup material outside the normal presentation sequence, so Ongoing / Future Work remains the final main slide. Keep navigable backups for certificate construction, predicate-abstraction rounds, Imp, λRK syntax/soundness, and experiment details.

**What the replacement slides should contain**

The certificate slide should retain one concrete insight from §4.3: the path used to construct the solution also tells us how to construct its proof. Use this small version of Fig. 4 next to `cert : c′ → c`:

| At a constraint path | In the solution | In the certificate |
| --- | --- | --- |
| Choose a conjunct | Choose a disjunct | `inl` / `inr` |
| Encounter a bound variable | Existentially bind it | Supply that variable as witness |
| Encounter an assumption | Conjoin it | Supply the hypothesis |
| Reach the Horn application | Equate parameters to arguments | `rfl` |

This preserves why the solver constructs certificates directly, and gives the later performance comparison a clear purpose. For `fix`, explain that the proof oracle supplies the proofs at Horn heads.

The RingBuffer slide should show a tiny buffer picture or `dequeue` snippet alongside the invariant, schematically:

```text
∀ i, 0 ≤ i ∧ i < capacity → valid_index(buffer, i) → initialized(i)
```

Explain the two obligations: the read is permitted, and advancing the head preserves the invariant. Lean supplies the quantified specification and proof tools; Flux handles the Rust program and produces the obligations. Mention that the paper uses a trusted wrapper around potentially uninitialized storage. Keep modular-arithmetic details and the full code in backup. This replaces the Imp example as the detailed payoff and uses material already in the paper.

**Accuracy to preserve while shortening**

- The algorithms build on Fusion and predicate abstraction. The contribution is their foundational realization and certification, together with verified generators and expressive verification—not inventing those algorithms.
- Kernel checking establishes the generated CHC. End-to-end foundational program guarantees also need verified generation: the paper provides this for Imp and λRK; Flux's Rust frontend remains trusted. Imp's guarantee is partial correctness.
- The 369-constraint experiment replaces Zap's certificate-construction step with `grind` / `aesop`; it is not a comparison against asking those tactics to solve arbitrary CHCs from scratch. The wall-clock multipliers are **13× / 22×**; **18× / 34×** are heartbeat ratios (Table 2).
- The 880-constraint automatic benchmark excludes the expressive `flex-bench` case studies. Keep that distinction visible when moving between the two evaluations. Table 4 reports the full-pipeline numbers; the deck calls this RQ2, whereas the paper calls it RQ3. Descriptive titles avoid the renumbering issue.
- Soften #37's blanket “none of this was expressible in Flux.” The paper distinguishes specifications outside Flux's former restrictions from expressible bitvector problems that time out. A better line is “Beyond Flux's former specification restrictions and SMT automation.”
- For the displayed `foreach`, keep the slide's valid invariant `lo ≤ i`. The stronger `lo ≤ i ∧ i ≤ hi` in the paper's overview needs an entry assumption such as `lo ≤ hi`, which this example does not require.

**Future work and rehearsal**

The implemented final section is a title card with private speaker notes; the specific ideas await Jam's input. Reserve two minutes now. Possible prompts grounded in the paper are qualifier inference / refinement (§§6.3, 7), solver performance (§6.3), or additional verified frontends (§7). These are discussion options, not claims about ongoing work and are not inserted into the slides.

Rehearse against three checkpoints: solver pipeline finished by **13:00**, evidence finished by **19:30**, future work starts by **20:00**. Limit the compressed solver slides to two or three meaningful reveals each. If behind, skip the 30-second case-study breadth slide and shorten the one-minute Zap benchmark to its coverage headline; preserve the Rust example, trust boundary, runtime cost, and future-work slot.
