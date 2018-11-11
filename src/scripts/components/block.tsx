import * as React from 'react';
import BlockInterface from '../interfaces/BlockInterface';
import BlockState from '../states/BlockState';
import { MineType } from '../enums/mineType';
import { TouchableHighlight, Text, Vibration, TextStyle, StyleProp, Image, ImageStyle, ImageSourcePropType } from 'react-native';
import BlockStyles from '../../styles/blockStyles';

export default class Block extends React.Component<BlockInterface, BlockState> {

  private blockShrinkRatio: number = 0.8525;
  //private fontRatio: number = 0.3;
  private blockTimer: any;
  private isBlockTouched: boolean;
  private isLongTouch: boolean;
  constructor(props: any) {
    super(props);

    this.state = new BlockState();
  }
  render() {
    let blockOffset = this.props.BlockSize * (1 - this.blockShrinkRatio) / 2;
    let buttonStyle: StyleProp<TextStyle> = {
      top: blockOffset + this.props.Top * this.props.BlockSize,
      left: blockOffset + this.props.Left * this.props.BlockSize,
      width: this.props.BlockSize * this.blockShrinkRatio,
      height: this.props.BlockSize * this.blockShrinkRatio,
      //  fontSize: this.props.BlockSize * this.fontRatio,
    };

    let imageStyle: StyleProp<ImageStyle> = {
      width: buttonStyle.width,
      height: buttonStyle.height
    }

    let styles = this.getBlockStyles();
    styles.push(buttonStyle);

    if (this.props.IsClicked && this.props.HasMine) {
      styles.push(BlockStyles.clickedMine);
    }

    let blockContent;
    if (this.props.MarkedState > 0) {
      blockContent = <Image source={this.getMineImagePath(this.props.MarkedState)} style={imageStyle} ></Image>;
    } else {
      blockContent = <Text> {(this.props.IsClicked && this.props.Value > 0 && <Text>{this.props.Value}</Text>)}</Text>
    }

    return (
      <TouchableHighlight onPress={() => this.onLeftClick()} onPressIn={() => this.onTouchStart()} onPressOut={()=>this.onTouchEnd()} style={styles} underlayColor='#ddd'>
        {blockContent}
      </TouchableHighlight>
    );
  }

  onTouchStart() {
    if (!this.isBlockTouched) {
      this.isBlockTouched = true;
      this.isLongTouch= false;
      this.blockTimer = setTimeout(() => { this.onRightClick(); this.isLongTouch= true;}, 500);
    }
  }

  onTouchEnd() {
    clearTimeout(this.blockTimer);
    this.isBlockTouched = false;
  }

  onRightClick() {
    Vibration.vibrate(100, false);
    if (!this.props.IsClicked) {
      this.props.onContextMenu();
    }
    if(this.isBlockTouched){
      this.blockTimer = setTimeout(() => { this.onRightClick() }, 500);
   }
  }

  onLeftClick() {
    if (!this.props.IsClicked && !this.isLongTouch) {
      this.props.onClick();
    }
  }

  getMineImagePath(mineType: MineType): ImageSourcePropType {
    switch (mineType) {
      case MineType.Large:
        return require('../../../assets/images/BigMine.png');
      case MineType.Medium:
        return require('../../../assets/images/MediumMine.png');
      case MineType.Small:
        return require('../../../assets/images/SmallMine.png');
      default:
        return null;
    }
  }

  getBlockStyles(): any[] {
    let styles: any[] = new Array(0);
    styles.push(BlockStyles.block);

    if (this.props.IsClicked) {
      styles.push(BlockStyles.clicked);
    }
 
    return styles;
  }
}