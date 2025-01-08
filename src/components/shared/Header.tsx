import clsx from 'clsx'

interface HeaderProps {
  title: string
  iconUrl?: string
  className?: string
}

const Header = ({ title, iconUrl, className }: HeaderProps) => {
  return (
    <div
      className={clsx(
        'max-w-5xl flex items-center justify-start gap-2 md:gap-3 w-full',
        className
      )}
    >
      <img src={iconUrl} alt="Create" className="size-5 md:size-8" />
      <h2 className="text-xl md:text-3xl font-bold text-left w-full text-light-primary">
        {title}
      </h2>
    </div>
  )
}

export default Header
