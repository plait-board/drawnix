import { describe, expect, it } from 'vitest';
import { enrichSvgLinks } from './image';

const buildSvg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">` +
  `<g><foreignObject width="100" height="100">` +
  `<div xmlns="http://www.w3.org/1999/xhtml" class="plait-text-container">${body}</div>` +
  `</foreignObject></g></svg>`;

const parseSvg = (svgData: string) =>
  new DOMParser().parseFromString(svgData, 'image/svg+xml');

const getLinks = (doc: Document) =>
  Array.from(doc.querySelectorAll('a'));

describe('enrichSvgLinks', () => {
  it('injects href/target/rel from data-url into plait board links', () => {
    const svg = buildSvg(
      `<a class="plait-board-link" data-url="https://example.com">example</a>`
    );

    const result = parseSvg(enrichSvgLinks(svg));
    const link = result.querySelector('a.plait-board-link')!;

    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('data-url')).toBe('https://example.com');
    expect(link.textContent).toBe('example');
  });

  it('handles multiple links with different urls independently', () => {
    const svg = buildSvg(
      `<a class="plait-board-link" data-url="https://a.example.com">a</a>` +
      `<a class="plait-board-link" data-url="https://b.example.com">b</a>`
    );

    const result = parseSvg(enrichSvgLinks(svg));
    const hrefs = getLinks(result).map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(['https://a.example.com', 'https://b.example.com']);
  });

  it('skips anchors with empty or whitespace-only data-url', () => {
    const svg = buildSvg(
      `<a class="plait-board-link" data-url="">empty</a>` +
      `<a class="plait-board-link" data-url="   ">blank</a>`
    );

    const result = parseSvg(enrichSvgLinks(svg));
    const links = getLinks(result);

    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link.getAttribute('href')).toBeNull();
    });
  });

  it('leaves anchors without plait-board-link class untouched', () => {
    const svg = buildSvg(
      `<a data-url="https://ignored.example.com">plain</a>`
    );

    const result = parseSvg(enrichSvgLinks(svg));
    const link = result.querySelector('a')!;

    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('data-url')).toBe('https://ignored.example.com');
  });

  it('returns equivalent markup when no links are present', () => {
    const svg = buildSvg(`<span>plain text</span>`);

    const result = parseSvg(enrichSvgLinks(svg));

    expect(result.querySelector('a')).toBeNull();
    expect(result.querySelector('span')!.textContent).toBe('plain text');
  });

  it('keeps sibling markup and foreign structure intact', () => {
    const svg = buildSvg(
      `<p>before</p><a class="plait-board-link" data-url="https://example.com">link</a><p>after</p>`
    );

    const result = parseSvg(enrichSvgLinks(svg));

    expect(result.querySelector('p')!.textContent).toBe('before');
    expect(result.querySelectorAll('p')).toHaveLength(2);
    expect(result.querySelector('foreignObject')).not.toBeNull();
    expect(result.querySelector('div')!.getAttribute('class')).toBe(
      'plait-text-container'
    );
  });
});
