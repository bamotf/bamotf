import {useMedia} from '@/hooks/use-media'
import * as Scrollytelling from '@bsmnt/scrollytelling'
import {Atom, Bitcoin, FastForward, FunctionSquare} from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    name: 'Development-first.',
    description:
      'Quickly set up a local development environment that matches production. No more waiting for transactions to get confirmed on the blockchain.',
    icon: FastForward,
  },
  {
    name: 'Automatically convert values.',
    description:
      'Just pass the amount in your preferred currency and bamotf will convert it to the equivalent amount in bitcoin users have to pay.',
    icon: Bitcoin,
  },
  {
    name: 'Autocomplete and type-safe.',
    description:
      'The best code is the code that writes itself, so you can move quickly and be sure you don`t break stuff accidentally.',
    icon: FunctionSquare,
  },
  {
    name: 'React components.',
    description:
      'Ready-to-use pre-built fully customizable components and utilities that speed up development and make it the perfect starting point for your next project.',
    icon: Atom,
  },
]

export default function FeatureA() {
  const isMobileSize = useMedia('(max-width: 768px)')
  const isTabletSize = useMedia('(min-width: 769px) and (max-width: 1024px)')

  return (
    <div className="py-24 sm:py-32">
      <Scrollytelling.Root>
        <Scrollytelling.Pin
          childHeight={isMobileSize ? 'auto' : '100vh'}
          pinSpacerHeight={isMobileSize ? 'auto' : '300vh'}
          childClassName="flex items-center justify-center"
        >
          <div>
            <div className="mx-auto max-w-[90rem] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-orange-400">
                  Create faster
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything you need to get payed
                </p>
                <p className="mt-6 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                  bamotf integrates the whole infrastructure needed for starting
                  receiving bitcoin payments, including server, react
                  components, utility packages and webhooks.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 lg:mt-8 xl:mt-10 2xl:mt-12">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:ml-auto lg:pl-4 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-neutral-700 dark:text-neutral-300 lg:max-w-none">
                      {features.map(feature => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold">
                            <feature.icon
                              className="absolute left-1 top-1 h-5 w-5 text-orange-600"
                              aria-hidden="true"
                            />
                            {feature.name}
                          </dt>{' '}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <Scrollytelling.Pin
                  childHeight={isMobileSize ? '100vh' : '0'}
                  pinSpacerHeight={isMobileSize ? '200vh' : '0'}
                  childClassName="flex items-center justify-center lg:items-start lg:justify-end"
                  pinSpacerClassName="lg:order-first"
                  top={64}
                >
                  <Scrollytelling.Animation
                    tween={{
                      start: isMobileSize ? 80 : isTabletSize ? 33 : 33,
                      end: isMobileSize ? 90 : isTabletSize ? 33 : 66,
                      to: {
                        opacity: 0,
                      },
                    }}
                  >
                    <Image
                      src="/feature-item.svg"
                      alt="Product screenshot"
                      className="max-w-[100vw] sm:w-[48rem] sm:max-w-none absolute"
                      width={557}
                      height={530}
                    />
                  </Scrollytelling.Animation>
                  <Scrollytelling.Animation
                    tween={{
                      start: isMobileSize ? 80 : isTabletSize ? 33 : 33,
                      end: isMobileSize ? 90 : isTabletSize ? 33 : 66,
                      from: {
                        opacity: 0,
                      },
                    }}
                  >
                    <Image
                      src="/feature-checkout.svg"
                      alt="Product screenshot"
                      className="max-w-[100vw] sm:w-[48rem] sm:max-w-none absolute"
                      width={557}
                      height={530}
                    />
                  </Scrollytelling.Animation>
                </Scrollytelling.Pin>
              </div>
            </div>
          </div>
        </Scrollytelling.Pin>
      </Scrollytelling.Root>
    </div>
  )
}
