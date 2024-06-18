import type { EmojiProps } from '@plait/mind';

export const Emoji: React.FC<EmojiProps> = (props: EmojiProps) => {
  return (
    <span
      className="mind-node-emoji"
      style={{ fontSize: `${props.fontSize}px` }}
    >
      {props.emojiItem.name}
    </span>
  );
};
