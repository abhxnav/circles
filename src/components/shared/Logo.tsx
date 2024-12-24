import clsx from 'clsx'

interface LogoProps {
  type?: 'full' | 'icon' | 'text'
  className?: string
}

const Logo = ({ type = 'full', className }: LogoProps) => {
  const getLogo = (type: LogoProps['type']) => {
    switch (type) {
      case 'full':
        return '/assets/logos/logo-full.png'
      case 'icon':
        return '/assets/logos/logo-icon.png'
      case 'text':
        return '/assets/logos/logo-text.png'
      default:
        return '/assets/logos/logo-full.png'
    }
  }

  return (
    <img
      src={getLogo(type)}
      alt="Circles"
      className={clsx(className, 'h-10 w-fit')}
    />
  )
}

export default Logo
