import { useEffect, useState } from 'react';
import { Island } from '../../island';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import './link-popup.scss';
import { flip, offset, useFloating } from '@floating-ui/react';
import { LinkState, useDrawnix } from '../../../hooks/use-drawnix';
import { FeltTipPenIcon, TrashIcon } from '../../icons';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const LinkPopup = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [linkState, setLinkState] = useState<LinkState | null>(null);
  const [url, setUrl] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const { appState, setAppState } = useDrawnix();

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(20), flip()],
  });

  const target = appState.linkState?.targetDom || null;

  useEffect(() => {
    if (target) {
      setIsOpening(true);
      refs.setPositionReference(target);
      if (target !== linkState?.targetDom) {
        setIsEditing(false);
      }
      setLinkState(appState.linkState!);
      if (appState.linkState?.targetElement?.url) {
        setUrl(appState.linkState.targetElement.url);
      }
      if (appState.linkState?.isEditing) {
        setIsEditing(true);
      }
    } else if (!isHovering && !isEditing) {
      setIsOpening(false);
      setLinkState(null);
      setUrl('');
    }
  }, [target, isHovering]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target as Node)
      ) {
        setIsOpening(false);
        setIsEditing(false);
        setLinkState(null);
        setUrl('');
        if (linkState && url !== linkState.targetElement.url) {
          const editor = linkState.editor;
          const node = linkState.targetElement;
          const path = ReactEditor.findPath(editor, node);
          Transforms.setNodes(editor, { url: url }, { at: path });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let timeoutId: any | null = null;

  const saveUrl = () => {
    if (url !== linkState!.targetElement.url) {
      const editor = linkState!.editor;
      const node = linkState!.targetElement;
      const path = ReactEditor.findPath(editor, node);
      Transforms.setNodes(editor, { url: url }, { at: path });
    }
    setIsEditing(false);
  };

  return (
    isOpening && (
      <Island
        ref={refs.setFloating}
        style={floatingStyles}
        padding={1}
        className={classNames('link-popup')}
        onPointerEnter={() => {
          clearTimeout(timeoutId);
          setIsHovering(true);
        }}
        onPointerLeave={() => {
          timeoutId = setTimeout(() => {
            setIsHovering(false);
          }, 300);
        }}
      >
        <Stack.Row gap={1} align="center">
          {isEditing ? (
            <>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                onBlur={() => {}}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveUrl();
                  }
                }}
                className="link-popup__input"
                autoFocus
              />
            </>
          ) : (
            <>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-popup__link"
              >
                {url}
              </a>
              <ToolButton
                className="link-popup__edit"
                type="icon"
                visible={true}
                icon={FeltTipPenIcon}
                title={`Edit link`}
                aria-label={`Edit link`}
                onPointerDown={() => {
                  setIsEditing(true);
                }}
              ></ToolButton>
              <ToolButton
                type="icon"
                visible={true}
                icon={TrashIcon}
                title={`Delete link`}
                aria-label={`Delete link`}
                onPointerDown={() => {
                  const editor = linkState!.editor;
                  const targetElement = linkState!.targetElement;
                  const path = ReactEditor.findPath(editor, targetElement);
                  Transforms.unwrapNodes(editor, {
                    at: path,
                  });
                  setIsHovering(false);
                  setIsEditing(false);
                }}
              ></ToolButton>
            </>
          )}
        </Stack.Row>
      </Island>
    )
  );
};
