import { Subject } from 'rxjs';

export class MessagesService {

  messagesChanged: Subject<{ content: string, type: string }>;

  constructor() {
    this.messagesChanged = new Subject<{ content: string, type: string }>();
  }

  pushMessage(message: {content: string, type: string}) {
    this.messagesChanged.next(message);
  }

}
