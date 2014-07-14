---
layout: post
title: "Super Confitura Man"
date: 2014-07-14 20:50
comments: true
categories: 
    - touk
    - clojure
    - javascript
---

## How Super Confitura Man came to be :)

Recently at TouK we had a one-day hackathon. There was no main theme for
it, you just could post a project idea, gather people around it and hack
on that idea for a whole day - drinks and pizza included.

My main idea was to create something that could be fun to build and be
useful somehow to others. I’d figured out that since Confitura was just
around a corner I could make a game, that would be playable at TouK’s
booth at the conference venue. This idea seemed good enough to attract
Rafał Nowak [@RNowak3](https://twitter.com/RNowak3) and Marcin Jasion
[@marcinjasion](https://twitter.com/marcinjasion) - two TouK employees, that with me
formed a team for the hackathon.

![Confitura 01](/assets/confitura-2014-01.jpg)

<!-- more -->

The initial plan was to develop a simple mario-style game, with
preceduraly generated levels, random collectible items and enemies. One
of the ideas was to introduce Confitura Man as the main character, but
due to time constraints, this fall through. We’ve decided to just choose
a random available sprite for a character - hence the onion man :)

![Confitura 02](/assets/confitura-2014-02.jpg)

## How the game is played?

Since we wanted to have a scoreboard and have unique users, we’ve
printed out QR codes. A person that would like to play the game could
pick up a QR code, show it against a camera attached to the play booth.
The start page scanned the QR code and launched the game with username
read from paper code.

The rest of the game was playable with gamepad or keyboard.

![Confitura game screen](/assets/confitura-2014-04.png)

## Technicalities

Writing a game takes a lot of time and effort. We wanted to deliver, so
we’ve decided to spend some time in the days before the hackathon just
to bootstrap the technology stack of our enterprise.

We’ve decided that the game would be written in some Javascript based
engine, with Google Chrome as a web platform. There are a lot of HTML5
game engines - [list of html5 game engines](http://html5gameengine.com/) and you could easily create a
game with each and every of them. We’ve decided to use [Phaser IO](http://phaser.io/)
which handles a lot of difficult,  game-related stuff on its own. So, we
didn’t have to worry about physics, loading and storing assets,
animations, object collisions, controls input/output. Go see for
yourself, it is really nice and easy to use.

Scoreboard would be a rip-off from [JIRA Survivor](http://blog.gengo.com/jira-survivor/)
with stats being served from some web server app. To make things harder,
the backend server was written in Clojure. With no experience in that
language in the team, it was a bit risky, but the tasks of the server
were trivial, so if all that clojure effort failed, it could be
rewritten in something we know.

## Statistics

During the whole Confitura day there were 69 unique players (69 QR codes
were used), and 1237 games were played. The final score looked like
this:

1. Barister Lingerie 158 - 1450 points
2. Boilerdang Custardbath 386 - 1060 points
3. Benadryl Clarytin 306 - 870 points

And the obligatory scoreboard screenshot:

![Confitura 03](/assets/confitura-2014-03.png)

## Obstacles

The game, being created in just one day, had to have problems :) It
wasn’t play tested enough, there were some rough edges. During the day
we had to make a few fixes:

- the server did not respect the highest score by specific user, it was just overwritting a user’s score with it’s latest one,
- there was one feature not supported on keyboard, that was available on gamepad - turbo button
- server was opening a database connection each time it got a request, so after around 5 minutes it would exhaust open file limit for MongoDB (backend database), this was easily fixed - thou the fix is a bit hackish :)


These were easily identified and fixed.
Unfortunately there were issues that we were unable to fix while the
event was on:

- google chrome kept asking for the permission to use webcam - this was very annoying, and all the info found on the web did not work - [StackOverflow thread](http://stackoverflow.com/questions/16835421/how-to-allow-chrome-to-access-my-camera-on-localhost/16929608#16929608)
- it was hard to start the game with QR code - either the codes were too small, or the lighting around that area was inappropriate - I think this
issue could be fixed by printing larger codes,

##Technology evaluation

All in all we were pretty happy with the chosen stack. Phaser was easy
to use and left us with just the fun parts of the game creation process.
Finding the right graphics with appropriate licensing was rather hard.
We didn’t have enough time to polish all the visual aspects of the game
before Confitura.

Writing a server in clojure was the most challenging part, with all the
new syntax and new libraries. There were tasks, trivial in java/scala,
but hard in Clojure - at least for a whimpy beginners :) Nevertheless
Clojure seems like a really handy tool and I’d like to dive deeper into
its ecosystem.

## Source code

All of the sources for the game can be found here
[TouK/confitura-man](https://github.com/TouK/confitura-man).

The repository is split into two parts:

- game - HTML5 game
- server - clojure based backend server

To run the server you need to have a local MongoDB installation. Than in
server’s directory run:
```
$ lein ring server-headless 
```
This will start a server on `http://localhost:3000`

To run the game you need to install dependencies with bower and than
run
```
$ grunt
```
from game’s directory. 

To launch the QR reading part of the game, you enter
`http://localhost:9000/start.html`. After scanning the code you’ll be
redirected to `http://localhost:9000/index.html` - and the game starts.

## Conclusion

Summing up, it was a great experience creating the game. It was fun to
watch people playing the game. And even with all those glitches and
stupid graphics, there were people vigorously playing it, which was
awesome.

Thanks to Rafał and Michał for great coding experience, and thanks to all the players of our stupid little game. If you’d like to ask me about anything - feel free to contact me by mail or twitter [@zygm0nt](https://twitter.com/zygm0nt)
- 
