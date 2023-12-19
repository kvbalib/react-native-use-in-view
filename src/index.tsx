import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  findNodeHandle,
} from 'react-native'

import debounce from 'lodash.debounce'

import {
  IFlatListObserverProps,
  IObserverContext,
  IScrollViewObserverProps,
  IUseInViewOptions,
} from './ScrollViewObserver.types'

const ViewContext = createContext<IObserverContext>({
  rootRef: { current: null },
  y: 0,
  scrollViewHeight: 0,
})

export const useInView = ({
  initialInView = false,
  threshold = 0,
  triggerOnce = false,
}: IUseInViewOptions = {}) => {
  const ref = useRef<View>(null)
  const [inView, setInView] = useState(initialInView)
  const { rootRef, y, scrollViewHeight } = useContext(ViewContext)

  const checkVerticalVisibility = () => {
    if (scrollViewHeight > 0 && ref.current && typeof rootRef === 'object') {
      const rootHandle = findNodeHandle(rootRef.current)

      if (rootHandle) {
        ref.current.measureLayout(
          rootHandle,
          (left, top, width, height) => {
            const visibleTop = y
            const visibleBottom = y + scrollViewHeight
            const elementTop = top
            const elementBottom = top + height
            const fractionInSight =
              (Math.min(elementBottom, visibleBottom) - Math.max(elementTop, visibleTop)) / height

            if (fractionInSight >= threshold) {
              setInView(true)
            } else if (!triggerOnce) {
              setInView(false)
            }
          },
          () => {}
        )
      }
    }
  }

  useEffect(() => {
    if (scrollViewHeight > 0) checkVerticalVisibility()
  }, [y, scrollViewHeight])

  return { ref, inView }
}

export const ScrollViewObserver = forwardRef<ScrollView, IScrollViewObserverProps>(
  ({ scrollEventThrottle = 512, ...rest }, ref) => {
    const internalRef = useRef<ScrollView>(null)
    const refToUse = ref || internalRef
    const [scrollY, setScrollY] = useState(0)
    const [scrollViewHeight, setScrollViewHeight] = useState(0)

    const debounceSetViewHeight = useCallback(
      debounce((height: number) => {
        setScrollViewHeight(height)
      }, 500),
      []
    )

    const onLayout = (event: LayoutChangeEvent) => {
      debounceSetViewHeight(event.nativeEvent.layout.height)
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollY(event.nativeEvent.contentOffset.y)
    }

    return (
      <ViewContext.Provider
        value={{
          rootRef: refToUse,
          y: scrollY,
          scrollViewHeight,
        }}
      >
        <ScrollView
          ref={refToUse}
          onLayout={onLayout}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          {...rest}
        />
      </ViewContext.Provider>
    )
  }
)

export const FlatListObserver = <K = any,>({
  scrollEventThrottle = 512,
  flatListRef,
  ...rest
}: IFlatListObserverProps<K>) => {
  const internalRef = useRef<FlatList<K>>(null)
  const refToUse = flatListRef || internalRef
  const [scrollY, setScrollY] = useState(0)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)

  const debounceSetViewHeight = useCallback(
    debounce((height: number) => {
      setScrollViewHeight(height)
    }, 500),
    []
  )

  const onLayout = (event: LayoutChangeEvent) => {
    debounceSetViewHeight(event.nativeEvent.layout.height)
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y)
  }

  return (
    <ViewContext.Provider
      value={{
        rootRef: refToUse,
        y: scrollY,
        scrollViewHeight,
      }}
    >
      <FlatList<K>
        ref={refToUse}
        onLayout={onLayout}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        {...rest}
      />
    </ViewContext.Provider>
  )
}
