import type { ImageProps } from '@plait/common';
import { PlaitDrawElement } from '@plait/draw';

export const Image: React.FC<ImageProps> = (props: ImageProps) => {
  const canPreviewImage =
    props.isFocus && !PlaitDrawElement.isImage(props.element);
  const imgProps = {
    className: 'image-viewer-origin',
    src: props.imageItem.url,
    draggable: 'false',
    width: '100%',
    ...(canPreviewImage === false ? { 'data-preview-disabled': true } : {}),
  };
  return (
    <div>
      <img {...imgProps} />
    </div>
  );
};
