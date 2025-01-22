export class UIInjector {
  private container: HTMLElement | null = null;

  injectAnalysisUI(analysis: any) {
    if (!this.container) {
      this.container = this.createContainer();
    }

    this.container.innerHTML = this.generateHTML(analysis);
    this.attachEventListeners();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'prosperiq-analysis';
    container.className = 'prosperiq-floating-panel';
    document.body.appendChild(container);
    return container;
  }
}
