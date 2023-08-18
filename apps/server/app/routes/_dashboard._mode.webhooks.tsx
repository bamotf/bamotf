import {Outlet, type V2_MetaFunction} from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Webhooks'}]
}

export default function WebhooksLayout() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Outlet />
    </div>
  )
}
