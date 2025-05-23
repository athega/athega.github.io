#import "@preview/cmarker:0.1.5"

#let cfg = (
  file: sys.inputs.at("FILE", default: "document.md"),
  rule: eval(sys.inputs.at("RULE", default: "pagebreak")),
  page: eval("("+sys.inputs.at("PAGE", default: "paper: \"a4\", margin: 0.5cm")+")"),
  text: eval("("+sys.inputs.at("TEXT", default: "font: \"Inter\", size: 14pt")+")"),
  code: eval("("+sys.inputs.at("CODE", default: "font: \"Office Code Pro D\", weight: \"medium\", size: 1em")+")"),
  line: eval("("+sys.inputs.at("LINE", default: "stroke: luma(220)")+")"),
  table: eval("("+sys.inputs.at("TABLE", default: "stroke: luma(220), inset: 0.4em")+")"),
  raw: (
    box: eval("("+sys.inputs.at("RAW_BOX", default: "")+")"),
    block: eval("("+sys.inputs.at("RAW_BLOCK", default: "inset: 1em")+")"),
  ),
)

#set page(..cfg.page)
#set text(..cfg.text)
#set line(..cfg.line)
#set table(..cfg.table)

#let code=text.with(..cfg.code)

#show raw.where(block: false): it => box.with(..cfg.raw.box)(code(it))
#show raw.where(block: true): it => block.with(..cfg.raw.block)(code(it))

#cmarker.render(
  read(cfg.file),
  scope: (
    cfg: cfg,
    rule: cfg.rule,
    code: code,
    image: (path, alt: none) => image(path, alt: alt),
  )
)
