// This script is used to add/remove the API_URL env var on vercel
// when a PR is opened/closed
// It is used by the github action: .github/workflows/vercel-env.yml
//
// See:
// https://vercel.com/docs/rest-api#endpoints/projects/create-one-or-more-environment-variables

/* eslint-disable turbo/no-undeclared-env-vars */

const ENV_KEY = 'BAMOTF_SERVER_URL'
const PROJECT = 'website'

/**
 * Return all env-vars set on vercel for the following project
 * @param {string | number} projectIdOrName
 * @returns
 */
async function getAllEnvs(projectIdOrName) {
  const result = await fetch(
    `https://api.vercel.com/v9/projects/${projectIdOrName}/env`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      method: 'get',
    },
  )
  return result.json()
}

/**
 * Remove the ENV from the given project
 * @param {string | number} projectIdOrName
 * @param {string} gitBranch
 * @returns
 */
async function removeEnv(projectIdOrName, gitBranch) {
  const {envs} = await getAllEnvs(projectIdOrName)
  const customEnv = envs.filter(
    env => env.key === ENV_KEY && env.gitBranch === gitBranch,
  )

  if (!customEnv.length) {
    console.log(`${ENV_KEY} was not set on the branch \`${gitBranch}\``)
    return
  }

  const id = customEnv[0].id

  const result = await fetch(
    `https://api.vercel.com/v9/projects/${projectIdOrName}/env/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      method: 'delete',
    },
  )

  if (result.status !== 200) {
    console.error('Error removing env var from vercel')
    console.error(await result.json())
    process.exit(1)
  }
}

/**
 *
 * @param {string | number} projectIdOrName
 * @param {string} gitBranch
 * @param {number} prNumber
 * @returns
 */
async function addEnv(projectIdOrName, gitBranch, prNumber) {
  const result = await fetch(
    `https://api.vercel.com/v10/projects/${projectIdOrName}/env`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      method: 'post',
      body: JSON.stringify({
        key: ENV_KEY,
        value: `https://bamotf-bamotf-pr-${prNumber}.up.railway.app`,
        type: 'plain',
        target: ['preview'],
        gitBranch,
      }),
    },
  )

  const data = await result.json()
  if (data.failed.length) {
    console.error('Error adding env var on vercel')
    console.error(data)
    process.exit(1)
  }

  return data.created
}

async function main(args = process.argv.slice(2)) {
  const action = args[0]
  const branchName = args[1]
  const prNumber = args[2]

  switch (action) {
    case 'reopened':
    case 'opened':
      await addEnv(PROJECT, branchName, prNumber)
      break

    case 'closed':
      await removeEnv(PROJECT, branchName)
      break

    default:
      console.error(
        'Github action not supported. We can only edit the env vars when the PR is opened or closed',
      )
      break
  }
}

await main()
