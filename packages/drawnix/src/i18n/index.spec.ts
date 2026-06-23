import { describe, expect, it } from 'vitest';
import { i18nInsidePlaitHook, setBoardLanguage } from './index';

describe('i18nInsidePlaitHook', () => {
  it('resolves language dynamically for a board instance', () => {
    const board = {};
    const i18n = i18nInsidePlaitHook(board);

    expect(i18n.language).toBe('zh');
    expect(i18n.t('general.delete')).toBe('删除');

    setBoardLanguage(board, 'en');

    expect(i18n.language).toBe('en');
    expect(i18n.t('general.delete')).toBe('Delete');
  });

  it('keeps the returned t() up-to-date even if the language is set after initialization', () => {
    const board = {};
    const { t } = i18nInsidePlaitHook(board);

    setBoardLanguage(board, 'en');

    expect(t('general.delete')).toBe('Delete');
  });
});
