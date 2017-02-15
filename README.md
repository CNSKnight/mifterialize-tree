# miftree

MooTools-Powered Tree Control MaterializeCSS Style *(Formerly MifTree)*

#### Changelog

+ 10/15 - Lets get this beast up to spead - just gimme a sec
+ 01/17 - This will become Mifterialize
+ 02/17 - Refactor Completed
+ 02/17 - Integrated App serving Readme, Demos, and Docs

Consult the source of this simple demo app to learn how to use the new Webpack package build.

#### Customize

It's all SASS
```
> npm install -g node-sass
> cd src/assets/
> node-sass mifterialize.scss ../../public/mifterialize.css
```

The package includes all of the feature modules and css (no more image icons);

As shipped, the package plants the CMT (and legacy Mif) objects on the window object.  Use it as you currently use eg
`new Mif.Tree({...})`. If you'd rather not have the global, consult `src/index.js` on how to import and use CMT.Tree
#### Known Issues

  - I focused on Simple/Checkboxes/Drag'n'Drop - If you want to button up the other features, feel free to do so and send a PR
  - Many demos are bonk and will not be fixed unless I need the discrete feature, but not immediately likely
  - svg icon mt-checkbox-indeterminate doesn't work [#561](https://github.com/google/material-design-icons/issues/561)
  - Docs content has not been touched and may be out of date, but may be fine as the legacy API remains intact