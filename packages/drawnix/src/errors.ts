export class AbortError extends DOMException {
  constructor(message: string = 'Request Aborted') {
    super(message, 'AbortError');
  }
}
