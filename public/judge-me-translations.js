;(() => {
  const originalCreateElement = document.createElement.bind(document)
  document.createElement = (tagName) => {
    const element = originalCreateElement(tagName)
    if (tagName.toLowerCase() === "span" || tagName.toLowerCase() === "div") {
      const originalSetAttribute = element.setAttribute.bind(element)
      element.setAttribute = function (name, value) {
        if (name === "data-translation-key") {
          return // Não adicione este atributo, pois já estamos usando para nossa própria tradução
        }
        if (name === "class" && value.includes("jdgm-")) {
          // Adicione o atributo data-translation-key para elementos que precisam ser traduzidos
          if (value.includes("jdgm-rev__title")) {
            this.setAttribute("data-translation-key", "Verified Buyer")
          } else if (value.includes("jdgm-rev__time-created")) {
            this.textContent = this.textContent.replace("days ago", "")
            this.setAttribute("data-translation-key", "days ago")
          }
          // Adicione mais casos conforme necessário
        }
        return originalSetAttribute(name, value)
      }
    }
    return element
  }
})()

