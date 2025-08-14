---
title: Ecosystem Update (with MarpReport demo)
description: Demo of the new MarpReport fenced block rendering inside a blog post.
author: Demo
date: 2025-05-06
---

Below is a demo of a report-style block rendered by the new `markdown:report` support.

### What MarpReport can do beyond plain Markdown

- Embed a live, paginated slide deck right inside a continuous article (see the embedded deck below).
- Keep the report content logically grouped in one fenced block that you can style/print as a unit later.
- Mix text, tables, images, and slides together in a single authored block.


```markdown:report
# My Report

This is a continuous article (not slides).

- Lists, paragraphs, headings
- GFM tables:

| Item | Value |
| ---- | ----: |
| A    |    42 |
| B    |    99 |

Images with captions:

![Alt text](/assets/marp-cli.png "Figure: Marp CLI")

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

## Python plot example

Below we embed an SVG produced by a Python script (e.g., Matplotlib `plt.savefig('python-plot.svg')`). In real usage, generate the SVG/PNG in your build step and reference it here.

![Sample Python plot](/assets/report/python-plot.svg "Figure: Output from Python/Matplotlib")
```
