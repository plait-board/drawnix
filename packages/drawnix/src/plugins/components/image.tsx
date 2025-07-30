import type { ImageProps } from '@plait/common';
import classNames from 'classnames';

export const Image: React.FC<ImageProps> = (props: ImageProps) => {
  const imgProps = {
    src: props.imageItem.url,
    draggable: false,
    width: '100%',
  };
  return (
    <div>
      <img
        {...imgProps}
        className={classNames('image-origin', {
          'image-origin--focus': props.isFocus,
        })}
      />
    </div>
  );
};
