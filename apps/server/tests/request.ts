// TODO: this file is just a placeholder for now, see
// https://discord.com/channels/770287896669978684/940264701785423992/1126622590614655127

// The idea is to have a function that can be used to test the routes
// It should be able to import the loader from the route file get the params
// from the url based on the route filename and return the response
// depending on the request method

/**
 * @deprecated this is just a placeholder for now
 */
export const get = async (url: string) => {
  // TODO: get route file based on the url
  // TODO: import loader from file
  // TODO: get params from url based on the route filename
  // const response = await loader({
  //   request: new Request(`http://app.com/${url}`),
  //   params: {},
  //   context: {},
  // })
  // return response
}

/**
 * Parse the data object into a FormData object
 *
 * @param data
 * @returns
 */
export function parseFormData<T extends object>(data: T) {
  let body = new FormData()

  Object.keys(data).forEach(key => {
    body.append(key, String(data[key as keyof typeof data]))
  })

  return body
}
