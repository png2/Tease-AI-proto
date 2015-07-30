#Tease AI nodejs Prototype

## What is it?
It's a prototype of a complete rewrite of [TeaseAI](https://github.com/Milo1885/Tease-AI) to see how it could be done

## What are you using?
I'm using nodejs with the ES6 syntax

## How do I run it?
1. Get nodejs
2. Get the sources in some directory
3. Go to the source directory
4. run `npm install`
5. run `node start.js path/to/your/file`

For now it only support one file at a time that's what you give it in parameter

## How far is in development?
Not very far...

I'm focusing on the parsing engine so that means no fancy UI, and no side features for now
You still have a basic text interface to interact with the scripts for testing purpose

For now only the parser used for the start, modules, links and end scripts is done

The parser for the taunts, the CBT is NOT done
The interrupts are NOT done
The task generator is NOT done
There is nothing to fetch pictures on remote blogs

And more importantly, the code for going to the cycle start->taunts->modules->link->end is not done yet

That means you can only parse one script at a time

The good news is that most of the @Commands are implemented already

## So what do we have?

We have a very minimal core that is completely separated from the UI
We have (almost) all the instructions implemented in modules and easy to extends

If you want to see how you can add a @Command or a #Filter check modules/test.js
If you want to see more complex ones go see modules/flags.js and modules/writingTask.js

## What's next

I plan to work on either the parser for taunts/CBT files next to be able to finish most of the remaining commands or to work on the cycler

And give me feedback on [milovana](https://milovana.com/forum/viewtopic.php?f=2&t=15776)

You can also contact me if you want to add more modules or even better start a GUI in HTML...