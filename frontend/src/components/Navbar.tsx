import { Link, useNavigate } from 'react-router-dom';
import { navbarStyles } from '../assets/dummyStyles.js';
import logo from '../assets/logo.png';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SignedOut, useAuth, useClerk, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user } = useUser();
  console.log({ user });
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const clerk = useClerk();

  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const TOKEN_KEY = 'token';

  // for token generation (meaning fetch and store also)
  // const fetchAndStoreToken = useCallback(
  //   async (options = {}) => {
  //     try {
  //       if (!getToken) {
  //         return null;
  //       }
  //       const token = await getToken(options).catch(() => null);
  //       if (token) {
  //         try {
  //           localStorage.setItem(TOKEN_KEY, token);
  //           console.log(token);
  //         } catch (error) {}
  //         return token;
  //       } else return null;
  //     } catch (err) {
  //       return null;
  //     }
  //   },
  //   [getToken],
  // );

  // keep the localstorage in sync with clerk auth state
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     if (isSignedIn) {
  //       const t = await fetchAndStoreToken({ template: 'default' }).catch(
  //         () => null,
  //       );
  //       if (!t && mounted) {
  //         await fetchAndStoreToken({ forceRefresh: true }).catch(() => null);
  //       }
  //     } else {
  //       try {
  //         localStorage.removeItem(TOKEN_KEY);
  //       } catch (error) {}
  //     }
  //   })();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [isSignedIn, fetchAndStoreToken]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isLoaded, isSignedIn]);

  // Close profile popover on outside click
  useEffect(() => {
    function onDocClick(e: PointerEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      document.addEventListener('pointerdown', onDocClick);
    }
    return () => {
      document.removeEventListener('pointerdown', onDocClick);
    };
  }, [profileOpen]);

  const openSignIn = () => {
    try {
      if (clerk && typeof clerk.openSignIn === 'function') {
        clerk.openSignIn();
      } else {
        navigate('/signup');
      }
    } catch (e) {
      console.error('Open Sign Up failed: ', e);
      navigate('/signup');
    }
  };

  // to open signup model
  function openSignUp() {
    try {
      if (clerk && typeof clerk.openSignUp === 'function') {
        clerk.openSignUp();
      } else {
        navigate('/login');
      }
    } catch (e) {
      console.error('Open Sign Up failed: ', e);
      navigate('/login');
    }
  }

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <nav className={navbarStyles.nav}>
          <div className={navbarStyles.logoSection}>
            <Link to="/" className={navbarStyles.logoLink}>
              <img src={logo} alt="logo" className={navbarStyles.logoImage} />
              <span className={navbarStyles.logoText}>Invio</span>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <a href="#features" className={navbarStyles.navLink}>
                Features
              </a>
              <a href="#pricing" className={navbarStyles.navLink}>
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={navbarStyles.authSection}>
              <SignedOut>
                <button
                  onClick={openSignIn}
                  className={navbarStyles.signInButton}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignUp}
                  className={navbarStyles.signUpButton}
                  type="button"
                >
                  <div className={navbarStyles.signUpOverlay}></div>
                  <span className={navbarStyles.signUpText}>Get Started</span>
                  <svg
                    className={navbarStyles.signUpIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </SignedOut>
            </div>

            {/* mobile toggle view */}
            <button
              onClick={() => setOpen(!open)}
              className={navbarStyles.mobileMenuButton}
            >
              <div className={navbarStyles.mobileMenuIcon}>
                <span
                  className={`${navbarStyles.mobileMenuLine1} ${open ? navbarStyles.mobileMenuLine1Open : navbarStyles.mobileMenuLine1Closed}`}
                ></span>
                <span
                  className={`${navbarStyles.mobileMenuLine2} ${open ? navbarStyles.mobileMenuLine2Open : navbarStyles.mobileMenuLine2Closed}`}
                ></span>
                <span
                  className={`${navbarStyles.mobileMenuLine3} ${open ? navbarStyles.mobileMenuLine3Open : navbarStyles.mobileMenuLine3Closed}`}
                ></span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`${open ? 'block' : 'hidden'} ${navbarStyles.mobileMenu}`}
      >
        <div className={navbarStyles.mobileMenuContainer}>
          <a href="#features" className={navbarStyles.mobileNavLink}>
            Features
          </a>
          <a href="#pricing" className={navbarStyles.mobileNavLink}>
            Pricing
          </a>
          <div className={`${navbarStyles.mobileAuthSection}`}>
            <SignedOut>
              <button
                onClick={openSignIn}
                className={navbarStyles.mobileSignIn}
              >
                Sign In
              </button>
              <button
                onClick={openSignUp}
                className={navbarStyles.mobileSignUp}
              >
                Get Started
                <svg
                  className={navbarStyles.signUpIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
