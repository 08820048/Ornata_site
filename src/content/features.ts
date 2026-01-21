export type FeatureItem = {
  title: string;
  description: string;
  image: string;
};

export const featureItems: FeatureItem[] = [
  {
    title: 'Full Markdown, exactly as expected',
    description:
      'Write in standard Markdown without extensions or surprises.Headings, lists, tables, formulas, and code blocks render cleanly —the way plain text should.',
    image: 'img/features1.png',
  },
  {
    title: 'Instant, even with large files',
    description:
      'Open and edit large Markdown files without delay.Scrolling, typing, and rendering stay smooth,、no matter how long the document grows.',
    image: 'img/features2.png',
  },
  {
    title: 'Works naturally with Git',
    description:
      'Write Markdown as plain text files that fit perfectly into Git workflows.Clean diffs, readable history,and no hidden metadata.',
    image: 'img/features3.png',
  },
  {
    title: 'Edit and preview, side by side',
    description:
      'Write in plain Markdown while preview updates instantly.Switch between edit, preview, or split view —always knowing exactly what you’re writing.',
    image: 'img/features4.png',
  },
  {
    title: 'Designed to stay out of your way',
    description: 'No panels you don’t need. No visual noise. Just a quiet space to think and write.',
    image: 'img/features5.png',
  },
];

