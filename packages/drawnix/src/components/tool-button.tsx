// Credits to excalidraw
import './tool-icon.scss';

import type { CSSProperties } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { AbortError } from '../errors';
import { isPromiseLike } from '../utils/common';
import classNames from 'classnames';
import { EventPointerType } from '../types';

export type ToolButtonSize = 'small' | 'medium';

type ToolButtonBaseProps = {
  icon?: React.ReactNode;
  'aria-label': string;
  'aria-keyshortcuts'?: string;
  'data-testid'?: string;
  label?: string;
  title?: string;
  name?: string;
  id?: string;
  size?: ToolButtonSize;
  keyBindingLabel?: string | null;
  showAriaLabel?: boolean;
  hidden?: boolean;
  visible?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onPointerDown?(data: {
    pointerType: EventPointerType;
    event: React.PointerEvent<HTMLElement>;
  }): void;
  onPointerUp?(data: { pointerType: EventPointerType }): void;
};

type ToolButtonProps =
  | (ToolButtonBaseProps & {
      type: 'button';
      children?: React.ReactNode;
      onClick?(event: React.MouseEvent): void;
    })
  | (ToolButtonBaseProps & {
      type: 'submit';
      children?: React.ReactNode;
      onClick?(event: React.MouseEvent): void;
    })
  | (ToolButtonBaseProps & {
      type: 'icon';
      children?: React.ReactNode;
      onClick?(): void;
    })
  | (ToolButtonBaseProps & {
      type: 'radio';
      checked: boolean;
      onChange?(data: { pointerType: EventPointerType | null }): void;
    });

export const ToolButton = React.forwardRef((props: ToolButtonProps, ref) => {
  const { id: drawnixId } = { id: 'drawnix' };
  const innerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => innerRef.current);
  const sizeCn = `tool-icon_size_${props.size || 'medium'}`;

  const [isLoading, setIsLoading] = useState(false);

  const isMountedRef = useRef(true);

  const onClick = async (event: React.MouseEvent) => {
    const ret = 'onClick' in props && props.onClick?.(event);

    if (isPromiseLike(ret)) {
      try {
        setIsLoading(true);
        await ret;
      } catch (error: any) {
        if (!(error instanceof AbortError)) {
          throw error;
        } else {
          console.warn(error);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const lastPointerTypeRef = useRef<EventPointerType | null>(null);

  if (
    props.type === 'button' ||
    props.type === 'icon' ||
    props.type === 'submit'
  ) {
    const type = (props.type === 'icon' ? 'button' : props.type) as
      | 'button'
      | 'submit';
    return (
      <button
        className={classNames(
          'tool-icon_type_button',
          sizeCn,
          props.className,
          props.visible && !props.hidden
            ? 'tool-icon_type_button--show'
            : 'tool-icon_type_button--hide',
          {
            'tool-icon': !props.hidden,
            'tool-icon--selected': props.selected,
          }
        )}
        style={props.style}
        data-testid={props['data-testid']}
        hidden={props.hidden}
        title={props.title}
        aria-label={props['aria-label']}
        type={type}
        onClick={onClick}
        onPointerDown={(event) => {
          props.onPointerDown?.({
            pointerType: event.pointerType || null,
            event,
          });
        }}
        onPointerUp={(event) => {
          props.onPointerUp?.({ pointerType: event.pointerType || null });
        }}
        ref={innerRef}
        disabled={isLoading || !!props.disabled}
      >
        {(props.icon || props.label) && (
          <div
            className="tool-icon__icon"
            aria-hidden="true"
            aria-disabled={!!props.disabled}
          >
            {props.icon || props.label}
            {props.keyBindingLabel && (
              <span className="tool-icon__keybinding">
                {props.keyBindingLabel}
              </span>
            )}
          </div>
        )}
        {props.showAriaLabel && (
          <div className="tool-icon__label">{props['aria-label']}</div>
        )}
        {props.children && (
          <div className="tool-icon__icon">{props.children}</div>
        )}
      </button>
    );
  }

  return (
    <label
      className={classNames('tool-icon', props.className)}
      title={props.title}
      onPointerDown={(event) => {
        lastPointerTypeRef.current = event.pointerType || null;
        props.onPointerDown?.({
          pointerType: event.pointerType || null,
          event,
        });
      }}
      onPointerUp={(event) => {
        props.onPointerUp?.({ pointerType: event.pointerType || null });
        requestAnimationFrame(() => {
          lastPointerTypeRef.current = null;
        });
      }}
    >
      <input
        className={`tool-icon_type_radio ${sizeCn}`}
        type="radio"
        name={props.name}
        aria-label={props['aria-label']}
        aria-keyshortcuts={props['aria-keyshortcuts']}
        data-testid={props['data-testid']}
        id={`${drawnixId}-${props.id}`}
        onChange={() => {
          props.onChange?.({ pointerType: lastPointerTypeRef.current });
        }}
        checked={props.checked}
        ref={innerRef}
      />
      <div className="tool-icon__icon">
        {props.icon}
        {props.keyBindingLabel && (
          <span className="tool-icon__keybinding">{props.keyBindingLabel}</span>
        )}
      </div>
    </label>
  );
});

ToolButton.displayName = 'ToolButton';
