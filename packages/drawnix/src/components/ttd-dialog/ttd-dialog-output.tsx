import { withGroup } from '@plait/common';
import { PlaitElement, PlaitPlugin } from '@plait/core';
import { withDraw } from '@plait/draw';
import { withCommonPlugin } from '../../plugins/with-common';
import { Board, Wrapper } from '@plait-board/react-board';
import { MindThemeColors, withMind } from '@plait/mind';

const ErrorComp = ({ error }: { error: string }) => {
  return (
    <div
      data-testid="ttd-dialog-output-error"
      className="ttd-dialog-output-error"
    >
      Error! <p>{error}</p>
    </div>
  );
};

interface TTDDialogOutputProps {
  error: Error | null;
  value: PlaitElement[];
  loaded: boolean;
}

export const TTDDialogOutput = ({
  error,
  value,
  loaded,
}: TTDDialogOutputProps) => {
  const plugins: PlaitPlugin[] = [withDraw, withMind, withGroup, withCommonPlugin];
  const options = {
    readonly: true,
    hideScrollbar: false,
    disabledScrollOnNonFocus: true,
    themeColors: MindThemeColors,
  };
  return (
    <div className="ttd-dialog-output-wrapper">
      {error && <ErrorComp error={error.message} />}
      {
        <div
          style={{ opacity: error ? '0.15' : 1 }}
          className="ttd-dialog-output-canvas-container"
        >
          <Wrapper value={value} options={options} plugins={plugins}>
            <Board></Board>
          </Wrapper>
        </div>
      }
    </div>
  );
};
