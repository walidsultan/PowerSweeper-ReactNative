import HighScoreType from "../types/HighScoreType";

export default class HighScoresState {
  index = 0;
  routes = [
    { key: 'Easy', title: 'Easy' },
    { key: 'Medium', title: 'Medium' },
    { key: 'Hard', title: 'Hard' },
  ];

  easyHighscores: HighScoreType[];
  mediumHighscores: HighScoreType[];
  hardHighscores: HighScoreType[];

  isSendingFeedback:boolean=true;
}