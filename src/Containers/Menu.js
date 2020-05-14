import React from 'react';
import DesktopMenu from '../Components/MenuComponents/DesktopMenu';
import MobileMenu from '../Components/MenuComponents/MobileMenu';
import Hidden from '@material-ui/core/Hidden';

export default function Menu(props){
  const {recipeList, menuList, setMenuList} = props

  return (
    <React.Fragment>
      <Hidden mdDown>
        <DesktopMenu />
      </Hidden>
      <Hidden lgUp>
        <MobileMenu recipeList={recipeList} menuList={menuList} setMenuList={setMenuList} />
      </Hidden>
    </React.Fragment>
  )
}