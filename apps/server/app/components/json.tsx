import JSONPretty from 'react-json-pretty'

import '~/components/json.css'

export function Json({data}: {data: unknown}) {
  return <JSONPretty className="font-light text-xs" data={data} />
}
