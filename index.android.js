/**
 * The idea behind this component is to have only one starting value (0) but three views: -1[0]1.
 * The user can only see whats inside the [] brackets (second view/ page) but the first and third
 * view get rendered, too, so they are shown, when the user swipes left/ right without the need
 * of additional logic.
 *
 * Once the user releases the touch, the pages animate to the specified position, which means, the
 * current layout looks like [-1]01 or -10[1] and shows the new 'current' value.
 *
 * This component uses the time between releasing the touch and handling the next one to calculate
 * the new values and reset the pages' position but showing the new values.
 *
 * Basically this looks like:
 * START (value: 0)
 * -1[0]1
 * SWIPE LEFT + ANIMATION
 * -10[1]
 * RELEASE TOUCH
 * 0[1]2
 *
 * While this is just an example with simplest calculations, this could be used to animate a
 * calendar, that calculates the previous/ next month lazy.
 *
 * Also this could be used to lazy load any external resources, but consider to add some more
 * pages, to make sure, fetching those resources finished before the user swipes there.
 */

import React, { Component } from 'react'
import {
  Animated,
  AppRegistry,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native'

const { width, height } = Dimensions.get('window')

// Provide methods to precalculate next values
const getNextNumber = number => number += 1
const getPreviousNumber = number => number -= 1

export default class lazyswipe extends Component {
  constructor(props) {
    super(props)

    this.state = {
      animatedX: new Animated.Value(0),

      // Starting value. Could be Date.now(), while precalculation methods add/subtract a month
      current: 0,
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Handles swipe movement animation; No need to save position, because a reset is required
        this.state.animatedX.setValue(gestureState.dx)
      },
      onPanResponderRelease: (event, gestureState) => {
        // Determine, what position to animate to
        const isSwipeLeft = (gestureState.vx < 0)

        if (isSwipeLeft)
          this.startAnimationLeft()
        else
          this.startAnimationRight()
      },
    })

    // These are animation examples, but can be replaced to feel even more natural
    this.animateLeft = Animated.timing(
      this.state.animatedX,
      {
        toValue: -width,
        easing: Easing.out(Easing.cubic),
        duration: 250,
      }
    )

    this.animateRight = Animated.timing(
      this.state.animatedX,
      {
        toValue: width,
        easing: Easing.out(Easing.cubic),
        duration: 250,
      }
    )
  }

  // When the animation finished, the pages' positions reset and new values are calculated
  startAnimationLeft() {
    this.animateLeft.start(() => {
      this.setState({ current: this.state.current + 1 })

      // This resets the translateX of the pages, so it looks like -1[0]1 again
      this.state.animatedX.setValue(0)
    })
  }

  startAnimationRight() {
    this.animateRight.start(() => {
      this.setState({ current: this.state.current - 1 })
      this.state.animatedX.setValue(0)
    })
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.pages]} {...this.panResponder.panHandlers}>
          {/* First view is rendered but not shown */}
          <Animated.View style={{ ...styles.page, transform: [{ translateX: this.state.animatedX }] }}>
            <Text style={[styles.text]}>{getPreviousNumber(this.state.current)}</Text>
          </Animated.View>
          {/* Second view shows the current value */}
          <Animated.View style={{ ...styles.page, transform: [{ translateX: this.state.animatedX }] }}>
            <Text style={[styles.text]}>{this.state.current}</Text>
          </Animated.View>
          {/* Third view is rendered but not shown */}
          <Animated.View style={{ ...styles.page, transform: [{ translateX: this.state.animatedX }] }}>
            <Text style={[styles.text]}>{getNextNumber(this.state.current)}</Text>
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
  },
  pages: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DADFE1'
  },
  page: {
    top: 0,
    bottom: 0,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
  }
}

AppRegistry.registerComponent('lazyswipe', () => lazyswipe)
