import {
  IconSearch, IconChevronDown,
  IconBell, IconStar, IconPlusCircle, IconAgentAstro, IconTrailhead,
  IconQuestion, IconSetup, IconAppsWaffle,
} from './Icons'
import avatarSrc from '../assets/header-avatar.png'

/* Salesforce cloud logo — exact path from Figma node 967:158536 */
function SalesforceLogo({ width = 46 }) {
  const h = Math.round(width * (42 / 61))
  return (
    <svg width={width} height={h} viewBox="0 0 61 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.524 4.65374C27.5144 2.6759 30.2073 1.39612 33.2514 1.39612C37.2322 1.39612 40.7447 3.60665 42.618 6.86427C44.2572 6.1662 46.0134 5.70083 47.8868 5.70083C55.1459 5.70083 61 11.518 61 18.7313C61 25.9446 55.1459 31.7618 47.8868 31.7618C46.9501 31.7618 46.1305 31.6454 45.3109 31.5291C43.6718 34.4377 40.5106 36.4155 36.881 36.4155C35.3589 36.4155 33.9539 36.0665 32.666 35.4848C31.0269 39.3241 27.1631 42 22.5969 42C17.9136 42 13.8157 39.0914 12.2937 34.903C11.5912 35.0194 10.8887 35.1357 10.1862 35.1357C4.56622 35.1357 0 30.5983 0 25.0139C0 21.2909 1.9904 18.0332 5.03455 16.2881C4.44914 14.892 4.09789 13.2632 4.09789 11.6343C4.09789 5.23546 9.3666 0 15.9232 0C20.0211 0.116343 23.4165 1.8615 25.524 4.65374Z"
        fill="#00A1E0"
      />
    </svg>
  )
}

/* Generic 32×32 icon button */
function HeaderIconBtn({ label, children }) {
  return (
    <button aria-label={label} className="gh-icon-btn">
      {children}
    </button>
  )
}

export default function GlobalHeader({ activeNav = 'Commit Workspace' }) {
  const displayNav = activeNav === 'Commits'
    ? ['Home', 'chatter', 'Forecast', 'Reports', 'Dashboards', 'Contacts', 'Commits', 'More']
    : ['Home', 'chatter', 'Forecast', 'Reports', 'Dashboards', 'Contacts', 'Commit Workspace', 'More']

  return (
    <>
      {/* Global header — 64px, matches Figma node 966:158482 */}
      <header className="sf-global-header" role="banner">

        {/* Left: Salesforce cloud logo */}
        <div className="gh-logo">
          <SalesforceLogo width={46} />
        </div>

        {/* Center: search — pill shaped */}
        <div className="gh-search">
          <span className="gh-search-icon"><IconSearch size={14} /></span>
          <input
            type="search"
            placeholder="Search..."
            className="gh-search-input"
            aria-label="Global search"
          />
        </div>

        {/* Right: actions — exact order from Figma node 968:158589 */}
        <div className="gh-actions">

          {/* Agent Astro */}
          <HeaderIconBtn label="Agentforce">
            <IconAgentAstro size={18} />
          </HeaderIconBtn>

          {/* Favorites — split button: star | chevron */}
          <div className="gh-split-btn" role="group" aria-label="Favorites">
            <button className="gh-split-btn-main" aria-label="Favorites">
              <IconStar size={15} />
            </button>
            <button className="gh-split-btn-arrow" aria-label="Favorites menu">
              <IconChevronDown size={10} />
            </button>
          </div>

          {/* New */}
          <HeaderIconBtn label="New">
            <IconPlusCircle size={18} />
          </HeaderIconBtn>

          {/* Trailhead */}
          <HeaderIconBtn label="Trailhead">
            <IconTrailhead size={18} />
          </HeaderIconBtn>

          {/* Help / Question */}
          <HeaderIconBtn label="Help">
            <IconQuestion size={18} />
          </HeaderIconBtn>

          {/* Setup */}
          <HeaderIconBtn label="Setup">
            <IconSetup size={18} />
          </HeaderIconBtn>

          {/* Notification bell */}
          <HeaderIconBtn label="Notifications">
            <IconBell size={18} />
          </HeaderIconBtn>

          {/* User avatar — real photo from Figma */}
          <button className="gh-avatar" aria-label="User menu">
            <img src={avatarSrc} alt="" className="gh-avatar-img" />
          </button>

        </div>
      </header>

      {/* App nav */}
      <nav className="sf-app-nav" aria-label="App navigation">
        {/* App launcher + app name */}
        <div className="sf-app-launcher">
          <button className="sf-app-launcher-btn" aria-label="App launcher">
            <IconAppsWaffle size={18} />
          </button>
          <span className="sf-app-name">Sales</span>
        </div>
        <div className="sf-app-nav-divider" aria-hidden="true" />

        {/* Nav items */}
        {displayNav.map(item => (
          <span
            key={item}
            className={`sf-nav-item${item === activeNav ? ' active' : ''}`}
            role="menuitem"
            tabIndex={0}
          >
            {item}
            <span className="nav-chevron" aria-hidden="true">
              <IconChevronDown size={10} />
            </span>
          </span>
        ))}
      </nav>
    </>
  )
}
