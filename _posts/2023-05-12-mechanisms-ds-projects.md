---
layout: post
title: "Mechanisms for Data Science Projects"
date: "2023-05-12"
categories:
---

> Good intentions never work, you need good mechanisms to make anything happen - Jeff Bezos.

A mechanism is a process where

1. You create a **tool**;
2. Drive **adoption** of the tool;
3. **Inspect** to correct course.

Read more - [Building mechanisms](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/building-mechanisms.html).

I have observed that mechanisms work more efficiently than good intentions. Thus, I always try to convert good intentions into mechanisms. Looking at how Data Science projects are not as streamlined as Software Engineering projects, I searched for guidance on managing them better.

The following are my notes from [Mechanisms for Effective Machine Learning Projects](https://eugeneyan.com/writing/mechanisms-for-projects/) and related articles. These mechanisms apply to any data science project (work or hobby). Note that these mechanisms are mental tools. You have to make them a habit for mental tools to work.

<br>

## Meta-Checklist for Projects

- 1-pager describing a map to the destination (1-7 days)
    - Intent or why. Quantify the problem.
    - Desired outcome. Business metric.
    - Deliverable. No need for it to be detailed.
    - Constraints. How not to solve the problem.
- Timebox the project. Based on the timeline, design a solution that fits. Ref: [timebox section](#timeboxing-projects).
- Literature review
    - It does not have to be exhaustive.
    - Quickly identify approaches that have worked and build on them.
    - Refer to the [lit. review section](#literature-review).
- Reviews
    - Schedule once you have the results from the initial experiments.
    - It helps with catching blindspots or critical errors.
    - Focus points
        - Input data and features
        - Offline evaluation
        - Room for improvements.
- Set up the work environment. Read: [How to Set Up a Python Project For Automation and Collaboration](https://eugeneyan.com/writing/setting-up-python-project-for-automation-and-collaboration/#automate-checks-with-each-git-push-and-pull-request)
- Consistent documentation during the project.
    - Document whatever is not in the code.
    - Create documentation like an applied research paper: motivation, lit review, data, methodology, results, and next steps.
    - It helps with replication.
    - Read more here: [Why You Need to Follow Up After Your Data Science Project](https://eugeneyan.com/writing/why-you-need-to-follow-up-after-your-data-science-project/#make-your-work-reproducible-each-run-every-run).
- Have informal stand-ups with the team:
    > Share unusual findings; Discuss ideas; Get help on bugs; Ask for reviews; etc.
- Regular stakeholder communication
    - Check in regularly with them.
    - It ensures that the deliverable aligns with the overall goals.
    - It is also a source of feedback and clever suggestions.
- Read more here:
    - [What I Do Before a Data Science Project to Ensure Success](https://eugeneyan.com/writing/what-i-do-before-a-data-science-project-to-ensure-success/#first-draw-the-map-to-the-destination-one-pager)
    - [What I Do During A Data Science Project To Deliver Success](https://eugeneyan.com/writing/what-i-do-during-a-data-science-project-to-ensure-success/)

## Timeboxing Projects

- It makes you focus on the most crucial tasks.
- Timebox: stretch goals wrt the project.
- Estimate: Upper bound of effort needed.
- An estimate to go from timebox to estimate: multiply by 1.5 - 3.0.
- Most aggressive timebox: halve the time spent on a similar project. Create an MVP. Quick iteration cycles. Intense.
- Comfortable-yet-challenging timebox: reduce the time by 10-20%. Good default.
- Standard timebox: for open-ended projects. 2 weeks lit. review, 4-8 weeks for prototype building, and 3-6 months for production.

## Executing Projects

Mechanism to execute projects with high confidence.

- **Pilot** and **copilot** for each project.
- Pilot: main project owner.
    - Responsible for success/failure
    - Own and delegate as required.
- Copilot: helps the pilot stay on track, identify critical flaws, and call out blindspots.
    - Periodic check-ins
    - Reviews document drafts and prototypes
    - Mandatory code reviewer
- Copilot has (more) experience in the problem space.
- Copilot spends 10% of the pilot's effort.

## Literature Review

- Always start the project with a literature review.
- Read papers relevant to the problem.
- Start with applied research: [applied-ml](https://github.com/eugeneyan/applied-ml).
- Reviewing papers for problem understanding
    - **Formulation**
        > Classification, regression, or something else?
    - **Data processing**
        > How was data excluded, preprocessed, and rebalanced? How were labels defined? Was a third neural class added? How were labels augmented, perhaps via hard mining?
    - **Evaluation process**
        > How was the training and validation set created? What offline evaluation metrics did they use? How did they improve the correlation between offline and online evaluation metrics?
- How to go through each paper is discussed in the next section.

## 3-Pass Approach for Reading Papers

For single paper

1. Scan the abstract and conclusion to understand if the paper is useful. If it does, then skim through the headings to identify the problem statement, methods, and results.
2. In the 2nd pass, highlight the relevant sections. Helps in quickly spotting the important bits later. Take notes. For most of the papers, 2nd pass is enough.
3. Do a 3rd pass to cement the knowledge.

For multiple papers from the same domain

1. Do 1st and 2nd passes on each paper.
2. In the 3rd pass, consolidate common concepts across papers into a single note and compare the pros and cons. Doing this helps identify gaps in my knowledge. If there are gaps, then revisit the paper.

Find more here: [How Reading Papers Helps You Be a More Effective Data Scientist](https://eugeneyan.com/writing/why-read-papers/#how-to-read-papers).

## Collaboration and Standard Practices

- Create shared libraries for oft-used data operations.
    - It encourages the team to contribute and thus leads to collaboration and code reviews.
    - It nudges people towards a team mindset.
- Have a single repo with training, evaluation, and inference code in one place.
    - Everybody works and reviews the same code.
    - It helps in knowledge sharing.
    - It also slows down the speed, but the pros outweigh the cons.
- Read more: [Data scientists work alone and that's bad](https://www.ethanrosenthal.com/2023/01/10/data-scientists-alone/).

<br>

I will keep updating/adding to this list as I read/experiment more.
