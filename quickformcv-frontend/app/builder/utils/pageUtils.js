export const createNewPage = (pages) => ({
  id: Math.max(...pages.map((p) => p.id), 0) + 1,
  name: `Page ${pages.length + 1}`,
  sections: [],
});

export const getAssignedSections = (pages) =>
    new Set(pages.flatMap((page) => page.sections));
