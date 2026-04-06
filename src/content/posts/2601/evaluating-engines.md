---
title: "Which engine is right for me?"
description: "Investigating how best to create games"
publishedDate: "01 Jan 2026"
---

Before I start, I wanted to really look into the best game engine for me.
It's quite easy to invest time into something, only to hit limitation after limitation.
This leads to a 'technology envy', then a full port and rewrite, only to realise that the new technology has a different set of limitations.

Ultimately you need to do something, not just read or watch something, to understand what works for you.
To experiment, I've written the Scoundrels card game, see [explanation video](https://www.youtube.com/watch?v=Gt2tYzM93h4), in a couple of different engines.

I'm using the term _engine_ here very loosely to include libraries, frameworks and full blown IDEs.

## What am I looking for?

Over the years, I've come to work backwards.
**How easy will it be to get the thing to the player and then support it?**

All the fancy features mean nothing, if people can't play your game:

- Can I package it up and upload it to the store easily?
- Can people buy / download / play the game without any friction?
- Can people play it on the device / in their language / with their controller of choice?
- Does the engine itself place constraints on the player (e.g. must have this much RAM)

For me, distribution means desktop (Linux, Windows, and MacOS), Web and Mobile (Android and iOS).
VR headsets, such as the Quest, are also interesting.
Console support is fairly expensive and complex in terms of licencing and process, and porting the game itself is probably the easiest part of the console development journey.

Functionality wise, I don't want to limited by the engine.
The engine should support 2D and 3D, UI, audio, controller, etc.
It should support or allow integrated physics, navigation, debug menus, etc.

## What did I discount immediately?

There are certain programming languages which I don't feel work well for games.
These may be outdated takes, but:

- It's been a long time since I wrote **C or C++**, and I've no intention of going back to relearn that.
- **Java** ecosystem requires a JVM and I've coded it enough to know that I don't want to learn how the web deployment might work.
  I'm discounting [libGdx](https://libgdx.com/) because of this.
- **Javascript/Typescript** ecosystem is out because I've written so much professionally, that I simply can't imagine picking it up for game development.
- **Python** is another language I written a lot of, and I like it.
  There are some good game development libraries, but I feel packaging the game into installable app would be tedious.

[Unreal](https://www.unrealengine.com/en-US) is hugely impressive, but I don't like it.
I'm not a fan of the heavyweight editor, of blueprints, of C++, etc.
Really though I don't see myself creating games that work well in Unreal.
I think Unreal excels at the handling complex, realistic assets and lighting, models, etc.
To do that though, you need a big team.
This is perhaps my lack of experience, but I felt doing anything 'different to the tutorial' in Unreal, was huge amount of work.

[Unity](https://unity.com/) was straight out due to the pricing fiasco.
Whilst the idea of payment in some form is fine, I can't start building on that foundation knowing there may be another rug pull.

[GameMaker](https://gamemaker.io) is a 2D only game engine.

[GDevelop](https://gdevelop.io/) isn't free, and whilst I appreciate the need to fund software, I really don't want to have to read the table of what I can and can't achieve in a game engine at different tiers.

[Fyrox](https://fyrox.rs/) looks promising, and I get strong Godot vibes from it.
That's good thing, but I felt I might as well use Godot, as it's more mature and has the established community.

[Kaiju](https://github.com/KaijuEngine/kaiju) is a new Go based game engine, which is similar in the spirit of Fyrox (I feel). It's under active development, and that's not something I want to deal whilst currently, but one to watch.

[Ebitengine](https://ebitengine.org/) is really nice and it's impressive how many projects the author has to improve the ecosystem.
The most recent being [DebugUI](https://ebitengine.org/en/blog/debugui.html).
However, it's 2D only.

## What did I do?

I initially started building with [Raylib](https://www.raylib.com/).
If you look through the Raylib offering, especially looking beyond the core into Raylib GUI, it covers a huge basis for game development, with minimal faff.

The Raylib code between different languages is basically the same.

The [Rust](https://rust-lang.org/) with [raylib-rs](https://github.com/raylib-rs/raylib-rs) was the most elegant.
I have found the ideas of borrowing and ownership tricky to apply in practice (e.g. in an actual business app, or for [Advent of Code](https://adventofcode.com)).
In a game, ownership is clear. Who owns the card? The deck does when it's discarded, the board does when it's played, or the player does as they drag.
My bigger concern with Rust is actually integration where Raylib is missing something, such as Physics.
Here the community effort is clearly going into Bevy and Fyrox.

The [Zig](https://ziglang.org/) version using [raylib-zig](https://github.com/raylib-zig/raylib-zig) was the shortest.
There was a fairly minimal amount of memory management, which might mean it wasn't a fair test.
However, setting up the build system to target both web and desktop was more painful - and this can be seen in the repo script.
By chance, I wanted to add other dependencies to improve the project and I spend too much effort on many blockers getting web and desktop builds in place.

The [Go](https://go.dev/) version was the quickest to write and then change.
There's a bit of a dance to develop for desktop with [raylib-go](https://github.com/gen2brain/raylib-go) and then retarget for [web](https://github.com/BrownNPC/Raylib-Go-Wasm).
This is ugly but not disastrous, though there are some aspects of Raylib, such as Raylib GUI, which are not fully supported on Web.

The [Godot](https://godotengine.org) version felt a little alien compared to the others, partly because it has a graphical editor and partly because the node based approach is not easy to do well (I feel).
However, it was by far the easiest to polish (aka juice).

I also looked into:

- [Sokol](https://github.com/floooh/sokol) is the right choice if you want to build the custom game engine, then a game form scratch.
  However, that's a very long road and one that might never end.
  It makes sense to prototype your game with raylib (and a supported sokol language) and then port to Sokol when you hit the roadblock.
- [Odin](https://odin-lang.org/) is halfway between Zig and Go, and that's a good place to be for game development.
  My only issue here was community size and library support; you need a critical mass (which is coming), otherwise you end up doing a lot of porting and integration yourself.
- [Bevy](https://bevy.org/) is an engine I've tried before, but I find I'm not particularly productive with it
  Whether that's because I've focused on the entity-component-system too much, or it's a lack of experience with the API I'm not sure.

## Initial result

As a developer, using **Go and Raylib** was very productive to me.
They seems a really strong combination to write a game from scratch.
Raylib just stays out of the way, but saves you from all the low level hassle.

Go is fast, compiles quickly and has complete standard library.
Though developers are concerned about Garbage Collection pauses this is a non-issue for most games and something which can be optimised away.

## Reality sets in

I used this the Go and Raylib stack to iterate a prototype game.

One benefit I didn't notice during to Scoundrel type.

However, after a number of iterations I found:

- I was spending too much time worrying about code organisation and performance, rather than the game itself.
- Whilst Raylib offers a lot, it doesn't compare to what you get from a full game engine (e.g. cross platform debug ui, navigation, physics, screen space reflection, etc).
- Getting the basics in place was quick, but adding after effects, polish and juice is hard.
  Creating the effect is one thing, but you also need to manage that effect over time.
  For example, if you blood from injured character not only needs a particle system but that system has a finite lifetime, needs to move with the character, etc.

## Final final conclusion

It was the realisation that I was writing more engine-esque code than game code, that lead me to reconsider.
Although I might prefer to write all the code myself, that is not the objective - the objective is to ship a game.

So in the end **Godot** was the only sensible option left.

## Thanks

I used [Kenny's assets](https://kenney.nl/assets) to make the games.
