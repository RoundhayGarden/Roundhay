import { Spinner as BaseSpinner } from "./ui/spinner"

const Spinner = ({ label = "Loading...", center = false }) => {
  return (
    <div className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}>
      <BaseSpinner className="size-10 text-primary" />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </div>
  )
}

export default Spinner
