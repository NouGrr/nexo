# NEXO

**Tous vos outils. Un seul univers.**

- [Pixo](https://nougrr.github.io/pixo-editor/) — Retouche photo simplifiée
- [Doxo](https://nougrr.github.io/doxo/) — Modification de PDF
- [Vixo](https://nougrr.github.io/vixo-editor/) — Montage vidéo simplifié

## Site

- [NEXO](https://nougrr.github.io/nexo/) - Tous vos outils. Un seul univers

Portail responsive avec animations, thème clair/sombre, recherche (Ctrl/⌘ K), raccourcis 1/2/3 et mémorisation de la dernière application ouverte.

## Développement

Le site est statique, sans installation ni compilation. Les fichiers publiés se trouvent dans `dist/`.

```sh
python3 -m http.server 4173 --directory dist
```

## Publication

Chaque push sur `main` publie `dist/` sur GitHub Pages avec le workflow `.github/workflows/pages.yml`.
