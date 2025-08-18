---
title: A Fancy Report demo
description: Demo of the Report fenced block rendering inside a blog post.
author: Demo
date: 2025-05-06
---

# My Report

This is a continuous article (not slides).

- Lists, paragraphs, headings
- GFM tables:

| Item | Value |
| ---- | ----: |
| A    |    42 |
| B    |    99 |


```table_theme_vanilla
{
  "caption": "Quarterly metrics",
  "columns": ["Metric", "Q1", "Q2", "Q3", "Q4"],
  "align": ["left", "right", "right", "right", "right"],
  "rows": [
    ["Users", 12000, 13500, 15000, 17000],
    ["MRR ($)", "$32,000", "$36,500", "$40,200", "$45,300"],
    ["Churn (%)", 2.3, 2.1, 2.0, 1.9]
  ]
}
```


You can even embed slides inside the report:

```markdown:marp
# Slide 1

![Cat 1](/assets/report/cat1.jpeg)

---

# Slide 2

![Cat 2](/assets/report/cat2.png)

---

# Slide 3

![Cat 3](/assets/report/cat3.jpeg)

---

# Slide 4

![Cat 4](/assets/report/cat4.png)
```


```report-merge
template: template-report.md
data: data-report.md
```

```markdown:report

# Python plot example

Below we embed an SVG produced by a Python script (e.g., Matplotlib `plt.savefig('python-plot.svg')`). In real usage, generate the SVG/PNG in your build step and reference it here.

![Sample Python plot](/assets/report/python-plot.svg "Figure: Output from Python/Matplotlib")

# Interactive movable area example

You can declare a movable area with items via a fenced code block. Data can also be provided from `data-report.md` by putting a JSON object into a variable and referencing it with `{{movables}}`.

```movable
{
  "width": 640,
  "height": 280,
  "items": [
    { "id": "A", "x": 40,  "y": 30,  "content": "Alpha" },
    { "id": "B", "x": 200, "y": 120, "content": "Beta" },
    { "id": "C", "x": 360, "y": 60,  "content": "Gamma" }
  ]
}
```


# Raw Markdown sources

```report-tabs
test-report.md
template-report.md
data-report.md
```
