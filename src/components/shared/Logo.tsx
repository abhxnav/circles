import clsx from 'clsx'
import FullLogo from '@/assets/logos/logo-full.png'
import IconLogo from '@/assets/logos/logo-icon.png'
import TextLogo from '@/assets/logos/logo-text.png'

interface LogoProps {
  type?: 'full' | 'icon' | 'text'
  className?: string
}

const Logo = ({ type = 'full', className }: LogoProps) => {
  const getLogo = (type: LogoProps['type']) => {
    switch (type) {
      case 'full':
        return FullLogo
      case 'icon':
        return IconLogo
      case 'text':
        return TextLogo
      default:
        return FullLogo
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
