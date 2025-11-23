# Focus Filter - A Fun Demo
Focus Filter is a playful attention-training tool that challenges your focus by sending visual and haptic distractions through a Logitech MX Creative Console or MX Master 4 mouse. The goal isn’t to react immediately—it’s to train your brain to tune out stimuli and maintain focus, even while distractions happen in the background.

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

## Technical highlihgts
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
* Well despite the rough start, I'm really proud of this project because of not the tecnical aspect of things, but specifically the 

Shoutout to Logitech developers because lots of this code is theirs (https://github.com/mario-gutierrez/mx-creative-console-webhid and https://github.com/mario-gutierrez/mx-master-4-webhid) 

