interface UserStatProps {
  value: number | string
  label: string
}
const UserStat = ({ value, label }: UserStatProps) => {
  return (
    <div className="w-1/3 flex justify-end">
      <div className="text-center">
        <p className="text-light-primary text-xl md:text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-light-muted text-sm md:text-base">{label}</p>
      </div>
    </div>
  )
}

export default UserStat
