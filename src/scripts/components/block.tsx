import * as React from 'react';
import BlockInterface from '../interfaces/BlockInterface';
import BlockState from '../states/BlockState';
import { MineType } from '../enums/mineType';
import { TouchableHighlight, Text, TextStyle, StyleProp, Image, ImageStyle, ImageSourcePropType, Animated } from 'react-native';
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
    this.props.BlockSize.addListener(({ value }) => this.setState({ BlockSize: value }));
  }
  render() {

    let blockOffset = this.state.BlockSize * (1 - this.blockShrinkRatio) / 2;
    let buttonStyle: StyleProp<TextStyle> = {
      top: blockOffset + this.props.Top * this.state.BlockSize,
      left: blockOffset + this.props.Left * this.state.BlockSize,
      width: this.state.BlockSize * this.blockShrinkRatio,
      height: this.state.BlockSize * this.blockShrinkRatio,
      //  fontSize: this.props.BlockSize * this.fontRatio,
    };

    let imageStyle: StyleProp<ImageStyle> = {
      width: buttonStyle.width,
      height: buttonStyle.height,
      opacity: 1
    }

    let styles = this.getBlockStyles();
    styles.push(buttonStyle);

    if (this.props.IsClicked && this.props.HasMine && !this.props.IsTutorial) {
      styles.push(BlockStyles.clickedMine);
    }

    let blockContent;
    if (this.props.HighlightMine || this.props.HighlightTap) {
      var color = this.state.BlockColor.interpolate({
        inputRange: [0, 300],
         outputRange: this.props.HighlightTap? ['rgba(100, 100, 100, 1)', 'rgba(200, 200, 200, 1)']: ['rgba(150, 0, 0, 1)', 'rgba(255, 0, 0, 1)']
      });

      let animationSequence = Animated.sequence([Animated.timing(this.state.BlockColor, { toValue: 300, duration: 1000 }),
      Animated.timing(this.state.BlockColor, { toValue: 0, duration: 1000 })]);
      Animated.loop(animationSequence).start();

      blockContent = <Animated.View style={{ backgroundColor: color, flex: 1, borderRadius:5}}>
                        {this.getMineElement(imageStyle)}
                    </Animated.View>;
    }
    else {
      if (this.props.MarkedState > 0) {
        blockContent = this.getMineElement(imageStyle);
      } else {
        blockContent = <Text> {(this.props.IsClicked && this.props.Value > 0 && <Text>{this.props.Value}</Text>)}</Text>
      }
    }

    return (
      <TouchableHighlight onPress={() => this.onLeftClick()} onPressIn={() => this.onTouchStart()} onPressOut={() => this.onTouchEnd()} style={styles} underlayColor='#ddd'>
        {blockContent}
      </TouchableHighlight>
    );
  }

  private getMineElement(imageStyle: ImageStyle): any {
    return <Image source={this.getMineImagePath(this.props.MarkedState)} style={imageStyle}></Image>;
  }

  onTouchStart() {
    if (!this.isBlockTouched) {
      this.isBlockTouched = true;
      this.isLongTouch = false;
      this.blockTimer = setTimeout(() => { this.onRightClick(); this.isLongTouch = true; }, 500);
    }
  }

  onTouchEnd() {
    clearTimeout(this.blockTimer);
    this.isBlockTouched = false;
  }

  onRightClick() {
    if (!this.props.IsClicked) {
      this.props.onContextMenu();
    }
    if (this.isBlockTouched) {
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

    if (this.props.MarkedState > 0) {
      styles.push(BlockStyles.marked);
    }

    if (this.props.HighlightTap|| this.props.HighlightMine) {
   //   console.log("Get Block styles -- Highlight");
      styles.push(BlockStyles.highlight);
    }

    return styles;
  }
}