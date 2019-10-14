export default class DesktopClientError extends Error{
  constructor(message, inner) {
    super(message);
    this.inner = inner;
  }
}