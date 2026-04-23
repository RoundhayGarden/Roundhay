const Spinner = ({ label = "Loading...", center = false }) => {
  return (
    <div className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}>
      <div
        className="size-5 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </div>
  )
}

export default Spinner
