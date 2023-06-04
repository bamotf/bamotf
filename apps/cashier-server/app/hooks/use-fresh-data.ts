import type {AppData} from '@remix-run/node'
import {useFetcher, useLocation} from '@remix-run/react'
import {useEffect, useState} from 'react'
import type {UseDataFunctionReturn} from 'remix-typedjson'
import {useTypedLoaderData} from 'remix-typedjson'

export type UseFreshDataProps = {
  /**
   * The page to fetch data for.
   * Defaults to the current page.
   * @default useLocation().pathname
   * @example
   * const data = useFreshData({page: '/dashboard'})
   */
  page?: string

  /**
   * The number of seconds to wait before refetching data.
   * Defaults to 30 seconds.
   * @default 30_000
   * @example
   * const data = useFreshData({interval: 60_000})
   */
  interval?: number
}

/**
 * A hook that fetches fresh data every interval
 * (defaults to 30 seconds). It also refetches
 * data when the page becomes visible again.
 *
 * @example
 * const data = useFreshData()
 * const data = useFreshData({page: '/dashboard'})
 * const data = useFreshData({interval: 60_000})
 * const data = useFreshData({page: '/dashboard', interval: 60_000})
 */
export function useFreshData<T = AppData>({
  page: providedPage,
  interval = 30_000,
}: UseFreshDataProps = {}): UseDataFunctionReturn<T> {
  const loaderData = useTypedLoaderData()
  const fetcher = useFetcher()
  const location = useLocation()
  const currentPage = location?.pathname || '/'
  const page = providedPage || currentPage

  const [data, setData] = useState(loaderData)

  const revalidate = () => {
    if (document.visibilityState === 'visible') {
      fetcher.load(page)
    }
  }

  /**
   * When the page becomes visible again, revalidate the data.
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', revalidate)

    return () => document.removeEventListener('visibilitychange', revalidate)
  }, [])

  // Whenever the loader gives us new data
  // (for example, after a form submission),
  // update our `data` state.
  useEffect(() => setData(loaderData), [loaderData])

  // Get fresh data every 30 seconds.
  useEffect(() => {
    const intervalFunction = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetcher.load(page)
      }
    }, interval)

    return () => clearInterval(intervalFunction)
  }, [])

  // When the fetcher comes back with new data,
  // update our `data` state.
  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data)
    }
  }, [fetcher.data])

  return data
}
