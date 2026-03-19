'use client';
import { Menu } from '@base-ui/react/menu';
import { Menubar } from '@base-ui/react/menubar';
import { classNames } from '@lib/react/client/dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import type {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  RefObject,
} from 'react';
import { createContext, use, useRef } from 'react';
import { signOut } from '../_actions/sign-out.ts';
import type { LinkProps } from '../_components/link.tsx';
import { Link } from '../_components/link.tsx';
import type { CurrentUser } from '../_types/current-user.ts';
import styles from './navigation.module.css';

export type NavigationProps = Omit<ComponentProps<'nav'>, 'children'> & {
  readonly user: CurrentUser;
};

export function Navigation({ user, ...props }: NavigationProps): ReactElement {
  const rootClassName = classNames(props, styles.Root);
  return (
    <nav {...props} className={rootClassName}>
      <Menubar className={styles.List} modal orientation="vertical">
        <MenuItem href="/" matchExact>
          <Label icon={GridViewIcon}>ダッシュボード</Label>
        </MenuItem>
        <MenuItem href="#">
          <Label icon={ListAltIcon}>商品管理</Label>
        </MenuItem>
        <MenuItem href="#">
          <Label icon={ManageSearchIcon}>注文検索</Label>
        </MenuItem>
        <MenuItem hasSubmemu>
          <MenuItemLabel>
            <Label icon={ManageAccountsIcon}>管理者メニュー</Label>
          </MenuItemLabel>
          <SubmenuRoot>
            <Submenu>
              <SubmenuItem href="#">お知らせ管理</SubmenuItem>
              <SubmenuItem href="#">ユーザー管理</SubmenuItem>
            </Submenu>
          </SubmenuRoot>
        </MenuItem>
        <MenuItem hasSubmemu>
          <MenuItemLabel>
            <Label icon={AccountCircleIcon}>{user.name}</Label>
          </MenuItemLabel>
          <SubmenuRoot>
            <Submenu>
              <SubmenuItem onClick={() => void signOut()}>
                ログアウト
              </SubmenuItem>
              <SubmenuItem href="#">アカウント情報</SubmenuItem>
            </Submenu>
          </SubmenuRoot>
        </MenuItem>
      </Menubar>
    </nav>
  );
}

interface MenuItemContext {
  readonly ref: RefObject<HTMLElement | null>;
}
const MenuItemContext = createContext<MenuItemContext | null>(null);

function MenuItem({
  hasSubmemu,
  ...props
}: Parameters<typeof MenuItemLabel>[0] & {
  readonly hasSubmemu?: boolean | undefined;
}): ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  return (
    <div className={styles.Item} ref={ref as RefObject<HTMLDivElement>}>
      <MenuItemContext value={{ ref }}>
        <Menu.Root>
          {hasSubmemu ? props.children : <MenuItemLabel {...props} />}
        </Menu.Root>
      </MenuItemContext>
    </div>
  );
}

function MenuItemLabel({
  excludeActive,
  excludeSemiActive,
  href,
  matchExact,
  ...props
}: Menu.Trigger.Props &
  Pick<LinkProps, 'excludeActive' | 'excludeSemiActive'> & {
    readonly href?: Parameters<typeof Link>[0]['href'] | undefined;
    readonly matchExact?: boolean | undefined;
  }): ReactElement {
  return (
    <Menu.Trigger
      {...props}
      className={classNames(
        styles.Link,
        matchExact ? 'active-only' : undefined,
      )}
      nativeButton={href ? false : true}
      openOnHover={false}
      render={
        href ? (
          <MenuItemLink
            excludeActive={excludeActive}
            excludeSemiActive={excludeSemiActive}
            href={href}
          />
        ) : undefined
      }
    />
  );
}

function Label({
  children,
  icon: Icon,
}: PropsWithChildren & {
  readonly icon: FunctionComponent<{ className: string | undefined }>;
}): ReactElement {
  return (
    <span className={styles.Label}>
      <Icon className={styles.LabelIcon} />
      <span className={styles.LabelText}>{children}</span>
    </span>
  );
}

function MenuItemButton(props: ComponentProps<'button'>): ReactElement {
  return (
    <button
      {...props}
      // overwrites set by base ui
      aria-haspopup={undefined}
      type={undefined}
    />
  );
}

function MenuItemLink({ href, ...props }: LinkProps): ReactElement {
  return (
    <Link
      {...props}
      href={href}
      // overwrites set by base ui
      aria-haspopup={undefined}
    />
  );
}

function SubmenuRoot(props: Menu.Positioner.Props): ReactElement {
  const container = use(MenuItemContext)?.ref;
  return (
    <Menu.Portal container={container}>
      <Menu.Positioner
        align="start"
        arrowPadding={0}
        className={styles.Positioner}
        positionMethod="fixed"
        side="right"
        {...props}
      />
    </Menu.Portal>
  );
}

function Submenu(props: Menu.Popup.Props): ReactElement {
  return <Menu.Popup {...props} render={<ul />} className={styles.Submenu} />;
}

function SubmenuItem({
  formAction,
  href,
  ...props
}: Menu.Item.Props & {
  readonly formAction?:
    | Parameters<typeof MenuItemButton>[0]['formAction']
    | undefined;
  readonly href?: Parameters<typeof MenuItemLink>[0]['href'] | undefined;
}): ReactElement {
  const render = href ? (
    <MenuItemLink href={href} />
  ) : formAction ? (
    <MenuItemButton formAction={formAction} />
  ) : undefined;
  return (
    <li className={styles.SubmenuItem}>
      <Menu.Item
        {...props}
        render={render}
        nativeButton={formAction ? true : false}
        className={styles.SubmenuItemLink}
        closeOnClick
      />
    </li>
  );
}
