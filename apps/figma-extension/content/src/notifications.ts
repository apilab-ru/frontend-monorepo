const containerStyles = `
    background: black;
    color: rgb(255, 255, 255);
    transition: all 0.3s ease 0s;
    padding: 10px 16px;
    position: fixed;
    z-index: 99;
    bottom: -60px;
    border-radius: 6px;
    transform: translateX(-50%);
    left: 50%;
    font-family: Inter, sans-serif;
    font-size: 14px;
`

function setCssStyles(element: HTMLElement, styles: string): void {
  styles.trim().split('\n').forEach(style => {
    const [key, value] = style.split(':');
    element.style.setProperty(key.trim(), value.replace(';', '').trim())
  })
}

export class NotificationsService {
  private container: HTMLElement;
  private timerRef?: any;

  constructor() {
    this.container = document.createElement('div');

    setCssStyles(this.container, containerStyles);

    document.body.append(this.container);
  }

  message(message: string): void {
    clearTimeout(this.timerRef);

    this.container.innerText = message;
    this.container.style.setProperty('bottom', '10px');

    this.timerRef = setTimeout(() => {
      this.container.style.setProperty('bottom', '-60px');
    }, 2500)
  }
}