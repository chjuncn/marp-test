---
title: Ecosystem Update (with MarpReport demo)
description: Demo of the new MarpReport fenced block rendering inside a blog post.
author: Demo
date: 2022-05-06
---

Below is a demo of a report-style block rendered by the new `markdown:report` support.

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

---

# Slide 2
```
```
