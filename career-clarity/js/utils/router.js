// ─── Hash-based SPA Router ───

class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.onNavigate = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const handler = this.routes[hash] || this.routes['/'];

    if (handler) {
      const app = document.getElementById('app');
      const currentEl = app.firstElementChild;

      // Page exit animation
      if (currentEl) {
        currentEl.classList.add('page-exit');
        setTimeout(() => {
          handler(app);
          this.currentPage = hash;
          this.updateNavLinks(hash);
          if (this.onNavigate) this.onNavigate(hash);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 250);
      } else {
        handler(app);
        this.currentPage = hash;
        this.updateNavLinks(hash);
        if (this.onNavigate) this.onNavigate(hash);
      }
    }
  }

  updateNavLinks(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const page = link.getAttribute('data-page');
      const linkHash = link.getAttribute('href')?.slice(1) || '/';
      link.classList.toggle('active', linkHash === hash);
    });
  }

  start() {
    this.resolve();
  }
}

export default Router;
