import { useContext } from 'react';
import { MenuIcon } from '../../icons';
import { useI18n } from '../../../i18n';
import Menu from '../../menu/menu';
import MenuItem from '../../menu/menu-item';
import { MenuContentPropsContext } from '../../menu/common';
import { EVENT } from '../../../constants';

export const LanguageSwitcherMenu = () => {
  const { language, setLanguage, t } = useI18n();
  const menuContentProps = useContext(MenuContentPropsContext);
  
  return (
    <MenuItem
      icon={MenuIcon}
      data-testid="language-switcher-button"
      onSelect={() => {
        // This will be handled by the submenu
      }}
      submenu={
        <Menu onSelect={() => {
          const itemSelectEvent = new CustomEvent(EVENT.MENU_ITEM_SELECT, {
            bubbles: true,
            cancelable: true,
          });
          menuContentProps.onSelect?.(itemSelectEvent);
        }}>
          <MenuItem
            onSelect={() => {
              setLanguage('zh');
            }}
            aria-label={t('language.chinese')}
            selected={language === 'zh'}
          >
            {t('language.chinese')}
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setLanguage('en');
            }}
            aria-label={t('language.english')}
            selected={language === 'en'}
          >
            {t('language.english')}
          </MenuItem>
        </Menu>
      }
      aria-label={t('language.switcher')}
    >
      {t('language.switcher')}
    </MenuItem>
  );
};

LanguageSwitcherMenu.displayName = 'LanguageSwitcherMenu';