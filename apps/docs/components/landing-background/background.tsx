import cn from 'classnames'

import styles from './background.module.css'

function Background() {
  return (
    <div
      className={cn(
        '![perspective:1000px] sm:![perspective:1000px] md:![perspective:1000px] lg:![perspective:1000px]',
        styles.container,
      )}
    >
      <div
        className="z-[100] absolute inset-0 [--gradient-stop-1:0px] [--gradient-stop-2:50%]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0) 0px, var(--geist-foreground) 50%)',
        }}
      />
      <div
        style={{
          transform: 'rotateX(75deg)',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className={styles.lines} />
      </div>
    </div>
  )
}

export default function LandingBackground() {
  return (
    <div className="absolute left-0 w-full h-full overflow-hidden pointer-events-none">
      <div
        className={cn(
          'z-[-1] absolute w-full h-full [--gradient-stop-1:60%] [--gradient-stop-2:85%] lg:[--gradient-stop-1:50%] lg:[--gradient-stop-2:90%]',
          '[--gradient-color-1=rgba(0,0,0,1)] [--gradient-color-2=rgba(0,0,0,0.8)] [--gradient-color-3=rgba(0,0,0,0)]',
          'dark:[--gradient-color-1=rgba(255,255,255,1)] dark:[--gradient-color-2=rgba(255,255,255,0.8)] dark:[--gradient-color-3=rgba(255,255,255,0)]',
        )}
        style={{
          background:
            'linear-gradient(180deg, var(--gradient-color-1) 0%, var(--gradient-color-2) var(--gradient-stop-1), var(--gradient-color-3) var(--gradient-stop-2), 100% transparent)',
        }}
      />
      <span className={cn(styles.leftLights, 'opacity-50 dark:opacity-100')} />
      <span className={cn(styles.rightLights, 'opacity-50 dark:opacity-100')} />
      <span className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t dark:from-transparent from-white to-transparent" />
      <span className="bg-gradient-to-b dark:from-transparent from-white to-transparent absolute left-0 w-full" />
      <Background />
    </div>
  )
}
