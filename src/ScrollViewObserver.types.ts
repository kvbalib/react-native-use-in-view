import { Ref, RefObject } from 'react'
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native'
import { LayoutRectangle } from 'react-native/Libraries/Types/CoreEventTypes'

export type ScrollListener = () => void

export interface IObserverContext {
  registerScrollListener: (listener: ScrollListener) => void
  unregisterScrollListener: (listener: ScrollListener) => void
  scrollRef: RefObject<ScrollView | FlatList>
  scrollViewRect: LayoutRectangle
}

export interface IUseInViewOptions {
  /**
   * The number of pixels outside the viewport within which the element is considered visible.
   * Positive values extend the viewport bounds outward; negative values shrink them inward.
   * For example, -100 means the element is in view if it’s within 100 pixels outside the viewport.
   * @default 0
   */
  threshold?: number
  initialInView?: boolean
  triggerOnce?: boolean
}

export interface IScrollViewObserverProps extends ScrollViewProps {}

export interface IFlatListObserverProps<K> extends FlatListProps<K> {
  flatListRef?: Ref<FlatList<K>>
}

export interface UseScrollListenersResult<T extends ScrollView | FlatList> {
  scrollRef: RefObject<T>
  scrollViewRect: IObserverContext['scrollViewRect']
  registerScrollListener: (listener: ScrollListener) => void
  unregisterScrollListener: (listener: ScrollListener) => void
  handleScroll: (event: any) => void
  handleLayout: (event: LayoutChangeEvent) => void
}
