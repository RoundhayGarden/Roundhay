import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getRateColor } from "../lib/utils"

const VoteProgress = ({ voteAverage }) => {
  const ratePercent = Math.round((voteAverage ?? 0) * 10)

  return (
    <div className="h-10 w-10 rounded-full bg-background/90 p-1 shadow">
      <CircularProgressbar
        value={ratePercent}
        text={`${ratePercent}%`}
        styles={buildStyles({
          textSize: "26px",
          textColor: "var(--foreground)",
          pathColor: getRateColor(ratePercent),
          trailColor: "var(--border)",
        })}
      />
    </div>
  )
}

export default VoteProgress
