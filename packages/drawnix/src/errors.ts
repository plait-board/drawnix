export class AbortError extends DOMException {
  constructor(message = 'Request Aborted') {
    super(message, 'AbortError');
  }
}
