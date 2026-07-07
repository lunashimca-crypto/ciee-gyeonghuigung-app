# Gyeonghuigung Palace & Seoul Museum of History — Scavenger Hunt

A scavenger hunt app built for CIEE Korea program students to explore Gyeonghuigung Palace and the adjacent Seoul Museum of History through an interactive, self-guided mission — featuring a palace-inspired visual style and a mix of question formats, including fill-in-the-blank.

**Live Demo:** https://lunashimca-crypto.github.io/ciee-gyeonghuigung-app/

![status](https://img.shields.io/badge/status-active-brightgreen)
![vite](https://img.shields.io/badge/build-vite-646CFF)

---

## Why This Project

Gyeonghuigung Palace and the neighboring Seoul Museum of History cover a lot of ground — both physically and in terms of history — and it's easy for students to walk through without really absorbing what they're looking at. This app turns that visit into a guided mission across both sites, with 10 questions that push students to actually engage with specific palace structures and museum exhibits rather than just passing by them.

I led this project end to end, from concept through deployment:

- **Research & planning** — visited both Gyeonghuigung Palace and the Seoul Museum of History, selected locations and exhibits worth highlighting across both sites, and mapped out a combined route of 10 stops
- **Content design** — wrote the mission briefing, all 10 questions (including a mix of multiple-choice and fill-in-the-blank formats), and the closing narrative
- **Visual design direction** — art-directed a darker, more classical/palace-inspired visual style, distinct from the War Memorial app, to match the tone of a historic royal site
- **AI-assisted development** — built the app using Claude (Anthropic) as a development partner: defined the requirements and app behavior, directed the code generation, edited in-app text and content directly in the codebase, and tested and deployed the final result

## Overview

The app guides students through **10 questions** spanning both Gyeonghuigung Palace and the Seoul Museum of History, turning the visit into an interactive mission. Students read a mission briefing, move through the two sites answering location-based questions — some multiple-choice, some fill-in-the-blank — and receive a final rank based on their performance at the end.

The experience is designed to be:

- **Self-guided** — no staff supervision required during the hunt
- **Two-site coverage** — spans both the palace grounds and the adjacent history museum in a single mission
- **Mixed question formats** — combines multiple-choice questions with typed fill-in-the-blank answers for more active recall
- **Session-persistent** — progress is saved locally, so a refresh or accidental tab close won't reset the mission

---

## Table of Contents

- [Why This Project](#why-this-project)
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [How It Works](#how-it-works)
- [Deployment](#deployment)
- [Background](#background)
- [Credits](#credits)

---

## Tech Stack

- [Vite](https://vitejs.dev/) — build tool & dev server
- JavaScript, HTML, CSS
- Browser local storage for saving student progress
- Built with [Claude](https://www.anthropic.com/claude) (Anthropic) as an AI development partner — code was generated and refined iteratively based on requirements and content I directed

## Key Features

- 🏯 10-question mission spanning both Gyeonghuigung Palace and the Seoul Museum of History
- ✍️ Mixed question formats — multiple-choice alongside typed fill-in-the-blank answers
- 💾 Progress tracking via `localStorage` (resume-friendly, no login required, persists across refreshes)
- 🎨 Custom palace-inspired visual style, distinct from the original War Memorial app
- 📜 Custom mission-briefing and ending narrative written for this two-site experience
- 🏅 Final rank/score screen based on accuracy and/or completion
- 📱 Responsive layout for use on-site at the palace and museum

## Screenshots

| Mission Briefing | Multiple-Choice Question | Fill-in-the-Blank Question | Final Rank |
|:---:|:---:|:---:|:---:|
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

## How It Works

1. **Mission Briefing** — Students are welcomed with a short narrative that sets the context for exploring Gyeonghuigung Palace and the Seoul Museum of History.
2. **Question Flow** — Students move through 10 questions across both sites, each tied to a specific location or exhibit.
3. **Mixed Answer Formats** — Some questions are multiple-choice; others ask students to type the missing word or phrase directly, encouraging closer reading of exhibit information.
4. **Progress Tracking** — Each answer and the student's current position in the mission are saved to `localStorage`, so progress persists across page reloads.
5. **Final Rank** — Once all 10 questions are answered, students see an ending narrative along with their final rank/score.

## Deployment

This app is deployed via **GitHub Pages** and is live at:
https://lunashimca-crypto.github.io/ciee-gyeonghuigung-app/

## Background

Built using the same underlying approach as the [War Memorial of Korea Scavenger Hunt](#) app, this version was adapted for a two-site visit (palace + museum) rather than a single location, with its own question set, narrative, visual style, and dedicated `localStorage` key to keep progress separate from the other CIEE scavenger hunt apps.

