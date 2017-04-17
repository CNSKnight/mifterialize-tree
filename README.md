# miftree

MooTools-Powered Tree Control MaterializeCSS Style *(Formerly MifTree)*

#### Demos & Docs
[https://cnsknight.github.io/Mifterialize-Tree/](https://cnsknight.github.io/Mifterialize-Tree/)

#### Usage
While the demo app is constructed with materialize-css, the only dependencies you will need to use the tree is `MooTools Core v1.6` and a handful of `MooTools More` modules.

`> bower install mifterialize-tree`

Then just include or require the `dist/mifterialize-tree.js` package file in your page script.

It includes all of the tree js and css.

You'll then have the new CMT (and legacy Mif) global objects to work with.

eg `var myTree = new CMT.tree({...options});`

#### Sample & Extend
Fork the repo, then
```
> git clone <my-fork>
> cd <my-fork>
> npm install
> npm start (or npm run build)
```

Note that running `> npm run build` will give you a */build* directory.
I've shipped mifterialize-tree with a pre-built */dist* directory for your convenience.

#### Customize

It's all SASS
```
> npm install -g node-sass
> cd src/assets/styles
> node-sass mifterialize.scss mifterialize.css (-w)
```

The package includes all of the feature modules and css (no more image icons);

As shipped, the package plants the CMT (and legacy Mif) objects on the window object.  Use it as you currently use eg
`new Mif.Tree({...})`. If you'd rather not have the global, consult `src/index.js` on how to import and use CMT.Tree
#### Known Issues

  - I focused on Simple/Checkboxes/Drag'n'Drop - If you want to button up the other features, feel free to do so and send a PR
  - Many demos are bonk and will not be fixed unless I need the discrete feature, but not immediately likely
  - svg icon mt-checkbox-indeterminate doesn't work [#561](https://github.com/google/material-design-icons/issues/561)
  - Docs content has not been touched and may be out of date, but may be fine as the legacy API remains intact

#### Changelog

+ 10/15 - Lets get this beast up to spead - just gimme a sec
+ 01/17 - This will become Mifterialize
+ 02/17 - Refactor Completed
+ 02/17 - Integrated App serving Readme, Demos, and Docs
+ 02/17 - updated bower.json

Consult the source of this simple demo app to learn how to use the new Webpack package build.