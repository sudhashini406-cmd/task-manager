const a = (t, n = "projects.csv") => {
  if (!t || t.length === 0) {
    alert("No data available for export!");
    return;
  }
  const c = Object.keys(t[0]).join(",") + `
` + t.map((s) => Object.values(s).join(",")).join(`
`), r = new Blob([c], { type: "text/csv;charset=utf-8;" }), e = document.createElement("a"), o = URL.createObjectURL(r);
  e.href = o, e.setAttribute("download", n), document.body.appendChild(e), e.click(), document.body.removeChild(e), URL.revokeObjectURL(o);
};

export { a };
//# sourceMappingURL=ExportCsv-Cxm1M38I.mjs.map
