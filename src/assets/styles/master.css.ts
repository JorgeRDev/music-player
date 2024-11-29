import { init, Style } from "@master/css"

Style.extend("classes", {
  songItem:
    "max-h:4rem h:4rem min-h:4rem w:100% grid grid-template-columns:3rem|1fr|1fr|3.5rem grid-template-columns:3rem|1fr|1fr|1fr|3.5rem@xs grid-template-columns:3rem|1fr|13%|30%|5%|15%|3.5rem@md pl:2% font-weight:600 bg:transparent bg:$(color-ui-background-hover):hover align-items:center gap:1rem",
})

init()
