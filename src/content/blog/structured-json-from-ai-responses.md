---
title: "Getting structured JSON out of streaming AI responses"
description: "The XML sandwich architecture I use in RPtext and why it works."
pubDate: 2026-03-05
---

RPtext is a text RPG where AI generates everything in real time — narrative, dialogue, combat, consequences. But the game engine needs more than prose. It needs structured data: how much health did the player lose? What item did they pick up? Did the NPC's opinion of them change?

The challenge: get an LLM to produce beautiful narrative text *and* reliable machine-readable JSON in a single response, streamed token-by-token, without either one breaking the other.

## The naive approach (and why it fails)

The simplest idea: ask the model to respond in JSON.

```
Respond with a JSON object containing "narrative" and "gameState" fields.
```

This works about 70% of the time. The other 30%, you get:
- Markdown code fences around the JSON (the model "helpfully" formats it)
- Missing closing braces because the model hit the token limit mid-object
- Fields that don't match your schema because the model improvised
- The model writing narrative inside the JSON string with unescaped quotes, breaking the parse

For a game that needs to run for hours without crashing, 70% isn't close to good enough.

## The XML sandwich

The approach that works: let the model write naturally, but wrap the structured section in XML tags that are easy to find and extract.

The system prompt tells the model:

```
Write your narrative response normally. At the end, include a game state
update wrapped in <gamestate> tags. The content inside must be valid JSON.

<gamestate>
{"hp_change": -5, "items_added": ["rusty key"], "npc_opinion": 2}
</gamestate>
```

Why this works better:

1. **The model writes narrative first.** It's doing what it's good at — generating text. The structured output comes after, when the model has already "decided" what happened.

2. **XML tags are unambiguous delimiters.** Unlike markdown fences (which models sometimes omit or double), custom XML tags are rarely hallucinated and easy to regex out of the response.

3. **The JSON is short and schema-constrained.** A small, well-defined JSON object is much more reliable than trying to fit everything into one big structured response.

## The streaming problem

RPtext streams responses for the typewriter effect. But I can't parse the JSON until the `</gamestate>` closing tag arrives. The solution is a simple state machine in the response handler:

- **NARRATIVE mode** (default): stream tokens directly to the UI
- When `<gamestate>` is detected: switch to **BUFFER mode**, stop streaming to UI
- **BUFFER mode**: accumulate tokens silently
- When `</gamestate>` is detected: parse the buffered JSON, apply game state changes, switch back to NARRATIVE mode

The player sees smooth narrative text appearing. Behind the scenes, the game state quietly updates. They never see the JSON.

## The fallback chain

Even with the XML sandwich, models sometimes produce broken JSON — especially smaller local models via Ollama. RPtext uses a three-step fallback:

1. **Strict parse.** `JSON.parse()` on the extracted block. If it works, done.
2. **Regex repair.** Common issues like trailing commas, single quotes instead of double quotes, unquoted keys. A series of targeted regex replacements, then retry parse.
3. **Partial extraction.** If the JSON is truly broken, regex out individual key-value pairs that match expected field names. Apply what we can salvage, log what we couldn't.

In practice, step 1 handles ~92% of responses from Claude, ~85% from llama3.2:3b. Step 2 catches most of the rest. Step 3 fires maybe once every 50 responses and always gets enough data to keep the game running.

## Why "XML sandwich" specifically

I tested other delimiter strategies:

- **Markdown fences** (\`\`\`json): Models frequently omit them or add extra ones. 89% success rate.
- **Custom tokens** (`<<<STATE>>>...<<<END>>>`): Worked but models sometimes included them in narrative text. 91% success rate.
- **XML tags** (`<gamestate>...</gamestate>`): 98.7% success rate across models. Models almost never generate fake XML tags in narrative, and the tags are trivial to extract.

The "sandwich" name comes from the structure: narrative bread, structured filling, narrative bread. It's not clever, but it's descriptive, and it works.
