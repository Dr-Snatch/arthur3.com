---
title: "What I learned migrating BeatMap from UserDefaults to Core Data"
description: "Why the migration was harder than expected and what I'd do differently."
pubDate: 2026-03-01
---

When I started BeatMap, I stored everything in UserDefaults. Quick, easy, no schema to think about. It worked fine for the first few months — until it didn't.

## Why UserDefaults broke down

UserDefaults is a property list under the hood. It loads the entire file into memory on first access. With 50 entries, fine. With 200+ entries, each containing song metadata, location data, mood ratings, and timestamps, the app's launch time crept from instant to noticeable. Searching and filtering meant loading everything and iterating through arrays. There was no way to query "show me all entries from January where mood > 7" without pulling the whole dataset.

The breaking point was AirDrop sharing. I needed to export individual entries as structured data, and UserDefaults gave me a blob of everything or nothing.

## The migration plan

Core Data was the obvious choice for iOS — it handles relationships, querying, indexing, and lazy loading out of the box. The challenge was doing the migration without losing anyone's data.

My approach:

1. Define the Core Data model to match the existing data structure
2. On first launch after the update, check if UserDefaults has data and Core Data is empty
3. If so, read every entry from UserDefaults, create corresponding Core Data objects, save
4. Verify the count matches
5. Clear UserDefaults

Simple in theory. The reality had more edges than I expected.

## Where it got messy

**Dates.** UserDefaults stored dates as ISO 8601 strings because I was encoding to JSON. Core Data wants actual `Date` objects. Some of my early entries had inconsistent date formats because I'd changed the formatter at one point. I needed a parser that tried multiple formats before giving up.

**Optional fields.** Early entries didn't have location data (I added MapKit later). The Core Data model needed sensible defaults for fields that didn't exist in older entries, without making them required and blowing up the migration.

**Images.** I'd been storing hero images as file paths relative to the documents directory. Core Data can store binary data, but cramming images into the database is an anti-pattern. I kept them as external files but needed to update the path references during migration.

**Testing.** I couldn't test with real user data, so I generated synthetic datasets of varying sizes and ages. This caught the date format issue but missed a subtle one: entries created during a brief period where I'd accidentally stored the Spotify track URI instead of the track ID. Had to add a check for that too.

## What I'd do differently

**Start with Core Data.** The "just use UserDefaults for now" shortcut cost me more time in migration work than setting up Core Data properly would have taken from day one. The schema design forces you to think about your data model early, which is actually a benefit.

**Version the data format.** If I'd stored a version number with the UserDefaults data, the migration code could branch on it instead of guessing which format each entry was in.

**Write the migration first, features second.** I tried to ship the migration alongside new features in v1.1.0. Should have done a clean migration-only release, verified it worked, then built on top.

The migration has been running in production for a few weeks now with no data loss reports. But every time I see a UserDefaults call in a tutorial for anything beyond simple preferences, I wince.
