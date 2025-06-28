import { useEffect, useState, useRef } from 'react';
import { Island } from '../../island';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import './link-popup.scss';
import { flip, offset, useFloating } from '@floating-ui/react';
import { useDrawnix } from '../../../hooks/use-drawnix';
import { FeltTipPenIcon, TrashIcon } from '../../icons';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { LinkEditor } from '@plait/text-plugins';
import { LinkElement } from '@plait/common';
import { useBoard } from '@plait-board/react-board';

export const LinkPopup = () => {
  const [url, setUrl] = useState('');

  const { appState, setAppState } = useDrawnix();

  const board = useBoard();

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(20), flip()],
  });

  const linkState = appState.linkState;
  const target = appState.linkState?.targetDom || null;
  const isEditing = appState.linkState?.isEditing || false;
  const isHoveringOrigin = appState.linkState?.isHoveringOrigin || false;
  const isHovering = appState.linkState?.isHovering || false;
  const isOpening = isEditing || isHoveringOrigin || isHovering;

  const linkStateRef = useRef(appState.linkState);

  useEffect(() => {
    linkStateRef.current = appState.linkState;
    if (appState.linkState) {
      setUrl(appState.linkState.targetElement.url);
    } else {
      setUrl('');
    }
  }, [appState.linkState]);

  useEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect();
      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.y,
            left: rect.x,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height,
          };
        },
      });
    }
  }, [board.viewport, target]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target as Node)
      ) {
        if (linkStateRef.current) {
          const linkElement = LinkEditor.getLinkElement(
            linkStateRef.current.editor
          );
          if (linkElement && !(linkElement[0] as LinkElement).url.trim()) {
            LinkEditor.unwrapLink(linkStateRef.current.editor);
          }
        }
        setAppState({
          ...appState,
          linkState: null,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const saveUrlAndExitEditing = () => {
    if (url !== linkState!.targetElement.url) {
      const editor = linkState!.editor;
      const node = linkState!.targetElement;
      const path = ReactEditor.findPath(editor, node);
      Transforms.setNodes(editor, { url: url }, { at: path });
    }
    const linkElement = LinkEditor.getLinkElement(linkState!.editor);
    setAppState({
      ...appState,
      linkState: {
        ...appState.linkState!,
        targetElement: linkElement[0] as LinkElement,
        isEditing: false,
        isHoveringOrigin: true,
      },
    });
  };

  return (
    isOpening && (
      <Island
        ref={refs.setFloating}
        style={floatingStyles}
        padding={1}
        className={classNames('link-popup')}
        onPointerEnter={() => {
          if (!isHovering) {
            setAppState({
              ...appState,
              linkState: {
                ...appState.linkState!,
                isHovering: true,
              },
            });
          }
        }}
        onPointerLeave={() => {
          if (!isEditing) {
            setAppState({
              ...appState,
              linkState: {
                ...appState.linkState!,
                isHovering: false,
              },
            });
          }
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveUrlAndExitEditing();
                  }
                }}
                className="link-popup__input"
                autoFocus
              />
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
                  setAppState({
                    ...appState,
                    linkState: null,
                  });
                }}
              ></ToolButton>
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
                onPointerDown={({ event }) => {
                  event.preventDefault();
                  setAppState({
                    ...appState,
                    linkState: {
                      ...appState.linkState!,
                      isEditing: true,
                    },
                  });
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
                  setAppState({
                    ...appState,
                    linkState: null,
                  });
                }}
              ></ToolButton>
            </>
          )}
        </Stack.Row>
      </Island>
    )
  );
};
