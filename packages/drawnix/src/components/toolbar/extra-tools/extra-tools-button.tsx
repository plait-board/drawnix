import { useBoard } from "@plait-board/react-board";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/popover";
import { PlaitBoard } from "@plait/core";
import { useState } from "react";
import { ToolButton } from "../../tool-button";
import { ExtraToolsIcon } from "../../icons";
import Menu from "../../menu/menu";
import { MermaidToDrawnixItem } from "./menu-items";

export const ExtraToolsButton = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  return (
    <Popover
      key={0}
      sideOffset={12}
      open={appMenuOpen}
      onOpenChange={(open) => {
        setAppMenuOpen(open);
      }}
      placement="bottom-start"
    >
      <PopoverTrigger asChild>
        <ToolButton
          type="icon"
          visible={true}
          selected={appMenuOpen}
          icon={ExtraToolsIcon}
          title={`Extra Tools`}
          aria-label={`Extra Tools`}
          onPointerDown={() => {
            setAppMenuOpen(!appMenuOpen);
          }}
        />
      </PopoverTrigger>
      <PopoverContent container={container}>
        <Menu
          onSelect={() => {
            setAppMenuOpen(false);
          }}
        >
          <MermaidToDrawnixItem></MermaidToDrawnixItem>
        </Menu>
      </PopoverContent>
    </Popover>
  );
};
