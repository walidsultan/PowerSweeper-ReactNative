import BlockInterface from '../interfaces/BlockInterface';
import { MineType } from '../enums/mineType';
import { Animated } from 'react-native';

export default class BlockType implements BlockInterface {
    Left: number;
    Top: number;
    Value: number;
    BlockSize: Animated.Value;
    onClick: any;
    onContextMenu: any;
    HasMine: boolean;
    Mine: MineType;
    IsClicked: boolean;
    MarkedState: MineType = 0;
    IsTutorial:boolean =false;
    HighlightTap:boolean;
    HighlightMine:boolean;
}