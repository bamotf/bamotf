import React from 'react'

interface CardProps {
  title: string
  subtitle: string
}

const Card: React.FC<CardProps> = ({title, subtitle}) => {
  return (
    <div className="w-80 h-40 p-4 text-base no-underline border dark:border-neutral-400  dark:text-neutral-200 dark:hover:border-white dark:hover:text-white border-[#EAEAEA] text-neutral-800 hover:border-black hover:text-black rounded md:leading-6 transition-all duration-300 flex flex-col justify-center items-center">
      <h2 className="w-full h-1/4 font-bold text-sm">{title}</h2>
      <p className="w-full h-2/3 font-medium opacity-70 text-sm">{subtitle}</p>
    </div>
  )
}

export default Card
