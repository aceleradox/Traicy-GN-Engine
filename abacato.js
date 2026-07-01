(function (global) {
  const api = {
    async loadJSON(url) {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
      return response.json();
    },

    async loadText(url) {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
      return response.text();
    },

    resolve(url) {
      if (!url) return '';
      if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
      return `./${url.replace(/^\.\//, '')}`;
    },

    assetPath(type, name) {
      return `resource/${type}/${name}`;
    },

    async loadProjectConfig(url = 'sub-script.json') {
      try {
        return await this.loadJSON(this.resolve(url));
      } catch (error) {
        console.warn('abacato: config fallback ativo', error);
        return {
          project: { name: 'Sprite Easy', target: ['github-pages', 'defold'] },
          sprites: [],
          maps: [],
          scenes: []
        };
      }
    }
  };

  global.Abacato = api;
  global.abacato = api;
})(window);
