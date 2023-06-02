import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ]
}

export async function loader({params, request}: LoaderArgs) {
  return {message: 'hello world'}
}

export default function Index() {
  const {message} = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        {message}
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
