import { Ref, RefObject } from 'react'

import { FlatList, FlatListProps, ScrollView, ScrollViewProps } from 'react-native'

export interface IObserverContext {
  rootRef:
    | RefObject<ScrollView>
    | ((instance: ScrollView | null) => void)
    | RefObject<FlatList>
    | ((instance: FlatList | null) => void)
  y: number
  scrollViewHeight: number
}

export interface IUseInViewOptions {
  /**
   * The percentage of the element that should be visible before triggering the callback.
   * 1 = 100% visible, 0.5 = 50% visible, etc.
   * Can be a negative number, indicating how far outside the viewport the element must be before it is considered visible.
   * For example, use -0.1 for an intersection observer that triggers even if the element is 10% outside the viewport.
   * @default 0
   */
  threshold?: number
  /**
   * Whether the element should be in view initially.
   */
  initialInView?: boolean
  /**
   * Trigger the observer only once - it will not track the element after it is in view.
   * @default false
   */
  triggerOnce?: boolean
}

export interface IScrollViewObserverProps extends ScrollViewProps {}

export interface IFlatListObserverProps<K> extends FlatListProps<K> {
  flatListRef?: Ref<FlatList<K>>
}
