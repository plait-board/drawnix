import type { ImageProps } from '@plait/common';

export const Image: React.FC<ImageProps> = (props: ImageProps) => {
  return (
    <div>
      <img src={props.imageItem.url} draggable="false" width="100%" />
    </div>
  );
};
