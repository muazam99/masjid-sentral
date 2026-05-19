"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useInfiniteScroll<T>(
  initialItems: T[],
  fetchMoreItems: (page: number) => Promise<T[]>
) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const loadingRef = useRef(loading)
  const hasMoreRef = useRef(hasMore)
  const pageRef = useRef(page)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])
  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])
  useEffect(() => {
    pageRef.current = page
  }, [page])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    setLoading(true)
    try {
      const newItems = await fetchMoreItems(pageRef.current)
      const itemsArray = Array.isArray(newItems) ? newItems : []

      if (itemsArray.length === 0) {
        setHasMore(false)
      } else {
        setItems((prevItems) => [...prevItems, ...itemsArray])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error loading more items:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchMoreItems])

  const refresh = useCallback(async () => {
    setItems([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    try {
      const newItems = await fetchMoreItems(1)
      const itemsArray = Array.isArray(newItems) ? newItems : []
      setItems(itemsArray)
      setHasMore(itemsArray.length > 0)
      setPage(2)
    } catch (error) {
      console.error("Error refreshing items:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchMoreItems])

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!node) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore()
          }
        },
        { threshold: 0.1 },
      )

      observerRef.current.observe(node)
    },
    [loadMore],
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { items, loading, hasMore, loadMoreRef, refresh }
}
