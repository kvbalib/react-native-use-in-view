import React, {
  createContext,
  ForwardedRef,
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
} from 'react-native'

import type {
  IFlatListObserverProps,
  IObserverContext,
  IScrollViewObserverProps,
  IUseInViewOptions,
  ScrollListener,
  UseScrollListenersResult,
} from './ScrollViewObserver.types'

const ViewContext = createContext<IObserverContext | null>(null)

/**
 * Hook to detect if an element is in the viewport.
 * The `ref` must be attached to a native component (e.g., View, Text) or a custom component that forwards the ref to a native component.
 */
export const useInView = (options?: IUseInViewOptions) => {
  const { initialInView = false, threshold = 0, triggerOnce = false } = options || {}
  const [inView, setInView] = useState(initialInView)
  const elementRef = useRef<View>(null)
  const scrollContext = useContext(ViewContext)

  const checkInView = useCallback(() => {
    if (!elementRef.current?.measureInWindow) return

    if (!scrollContext?.scrollViewRect) {
      console.warn(
        'useInView: Scroll context is not available. Ensure useInView is used within a ScrollViewObserver or FlatListObserver.'
      )
      return
    }

    const { scrollViewRect } = scrollContext
    const {
      x: scrollViewX,
      y: scrollViewY,
      width: scrollViewWidth,
      height: scrollViewHeight,
    } = scrollViewRect

    elementRef.current.measureInWindow((x, y, width, height) => {
      const elementRight = x + width
      const elementBottom = y + height

      const isVisible =
        elementRight > scrollViewX - threshold &&
        elementBottom > scrollViewY - threshold &&
        x < scrollViewX + scrollViewWidth + threshold &&
        y < scrollViewY + scrollViewHeight + threshold

      if (isVisible && !inView) setInView(true)
      else if (!isVisible && !triggerOnce && inView) setInView(false)
    })
  }, [inView, threshold])

  useEffect(() => {
    const timeout = setTimeout(checkInView, 0)
    return () => clearTimeout(timeout)
  }, [checkInView])

  useEffect(() => {
    if (scrollContext) scrollContext.registerScrollListener(checkInView)
    return () => {
      if (scrollContext) scrollContext.unregisterScrollListener(checkInView)
    }
  }, [scrollContext, checkInView])

  return { ref: elementRef, inView }
}

/**
 * Generic hook to manage scroll listeners.
 */
const useScrollListeners = <T extends ScrollView | FlatList<any> = ScrollView>(options: {
  ref?: ForwardedRef<T>
  onLayout?: (event: LayoutChangeEvent) => void
}): UseScrollListenersResult<T> => {
  const listeners = useRef(new Set<ScrollListener>())
  const internalRef = useRef<T>(null)
  const refToUse = (options.ref ?? internalRef) as React.RefObject<T>
  const [scrollViewRect, setScrollViewRect] = useState<
    UseScrollListenersResult<T>['scrollViewRect']
  >({ x: 0, y: 0, width: 0, height: 0 })

  const registerScrollListener = useCallback((listener: ScrollListener) => {
    listeners.current.add(listener)
  }, [])

  const unregisterScrollListener = useCallback((listener: ScrollListener) => {
    listeners.current.delete(listener)
  }, [])

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    listeners.current.forEach((listener) => listener())
  }, [])

  const handleLayout = (event: LayoutChangeEvent) => {
    setScrollViewRect(event.nativeEvent.layout)
    if (options.onLayout) options.onLayout(event)
  }

  return {
    scrollRef: refToUse,
    scrollViewRect,
    registerScrollListener,
    unregisterScrollListener,
    handleScroll,
    handleLayout,
  }
}

/**
 * Implementation of a ScrollView with in-view detection and scroll listeners.
 * This component is used to wrap a ScrollView and provide in-view detection for its children.
 * It takes all the props of a standard ScrollView and forwards the ref to the internal ScrollView.
 */
export const ScrollViewObserver = forwardRef<ScrollView, IScrollViewObserverProps>(
  ({ scrollEventThrottle = 100, onScroll, onLayout, ...rest }, ref) => {
    const {
      scrollRef,
      scrollViewRect,
      registerScrollListener,
      unregisterScrollListener,
      handleScroll,
      handleLayout,
    } = useScrollListeners({ ref, onLayout })

    return (
      <ViewContext.Provider
        value={{ registerScrollListener, unregisterScrollListener, scrollViewRect, scrollRef }}
      >
        <ScrollView
          ref={scrollRef}
          onLayout={handleLayout}
          onScroll={handleScroll}
          scrollEventThrottle={scrollEventThrottle}
          {...rest}
        />
      </ViewContext.Provider>
    )
  }
)

/**
 * Implementation of a FlatList with in-view detection and scroll listeners.
 * This component is used to wrap a FlatList and provide in-view detection for its children.
 * It takes all the props of a standard FlatList and forwards the ref to the internal FlatList.
 */
export const FlatListObserver = <K = any,>({
  scrollEventThrottle = 100,
  flatListRef,
  onLayout,
  onScroll,
  ...rest
}: IFlatListObserverProps<K>) => {
  const {
    scrollRef,
    scrollViewRect,
    registerScrollListener,
    unregisterScrollListener,
    handleScroll,
    handleLayout,
  } = useScrollListeners({ ref: flatListRef, onLayout })

  return (
    <ViewContext.Provider
      value={{ registerScrollListener, unregisterScrollListener, scrollViewRect, scrollRef }}
    >
      <FlatList<K>
        ref={scrollRef}
        onLayout={handleLayout}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle}
        {...rest}
      />
    </ViewContext.Provider>
  )
}
