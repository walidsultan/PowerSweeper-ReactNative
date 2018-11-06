import BlockInterface from '../interfaces/BlockInterface';
import { MineType } from '../enums/mineType';

export default class BlockType implements BlockInterface {
    Left: number;
    Top: number;
    Value: number;
    BlockSize: number;
    onClick: any;
    onContextMenu: any;
    HasMine: boolean;
    Mine: MineType;
    IsClicked: boolean;
    MarkedState: MineType = 0;
}