# react-native-use-in-view

A TypeScript-based, lightweight, and easy-to-use React Native library for scroll-based functionalities. This library provides powerful observers for `ScrollView` and `FlatList`, enabling tracking of scroll events and element visibility within scrollable views. Designed for seamless integration with React Native projects, it offers enhanced accuracy and flexibility.

## Installation

Install the library using your preferred package manager:

```bash
npm install react-native-use-in-view
````

```bash
yarn add react-native-use-in-view
```

```bash
pnpm add react-native-use-in-view
```

## Features

- **Lightweight**: Minimal performance overhead with throttled scroll events.
- **TypeScript Only**: Enhanced type safety and developer experience.
- **Scroll Observing**: Track and respond to scroll events within `ScrollView` and `FlatList`.
- **Visibility Tracking**: Accurately determine the visibility of elements within the scroll view’s visible area, even if the scroll view is not full-screen.
- **Versitile**: Compatible with Expo, bare React Native projects, the New Architecture (Fabric and TurboModules), and Hermes JavaScript engine.

## Usage

The `useInView` hook requires a `ref` to be attached to a native component (e.g., `View`, `Text`) or a custom component that forwards the ref to a native component. Wrap your `ScrollView` or `FlatList` with S`crollViewObserver` or `FlatListObserver` to enable visibility detection.

Here are examples demonstrating usage with both observers:

```jsx
import React from 'react'

import { Text, View } from 'react-native'

import { FlatListObserver, ScrollViewObserver, useInView } from 'react-native-use-in-view'

const Element = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })

  return (
    <View ref={ref} style={{ backgroundColor: inView ? 'green' : 'red' }}>
      <Text>{inView ? 'In view' : 'Not in view'}</Text>
    </View>
  )
}

const AppWithFlatList = () => {
  return (
    <FlatListObserver
      data={Array.from({ length: 100 })}
      renderItem={() => <Element />}
      keyExtractor={(_, index) => index.toString()}
    />
  )
}

const AppWithScrollView = () => {
  return (
    <ScrollViewObserver>
      {Array.from({ length: 10 }).map((_, index) => (
        <Element key={index} />
      ))}
    </ScrollViewObserver>
  )
}
```

Both `FlatListObserver` and `ScrollViewObserver` accept all props of their respective components (`FlatList` and `ScrollView`) and act as wrappers, forwarding props to the underlying components.

## API

### `useInView`

The `useInView` hook detects whether an element is within the visible area of its parent scroll view. It returns an object with a `ref` to attach to the element and an `inView` boolean indicating visibility.

| Option            | Default value | Description                                                                                                                                                                                                                                                                                 |
|-------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| threshold         | `0`           | The number of pixels outside the scroll view’s visible area within which the element is considered visible. Positive values extend the bounds outward; negative values shrink them inward. For example, `-100` means the element is in view if it’s within 100 pixels outside the viewport. |
| triggerOnce       | `false`       | A boolean indicating whether the `inView` state should update only once when the element becomes visible, rather than continuously as it enters or leaves the viewport.                                                                                                                     |
| initialInView     | `false`       | A boolean indicating whether the inView state should be initially set to `true` before any visibility checks occur.                                                                                                                                                                         |
| onChange          | `undefined`    | A callback function that is called whenever the inView state changes. It receives the new inView state as an argument.                                                                                                                                                                     |

## Notes

- **Viewport Definition**: The viewport is defined as the visible area of the ScrollView or FlatList, not the entire window. This ensures accurate visibility detection regardless of the scroll view’s size or position on the screen.
- **Scroll Direction**: The library supports both vertical (Y-axis) and horizontal (X-axis) scrolling, with visibility checks performed in both dimensions.