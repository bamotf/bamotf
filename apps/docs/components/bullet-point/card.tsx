import React from 'react'

interface CardProps {
  title: string
  subtitle: string
}

const Card: React.FC<CardProps> = ({title, subtitle}) => {
  return (
    <div className="w-80 h-40 p-4 text-base no-underline border nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset] contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff] dark:border-[#333]  dark:text-neutral-200 dark:hover:border-white dark:hover:text-white text-neutral-800 hover:border-black hover:text-black rounded md:leading-6 transition-all duration-300 flex flex-col justify-center items-center">
      <h2 className="w-full h-1/4 font-bold text-sm">{title}</h2>
      <p className="w-full h-2/3 font-medium opacity-70 text-sm">{subtitle}</p>
    </div>
  )
}

export default Card
