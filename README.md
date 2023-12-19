# react-native-use-in-view

A TypeScript-based, lightweight and easy-to-use React Native component for scroll-based functionalities. This library, designed for integration with React Native projects, provides a powerful ScrollView observer for tracking scroll events and element visibility.

For the moment, the observers only support Y (vertical) axis tracking.

## Installation

```bash
npm install react-native-in-view
````

```bash
yarn add react-native-in-view
```

```bash
pnpm add react-native-in-view
```

## Features

- **Lightweight**: Minimal performance overhead.
- **TypeScript Only**: Enhanced type safety and developer experience.
- **Scroll Observing**: Track and respond to scroll events within ScrollView or FlatList.
- **Visibility Tracking**: Efficiently determine the visibility of elements in a scrollable view.
- **Versitile**: Works with expo and bare React Native projects.

## Usage

```jsx
import React from 'react'

import { Text, View } from 'react-native'

import { FlatListObserver, ScrollViewObserver, useInView } from 'react-native-in-view'

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

Both `FlatListObserver` and `ScrollViewObserver` accept all props of their respective components and work as their wrappers.

## API

### `useInView`

| Option           | Default value | Description                                                                                                                                                                                                                                                    |
|------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|threshold         | `0`           | A number between 0 and 1 indicating the percentage of the element's height that must be visible in order to trigger the `inView` state. In special cases, it can be a negative value, indicating how far from the viewport should the visibility be triggered. |
|triggerOnce       | `false`       | A boolean indicating whether the `inView` state should be triggered only once.                                                                                                                                                                                 |
|initialInView    | `false`       | A boolean indicating whether the `inView` state should be initially set to `true`.                                                                                                                                                                             |
