import { PageView } from '../enums/pageView';
import { Difficulty } from '../enums/difficulty';

export default class RouterState {
    pageView: PageView = PageView.Menu;
    levelDifficulty: Difficulty;
    isAssistEnabled:boolean= true;
}