export class AnalysisOverlay {
  private element: HTMLElement;

  constructor() {
    this.element = this.createOverlay();
    this.attachEventListeners();
  }

  show(analysis: any) {
    this.updateContent(analysis);
    this.element.style.display = 'block';
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'prosperiq-overlay';
    // Add overlay structure
    return overlay;
  }
}
