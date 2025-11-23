# Focus Filter - A Fun Demo
Focus Filter is a playful attention-training tool that challenges your focus by sending visual and haptic distractions through a Logitech MX Creative Console or MX Master 4 mouse. The goal isn’t to react immediately—it’s to train your brain to tune out stimuli and maintain focus, even while distractions happen in the background.

Fun fact, this idea was inspired by my personal experiences like someones's phone bussing mid-conversation or notifications popping up while I'm trying to work. 


## What it does:
This code should be able to do the following:
* Display a “Focus Filter” intro and start sequence on the device
* Randomly flash lights and colors on MX keys
* Provide haptic feedback through the MX Master 4
* Generate keyboard-based targets for the user to press
* Track correct presses and cooldown periods
* Train users to ignore distractions while staying on task
* Works with devices connected to the browser; visual + tactile feedback

## How I built it
* Frontend: Vanilla HTML/CSS/JS, Canvas API for graphics
* Device Integration: MX Createive Console API + WebHID for MX Master 4
* Haptics: LogitechHapticDriver custom module for vibration effects
* Animation: JS-based bouncing and flashing circle on the page
* Event handling: Keyboard events and MX device events for interactivity

## Technical highlights
* Randomized visual + haptic stimuli to simulate real-world distractions
* Cooldown and flashing logic for attention cycles
* Async/await with loops for smooth key flashes and haptic pulses
* Modular JS design: device logic separated from UI and animation
* Canvas animation with bouncing, colored circles to add visual chaos

## Challenges:
* WebHID support varies across browsers; testing MX Master 4 connections
* Handling async haptic triggers without blocking UI updates
* Designing distractions that are noticible and annoying
* Re-learning JS, HTML, and APIs

## Accomplishments I'm proud of:
Despite a rough start, I’m proud of overcoming some environmental challenges: working solo after a demotivated partner, soloing a project for the first time!, and bravely choosing a project outside my usual expertise. While JS and HTML are common starting points, I returned to them intentionally to leverage what I had previously learned many many years ago and pivoted away from. So with all that in mind, I'm pretty proud of the following accomplishments:

Specific technical accomplishments:
* Smooth real-time interaction with both MX Creative Console and MX Master 4
* Fun and chaotic full-page animation synced with haptic feedback
* Modular design that could be extended to other devices or stimuli
* Lightweight and fast with no external dependencies besides device API

## What I learned:
* Intregrating WebHID with interactive device feedback
* Managing async loops and animations without causing UI lag
* Balancing distraction levels and ensure it was enough but not too much
* INterplay of visual and tactile cues in attentionn training


## What is next:
* Adjustable difficulty: faster flashes, more haptic triggers
* Optional "work mode" where simulation can be paused instead of running continuously



Shoutout to Logitech developers because lots of this code is theirs (https://github.com/mario-gutierrez/mx-creative-console-webhid and https://github.com/mario-gutierrez/mx-master-4-webhid) 


