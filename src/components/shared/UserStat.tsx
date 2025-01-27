interface UserStatProps {
  value: number | string // Numeric or string value to display
  label: string // Label for the statistic
}

const UserStat = ({ value, label }: UserStatProps) => {
  return (
    <div className="w-1/3 flex justify-end">
      <div className="text-center">
        {/* Display value with formatting for numbers */}
        <p className="text-light-primary text-xl md:text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {/* Display label */}
        <p className="text-light-muted text-sm md:text-base">{label}</p>
      </div>
    </div>
  )
}

export default UserStat
