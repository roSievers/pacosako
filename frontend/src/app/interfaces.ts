import { PacoBoard } from '../../../shared/types';
import { Observable } from 'rxjs';

/**
 * Encapsulates access to the board service and is bound to a specific board id.
 * At some point, I may also use it to implement chess riddles or local
 * AI games, both of which require interactivity without having a board id.
 */
export interface IBoardProvider {
  board: Observable<PacoBoard>;
  storeBoard: (board: PacoBoard) => void;
}
