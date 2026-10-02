export function waitForFonts() {
  const loading = Promise.all([
    document.fonts.load("400 1em 'Cormorant Garamond Variable'"),
    document.fonts.load("italic 400 1em 'Cormorant Garamond Variable'"),
    document.fonts.load("400 1em 'Jost Variable'"),
  ]).catch(() => {});

  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));

  return Promise.race([loading, timeout]);
}
