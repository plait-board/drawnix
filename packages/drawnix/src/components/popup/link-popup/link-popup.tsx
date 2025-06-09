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
import { LinkEditor } from '@plait/text-plugins';
import { LinkElement } from '@plait/common';
import { useBoard } from '@plait-board/react-board';

export const LinkPopup = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [linkState, setLinkState] = useState<LinkState | null>(null);
  const [url, setUrl] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const { appState, setAppState } = useDrawnix();

  const board = useBoard();

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(20), flip()],
  });

  const target = appState.linkState?.targetDom || null;

  const closeHandle = () => {
    setIsOpening(false);
    setLinkState(null);
    setIsEditing(false);
    setUrl('');
    if (target) {
      setAppState({
        ...appState,
        linkState: null,
      });
    }
  };

  useEffect(() => {
    if (isOpening && target) {
      refs.setPositionReference(target);
    }
  }, [board.viewport])

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
    } else if (!isHovering) {
      closeHandle();
    }
  }, [target]);

  useEffect(() => {
    if (!isHovering && !isEditing && !target) {
      closeHandle();
    }
  }, [isHovering]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target as Node)
      ) {
        if (linkState) {
          const linkElement = LinkEditor.getLinkElement(linkState.editor);
          if (linkElement && !(linkElement[0] as LinkElement).url.trim()) {
            LinkEditor.unwrapLink(linkState.editor);
          }
        }
        closeHandle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (appState.linkState) {
      if (isEditing && !appState.linkState.isEditing) {
        setAppState({
          ...appState,
          linkState: {
            ...appState.linkState,
            isEditing: true,
          },
        });
      } else if (!isEditing && appState.linkState.isEditing) {
        setAppState({
          ...appState,
          linkState: {
            ...appState.linkState,
            isEditing: false,
          },
        });
      }
    } else if (isEditing) {
      setAppState({
        ...appState,
        linkState: {
          ...linkState!,
          isEditing: true,
        },
      });
    }
  }, [isEditing]);

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
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveUrl();
                }
              }}
              className="link-popup__input"
              autoFocus
            />
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
