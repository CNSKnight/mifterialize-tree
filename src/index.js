/**
 * CNSKnight Mifterialize (Formerly Mif) Tree
 */
import Tree from './Core/Tree';

import Trag from './More/Tree.Trag';
import KeyNav from './More/Tree.KeyNav';
import CookieStorage from './More/Tree.CookieStorage';

Tree.Trag = Tree.Drag = Trag;
Tree.KeyNav = KeyNav;
Tree.CookieStorage = CookieStorage;

const CMT = {
    // @note id and ids have been moved to CMT.state
    Tree: Tree
};
// Mif is the legacy object name and kept here in the demo App for use by the demos.js's
window.CMT = window.Mif = CMT;
export default CMT;