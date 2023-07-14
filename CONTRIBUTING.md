# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

### Translation contributions

_TBD_

## Project setup

If you do need to set the project up locally yourself, feel free to follow these
instructions:

### System Requirements

- [Node.js](https://nodejs.org/) >= 16.0.0
- [git](https://git-scm.com/) >= 2.7.0
- [Docker](https://www.docker.com/)

### Setup steps

**👇👇👇 READ THIS 👇👇👇**

> You might get a TypeScript error when running `setup` that looks like this
> `error TS2420: Class 'NodeOnDiskFile' incorrectly implements interface 'File'.`
> The workaround is to just add a `// @ts-expect-error` on the line of the
> error. See more: https://github.com/remix-run/remix/issues/4371

1.  Fork and clone the repo
2.  Copy .env.example into .env
3.  Run `pnpm setup` to install dependencies and run validation
4.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

> Tip: Keep your `main` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/bam-otf/bam-otf.com.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main` branch
> to use the upstream main branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `main` branch. Whenever you
> want to update your version of `main`, do a regular `git pull`.

If the setup script doesn't work, you can try to run the commands manually:

```sh
git clone <your-fork>
cd ./bam-otf

# copy the .env.example to .env
#   everything's mocked out during development so you shouldn't need to
#   change any of these values unless you want to hit real environments.
cp .env.example .env

# Install deps
pnpm install

# setup database
pnpm prisma migrate reset --force

# run build, typecheck, linting
pnpm validate

# Install playwright browsers
pnpm test:e2e:install

# run integration tests
pnpm test:integration

# run e2e tests
pnpm test:e2e
```

If that all worked without trouble, you should be able to start development
with:

```sh
pnpm dev
```

And open up `http://localhost:3000` and rock!

## Mocks

Everything's mocked locally so you should be able to work completely offline.
The DB runs locally, but all third party endpoints are mocked out via
[`MSW`](https://mswjs.io/).

## Running automated tests

We have four kinds of tests, unit and component tests with Vitest, integration
and E2E tests with Playwright.

```sh
# run the unit and component tests with jest via:
pnpm test:unit

# run the Playwright tests in headless mode:
pnpm test:integration
pnpm test:e2e
```

Vitest and Playwright runs only on CI automatically.

## Running static tests (Formatting/Linting/Typing)

Everything's set up with TypeScript/Prettier/ESLint. These should all run on
commit (only relevant files are checked). You can run them individually though
if you want:

```sh
pnpm format
pnpm lint
pnpm typecheck
```

These are all configured in the project to hopefully work with whatever editor
plugins you have so it should work as you working as well.

## Styles

We use Tailwind for our styles. That's all configured in the
`tailwind.config.js` file. We also have a `global.css` file that's imported in
the root file that has some global styles.

## Database

We've got Postgres that starts with the docker-compose. Learn about the schema
and learn more about what commands you can run in
`apps/server/prisma/schema.prisma`.

One common command you might need to run is to re-seed the database:

```sh
pnpm prisma migrate reset --force
```

In addition to resetting your database to the latest schema, it'll also run the
seed script which will populate the database with some example data.

## Help needed

Please checkout [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

<!-- prettier-ignore-start -->
[egghead]: https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
[issues]: https://github.com/bam-otf/bam-otf.com/issues
<!-- prettier-ignore-end -->
