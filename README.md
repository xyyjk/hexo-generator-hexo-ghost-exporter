# hexo-ghost-exporter

hexo to ghost

## Install

```
npm i -S hexo-generator-hexo-ghost-exporter
```

## Usage
1. run `hexo server` or `hexo generate` 
2. import from ghost `hexo.export.20171225.json` file
3. copy hexo '/source/assets/' to ghost '/content/images/hexo/' directory
```
cp -r hexo/source/assets/ ghost/content/images/hexo/
```