# Lazy Swipe

## What this is
This is the base for a lazy swipe component, that calculates and renders its values on the fly. While it feels like swiping through a gallery, the user actually only swipes the same pages over and over again but every time seeing different pre but lazy calculated content.

The user can only see one page but could swipe left and right, so the left, current and right values are pre calculated and pre rendered. This looks like this: -1[0]1

While seeing the 0 and swiping left, the 1 gets animated in while the 0 gets animated out. Releasing the touch results in a new state: 0[1]2

## What this is not

This is not a ready-to-use component to include in your project and let it lazy load anything you pass in. But you could build one from it!

## What this is useful for
While this example only shows adding or subtracting 1, it could easily be transformed to a calendar component, without the need to pre calculate 42 values for every month between 1970 and 2099.

I also think, when adding some more pages, this could serve as a lazy fetching kind of gallery, that fetches two or three resources ahead before the user swipes to see them.

## Installation

After cloning the repository, run

```npm install```

to install dependencies and then

```react-native run-[ios/android]```

to fire up the application.

## Additional Information

Can be found in index.android.js
