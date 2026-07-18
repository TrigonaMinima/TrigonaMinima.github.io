---
layout: post
title: "Point-in-Time Joins"
date: "2026-07-18"
categories: ML
---

## Intro

At serving time, a model only ever sees a feature's most recent value. So when training rows are reconstructed from history, each row has to carry the feature value that existed *at that moment*, not the value the feature holds today. A join that respects this is point-in-time correct: for a label at time `T`, every feature resolves to the latest value known at or before `T`. A join that ignores it just grabs whatever's newest in the table, which for a label sitting in the past is a value from that label's future.

The figures below should make this concrete: one customer, one feature (`total_spend`), and three prediction times sitting at different points in its history.

<div class="pit-fig-group">

<figure class="pit-fig">
<div class="pit-fig-scroll">
<svg viewBox="0 0 820 224" role="img" aria-label="total_spend rising in three steps over six weeks, with three prediction times marked on the axis">
  <line class="pit-fig-axis" x1="70" y1="170" x2="760" y2="170"/>
  <g class="pit-fig-ticks">
    <line x1="70" y1="166" x2="70" y2="174"/><text x="70" y="192">Jan 1</text>
    <line x1="147" y1="166" x2="147" y2="174"/><text x="147" y="192">Jan 6</text>
    <line x1="377" y1="166" x2="377" y2="174"/><text x="377" y="192">Jan 21</text>
    <line x1="622" y1="166" x2="622" y2="174"/><text x="622" y="192">Feb 6</text>
    <line x1="760" y1="166" x2="760" y2="174"/><text x="760" y="192">Feb 15</text>
    <text x="223" y="206">Jan 11</text>
    <text x="438" y="206">Jan 25</text>
    <text x="683" y="206">Feb 10</text>
  </g>
  <polyline class="pit-fig-line" points="147,141 377,141 377,106 622,106 622,50 760,50"/>
  <g class="pit-fig-nodes">
    <circle cx="147" cy="141" r="5"/><text x="147" y="129">120 USD</text>
    <circle cx="377" cy="106" r="5"/><text x="377" y="94">340 USD</text>
    <circle cx="622" cy="50" r="5"/><text x="622" y="38">690 USD</text>
  </g>
  <text class="pit-fig-tag" x="147" y="22">total_spend (line height = value)</text>
  <g class="pit-fig-events">
    <circle cx="223" cy="170" r="7"/><text x="223" y="158">A</text>
    <circle cx="438" cy="170" r="7"/><text x="438" y="158">B</text>
    <circle cx="683" cy="170" r="7"/><text x="683" y="158">C</text>
  </g>
</svg>
</div>
<figcaption>The setup: <code>total_spend</code>'s real update history, with three prediction times (A, B, C) marked on the axis.</figcaption>
</figure>

<figure class="pit-fig">
<div class="pit-fig-scroll">
<svg viewBox="0 0 820 190" role="img" aria-label="Naive join: predictions A and B both resolve to the value recorded on Feb 6, reaching into their own future">
  <defs>
    <marker id="pit-ah-bad" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" class="pit-fig-arrowhead-bad"/>
    </marker>
    <marker id="pit-ah-good" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" class="pit-fig-arrowhead-good"/>
    </marker>
  </defs>
  <line class="pit-fig-axis" x1="70" y1="150" x2="760" y2="150"/>
  <g class="pit-fig-ticks">
    <text x="223" y="170">Jan 11 (A)</text>
    <text x="438" y="170">Jan 25 (B)</text>
    <text x="622" y="170">Feb 6</text>
    <text x="683" y="170">Feb 10 (C)</text>
  </g>
  <circle cx="622" cy="50" r="6" class="pit-fig-node-bad"/>
  <text x="622" y="38" class="pit-fig-label-bad">690 USD</text>
  <text x="622" y="26" class="pit-fig-tag-bad">latest value</text>
  <path class="pit-fig-arrow-bad" marker-end="url(#pit-ah-bad)" d="M223,146 C 350,120 480,90 612,58"/>
  <path class="pit-fig-arrow-bad" marker-end="url(#pit-ah-bad)" d="M438,146 C 500,120 550,90 612,60"/>
  <path class="pit-fig-arrow-good" marker-end="url(#pit-ah-good)" d="M683,146 C 660,120 630,90 618,62"/>
  <g class="pit-fig-events">
    <circle cx="223" cy="150" r="6"/><text x="223" y="138">A</text>
    <circle cx="438" cy="150" r="6"/><text x="438" y="138">B</text>
    <circle cx="683" cy="150" r="6"/><text x="683" y="138">C</text>
  </g>
  <text class="pit-fig-label-bad" x="330" y="100" transform="rotate(-12 330 100)">reaching into the future</text>
</svg>
</div>
<figcaption>Naive: every prediction reads the same latest node. Wrong for A and B, since Feb 6 hadn't happened yet at their prediction times. Right for C only because Feb 6 already lay in its past by then.</figcaption>
</figure>

<figure class="pit-fig">
<div class="pit-fig-scroll">
<svg viewBox="0 0 820 210" role="img" aria-label="Point-in-time join: each prediction resolves to whatever value was true at its own time">
  <defs>
    <marker id="pit-ah-good" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" class="pit-fig-arrowhead-good"/>
    </marker>
  </defs>
  <polyline class="pit-fig-line" style="opacity:.5" points="147,141 377,141 377,106 622,106 622,50 760,50"/>
  <line class="pit-fig-axis" x1="70" y1="170" x2="760" y2="170"/>
  <g class="pit-fig-ticks">
    <text x="223" y="192">Jan 11 (A)</text>
    <text x="438" y="192">Jan 25 (B)</text>
    <text x="683" y="192">Feb 10 (C)</text>
  </g>
  <path class="pit-fig-arrow-good" marker-end="url(#pit-ah-good)" d="M223,164 L223,143"/>
  <path class="pit-fig-arrow-good" marker-end="url(#pit-ah-good)" d="M438,164 L438,108"/>
  <path class="pit-fig-arrow-good" marker-end="url(#pit-ah-good)" d="M683,164 L683,52"/>
  <g class="pit-fig-badges">
    <rect x="203" y="127" width="40" height="18" rx="4"/><text x="223" y="140">120</text>
    <rect x="418" y="92" width="40" height="18" rx="4"/><text x="438" y="105">340</text>
    <rect x="663" y="36" width="40" height="18" rx="4"/><text x="683" y="49">690</text>
  </g>
  <g class="pit-fig-events">
    <circle cx="223" cy="170" r="7"/><text x="210" y="174" text-anchor="end">A</text>
    <circle cx="438" cy="170" r="7"/><text x="425" y="174" text-anchor="end">B</text>
    <circle cx="683" cy="170" r="7"/><text x="670" y="174" text-anchor="end">C</text>
  </g>
</svg>
</div>
<figcaption>Point-in-time: each prediction reaches straight up, never forward, and lands on whatever value was actually true at that moment.</figcaption>
</figure>

</div>

<style>
.pit-fig-group {
  --fig-line: var(--brand-color);
  --fig-bad: #c0392b;
  --fig-good: #1f7a4d;
  --fig-mono: Monaco, Consolas, "Lucida Console", monospace;
}
html[data-theme="dark"] .pit-fig-group {
  --fig-bad: #e0574a;
  --fig-good: #3ecb8a;
}
.pit-fig {
  margin: 1.6em 0;
  padding: 14px 14px 4px;
}
.pit-fig-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.pit-fig-scroll svg {
  display: block;
  width: 100%;
  min-width: 700px;
  height: auto;
}
.pit-fig figcaption {
  font-size: 0.8em;
  font-style: italic;
  margin: 0.5em 4px 0.9em;
}
.pit-fig-axis {
  stroke: var(--grey-color-light);
  stroke-width: 1.5;
}
.pit-fig-ticks line {
  stroke: var(--grey-color-light);
  stroke-width: 1.5;
}
.pit-fig-ticks text {
  fill: var(--muted-text-color);
  font-size: 11px;
  font-family: var(--fig-mono);
  text-anchor: middle;
}
.pit-fig-line {
  fill: none;
  stroke: var(--fig-line);
  stroke-width: 2.5;
}
.pit-fig-nodes circle {
  fill: var(--fig-line);
}
.pit-fig-nodes text {
  fill: var(--text-color);
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  font-family: var(--fig-mono);
}
.pit-fig-tag {
  fill: var(--fig-line);
  font-size: 12px;
  font-family: var(--fig-mono);
}
.pit-fig-events circle {
  fill: var(--text-color);
}
.pit-fig-events text {
  fill: var(--text-color);
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
}
.pit-fig-arrow-bad {
  fill: none;
  stroke: var(--fig-bad);
  stroke-width: 1.8;
  stroke-dasharray: 5 4;
}
.pit-fig-arrowhead-bad {
  fill: var(--fig-bad);
}
.pit-fig-node-bad {
  fill: var(--fig-bad);
}
.pit-fig-label-bad {
  fill: var(--fig-bad);
  font-size: 12px;
  font-family: var(--fig-mono);
  text-anchor: middle;
}
.pit-fig-tag-bad {
  fill: var(--muted-text-color);
  font-size: 10px;
  font-family: var(--fig-mono);
  text-anchor: middle;
}
.pit-fig-arrow-good {
  fill: none;
  stroke: var(--fig-good);
  stroke-width: 2;
}
.pit-fig-arrowhead-good {
  fill: var(--fig-good);
}
.pit-fig-badges rect {
  fill: color-mix(in srgb, var(--fig-good) 14%, var(--background-color));
  stroke: var(--fig-good);
}
.pit-fig-badges text {
  fill: var(--fig-good);
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  font-family: var(--fig-mono);
}
@media (max-width: 600px) {
  .pit-fig { padding: 10px 8px 4px; }
}
</style>

## Tooling

The as-of rule is the same everywhere: for prediction time `T`, a feature resolves to the latest event with `event_time <= T`. Different tools expose it under different names.

- **SQL warehouses.** Engines that support it natively call this an `ASOF JOIN` (Snowflake, ClickHouse, DuckDB): match rows on the entity key, apply `feature_ts <= event_ts`, and keep the closest prior match.

  {% highlight sql linenos %}
  SELECT t.*, f.value
  FROM training_rows t
  ASOF JOIN features f
    ON t.entity_id = f.entity_id
    AND f.feature_ts <= t.event_ts
  {% endhighlight %}
- **pandas.** [`merge_asof`](https://pandas.pydata.org/docs/reference/api/pandas.merge_asof.html) does the identical match locally on a DataFrame; `direction="backward"` is the as-of cutoff spelled out as a keyword.

  {% highlight python linenos %}
  pd.merge_asof(
      training_rows, features,
      on="event_ts", by="entity_id",
      direction="backward",
  )
  {% endhighlight %}
- **Feature stores.** Stores without a native ASOF primitive expose the same idea through `get_historical_features(entity_df)` ([Feast](https://feast.dev/), [Tecton](https://www.tecton.ai/), [Hopsworks](https://www.hopsworks.ai/) all follow this shape), where `entity_df` carries one `event_timestamp` per label row and the store resolves every requested feature to the latest value at or before it. It's also why a feature store's offline and online paths share one feature definition instead of two: the online path is this same rule with `event_ts` pinned to *now*.
- **No native ASOF (e.g. Delta Lake / Spark SQL).** Join on the entity key with a `<=` filter, then collapse to one row per label with a window function:

  {% highlight sql linenos %}
  SELECT * EXCEPT (rn) FROM (
    SELECT t.*, f.value,
           ROW_NUMBER() OVER (
             PARTITION BY t.entity_id, t.event_ts
             ORDER BY f.feature_ts DESC
           ) AS rn
    FROM training_rows t
    JOIN features f
      ON t.entity_id = f.entity_id
     AND f.feature_ts <= t.event_ts
  ) WHERE rn = 1
  {% endhighlight %}
  It's less efficient than a native `ASOF JOIN`: every matching entity/timestamp pair gets materialized before the window function trims it down to one row, so on large tables this needs `entity_id` partitioned or bucketed ahead of time to stay fast.
- **Approximate join, when freshness doesn't matter much.** Instead of matching the exact latest prior event, join on a fixed date offset, e.g. `feature_date = label_date - 1 day`. This turns the join into a plain equi-join on a date key, so it's cheap and needs no window function or ASOF support at all. It's only safe when a day or two of feature staleness is a non-issue for the prediction; a feature that changes fast (an account balance, a live session state) will be visibly wrong under this rule even though the join runs fine.

## Conclusion

A point-in-time join is a join where, for a label at time `T`, every feature resolves to the latest value known at or before `T`, nothing from `T`'s future. In every case where that rule breaks, the model hasn't learned to predict the outcome; it's learned to read a value that, at serving time, doesn't exist yet. Ship it and it degrades the moment it meets a real customer, because in production the future never exists yet.

Getting the join operator right isn't the whole job, either:

- **Queryability lag.** The cutoff should be when a value became queryable, not when the underlying event happened, so a support ticket logged at 11:58pm but not indexed until the next day's batch run wasn't actually available at 11:59pm.
- **Timezones.** Label and event timestamps need to be compared in the same timezone; a silent UTC/local mismatch shifts the cutoff by hours and can flip a pick near a stream's event boundary.
- **Ties.** A feature event landing on the exact same timestamp as the label needs a rule decided up front for whether it counts as "known" at that instant, rather than whatever the join engine does by default with equal keys.

Use the right way to keep the future out of the training data.
