---
title: "Why I chose SwiftUI over UIKit as a beginner"
description: "The tradeoffs I didn't fully understand until I was deep in both."
pubDate: 2026-02-20
---

When I started learning iOS development in mid-2025, I had a choice: UIKit (the established framework, used in most production apps) or SwiftUI (Apple's modern declarative framework, released in 2019). I went with SwiftUI. Here's why, what surprised me, and what I still think about.

## Why SwiftUI won initially

**The learning curve felt gentler.** Declaring a view with `VStack { Text("Hello") }` is more intuitive than subclassing `UIViewController`, overriding `viewDidLoad`, and manually managing a view hierarchy. For someone coming from Python, the declarative style made more sense than the imperative UIKit approach.

**Live previews.** Seeing your UI update in real time as you type is genuinely transformative for learning. With UIKit, you write code, build, wait, check. With SwiftUI, the feedback loop is almost instant. You develop intuition for how modifiers compose much faster.

**Less boilerplate.** A basic list view in SwiftUI is maybe 15 lines. The equivalent UIKit implementation with a UITableViewController, data source methods, cell registration, and reuse identifiers is easily 60+. When you're learning, less ceremony means more time understanding concepts.

## Where UIKit knowledge became essential

About three months into building BeatMap, I hit walls that SwiftUI alone couldn't solve.

**Navigation complexity.** SwiftUI's NavigationStack works great for simple push/pop flows. The moment I needed custom transitions, programmatic navigation from non-view code, or deep linking from a notification, I found myself fighting the framework. UIKit's UINavigationController gives you direct control. SwiftUI's abstraction is nice until you need to break out of it.

**Third-party SDK integration.** Spotify's iOS SDK and some of the older Apple frameworks expose UIKit-based APIs. Wrapping them in `UIViewControllerRepresentable` works but feels like duct tape. Understanding what's happening underneath made the integration code less magical and more maintainable.

**Performance edge cases.** SwiftUI re-renders views when state changes. For most screens, this is fine. For a list of 300+ music entries with images, map thumbnails, and real-time search filtering, the naive approach was sluggish. Understanding how UIKit manages cell reuse and lazy loading helped me optimise the SwiftUI version — and know when to drop down to a `UIViewRepresentable` wrapper.

## What I actually think now

SwiftUI is the right choice for a beginner in 2025/2026. The framework has matured significantly — most of the early pain points (navigation, state management, animation) have been addressed or have well-documented workarounds.

But treating SwiftUI as a replacement for understanding UIKit is a mistake. They're layers, not alternatives. The best SwiftUI code I've written came after understanding what UIKit does underneath — how the responder chain works, how layout is calculated, how view controllers manage lifecycle.

My recommendation for anyone starting now: learn SwiftUI first to build things fast and develop intuition. Then learn enough UIKit to understand what SwiftUI is abstracting away. You'll write better SwiftUI as a result, and you won't panic when you need to drop down a level.
