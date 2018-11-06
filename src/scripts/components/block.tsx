import * as React from 'react';
import BlockInterface from '../interfaces/BlockInterface';
import { CSSProperties } from 'react';
import BlockState from '../states/BlockState';
import { MineType } from '../enums/mineType';
// import '../../css/block.less';

export default class Block extends React.Component<BlockInterface, BlockState> {

  private blockShrinkRatio: number = 0.8525;
  private fontRatio: number = 0.3;
  private blockTimer: any;
  private isBlockTouched: boolean;
  private isChrome: boolean;
  constructor(props: any) {
    super(props);

    this.state = new BlockState();
  }
  render() {
    let blockOffset = this.props.BlockSize * (1 - this.blockShrinkRatio) / 2;
    let styles: CSSProperties = {
      top: blockOffset + this.props.Top * this.props.BlockSize,
      left: blockOffset + this.props.Left * this.props.BlockSize,
      width: this.props.BlockSize * this.blockShrinkRatio,
      height: this.props.BlockSize * this.blockShrinkRatio,
      backgroundSize: this.props.BlockSize * this.blockShrinkRatio,
      fontSize: this.props.BlockSize * this.fontRatio
    };

    this.isChrome = this.isChromeBrowser();
    let classNames: [string] = this.getClassNames();
    return (
      <div
        className={classNames.join(' ')}
        style={styles}
        onClick={() => this.onLeftClick()}
        onContextMenu={(e) => this.onRightClick(e)}
        onTouchStart={(e) => this.onTouchStart(e)}
        onTouchEnd={(e) => this.onTouchEnd(e)}
      >{(this.props.IsClicked && this.props.Value > 0 && <div>{this.props.Value}</div>)}</div>
    );
  }

  isChromeBrowser() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }
  onTouchStart(_e: any) {
    if (!this.isBlockTouched || !this.isChrome) {
      this.isBlockTouched = true;
      this.blockTimer = setTimeout(() => { this.onRightClick(undefined); }, 500);
    }
  }

  onTouchEnd(_e: any) {
    clearTimeout(this.blockTimer);
    this.isBlockTouched = false;
  }

  onRightClick(e: any) {
    if (e != undefined && this.isBlockTouched) {
      return;
    }

    if (e != undefined) {
      e.preventDefault();
    }
    if (e != undefined || this.isBlockTouched) {
      window.navigator.vibrate(100);
      if (!this.props.IsClicked) {
        this.props.onContextMenu();
      }
      if (this.isBlockTouched && this.isChrome) {
        this.blockTimer = setTimeout(() => { this.onRightClick(undefined); }, 500);
      }
    }
  }

  onLeftClick() {
    if (!this.props.IsClicked) {
      this.props.onClick();
    }
  }

  getClassNames(): [string] {
    let classNames: [string] = ['block'];
    if (this.props.IsClicked) {
      classNames.push('clicked');
    }

    if (this.props.IsClicked && this.props.HasMine) {
      classNames.push('clickedMine');
    }
    switch (this.props.MarkedState) {
      case MineType.Large:
        classNames.push('bigMine');
        break;
      case MineType.Medium:
        classNames.push('mediumMine');
        break;
      case MineType.Small:
        classNames.push('smallMine');
        break;
      default:
        classNames.push('');
        break;
    }

    if (this.props.MarkedState > 0) {
      classNames.push('marked');
    }
    return classNames;
  }
}